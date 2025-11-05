import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UserData } from "./mongoose.js";
import jwt from "jsonwebtoken";
import { AdminData } from "./mongoose.js";
import addRandomQuestion from "./utils/randomquestion.js";

const app = express();
const PORT = 4000;

dotenv.config();

const startingQuestions = process.env.starting_Questions
const attack_after_which_question = process.env.attack_after_which_question;
const SECRET = process.env.SECRET;
const after = Number(process.env.attack_after_which_question);
const before = Number(process.env.attack_before_which_question);

app.use(cors());
app.use(express.json());

const { default: questions } = await import('./ques.json', { with: { type: 'json' } });

// -------- JWT Middleware --------
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}


app.get('/getquestions', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id
        const data = await UserData.findById(userid);
        const tokens = data.points
        const rewards= data.rewards
        const { question, attackIndex } = await addRandomQuestion(userid);
        res.json({ question, tokens, rewards , attackIndex })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { user } = req.body;
        const existing = await UserData.findOne({ email: user.email });
        if (existing) {
            const token = jwt.sign(
                { id: existing._id, email: existing.email, role: "user" },
                SECRET,
                { expiresIn: "1h" })
            res.json(token)
        }
        else {
            const created = await UserData.create({
                name: user.name,
                email: user.email,
            });

            const token = jwt.sign(
                { id: created._id, email: created.email, role: "user" },
                SECRET,
                { expiresIn: "1h" })
            res.json(token)
        }

    }
    catch (err) {
        console.error("error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const existing = await AdminData.findOne({ name: username, password: password })
        if (existing) {
            if (existing.password === password) {
                const token = jwt.sign(
                    { id: existing._id, name: existing.name, role: "admin" },
                    SECRET,
                    { expiresIn: "1h" })
                res.json(token)
            }
        }
    }
    catch (err) {
        console.log('err', err)
    }

})

app.get("/getranking", async (req, res) => {
    try {
        const datas = await UserData.find({});
        const sorted = datas.sort((a, b) => b.points - a.points);
        res.json(sorted);
    } catch (err) {
        console.error("Error in /getranking:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/checkans', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id;
        const rewardPoints = 5;
        let existing = await UserData.findById(userid);
        let { userans, quesid, tokens, reward, tokenInput } = req.body;
        
        const currentquestion = questions.find(q => q.id === quesid);

        if (!currentquestion)
            return res.status(404).json({ success: false, message: "Question not found" });

        if (Number(currentquestion.correct_answer) === Number(userans)) {
            reward = Number(reward) + rewardPoints
            tokens = Number(tokens) - Number(tokenInput)

            const updating = existing.questions.find(q => q.id === quesid);
            if (updating) {
                updating.status = 'success';
                existing.markModified('questions');
                await existing.save()
                const { question, attackIndex } = await addRandomQuestion(userid)
                return res.json({question, tokens, reward, attackIndex})
            }
        }

        else {
            tokens = tokens - tokenInput
            const updating = existing.questions.find(q => q.id === quesid);
            if (updating) {
                updating.status = 'failed';
                existing.markModified('questions');
                await existing.save();
                const question = existing.questions
                return res.json({ question, tokens, reward })
            }
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
})

app.post('/attack', async (req, res) => {
    let { blocks, usedIds } = req.body;
    const before = Number(process.env.attack_before_which_question);
    const after = Number(process.env.attack_after_which_question);
    const factor = before - after;

    const randomIndex1 = Math.floor(Math.random() * factor);
    const total = questions.length;
    let selectedQuestion;

    do {
        let randomIndex = Math.floor(Math.random() * total);
        selectedQuestion = questions[randomIndex];
    } while (usedIds.includes(selectedQuestion.id));

    const newBlocks = blocks.map((n, i) =>
        i === (randomIndex1 + after) ? selectedQuestion : n
    );

    for (let i = 0; i < blocks.length; i++) {
        if (i > randomIndex1) {
            if (blocks[i].status === 'success' || blocks[i].status === 'failed') {
                blocks[i].status = 'pending';
            }
        }
    }
    res.json(newBlocks);
});



app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
