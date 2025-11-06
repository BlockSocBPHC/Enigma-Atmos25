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

const conversionFactor = process.env.consversion_factor 
const SECRET = process.env.SECRET;


app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
});

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
        const tokens = data.tokens
        const rewards = data.rewards

        const { question, attackIndex } = await addRandomQuestion(userid);
        res.json({ question, tokens, rewards, attackIndex })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
})

app.get('/currentquestion', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id;
        const data = await UserData.findById(userid);

        if (data) 
            return res.json({ question: data.questions });

        res.status(404).json({ message: "User not found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/conversion', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id;
        let { reward, tokens, convert } = req.body;

        reward = Number(reward);
        tokens = Number(tokens);
        convert = Number(convert);

        // Update values
        tokens = tokens + convert * conversionFactor;
        reward = reward - convert ;

        // Find user and update
        const data = await UserData.findById(userid);
        if (!data) return res.status(404).json({ message: "User not found" });

        let points = Number(data.points);
        points = tokens + reward * 15

        data.tokens = tokens;
        data.rewards = reward;
        data.points = points

        await data.save();

        res.json({ tokens: data.tokens, reward: data.rewards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { user } = req.body;
        const existing = await UserData.findOne({ email: user.email });
        if (existing) {
            const token = jwt.sign(
                { id: existing._id, email: existing.email, role: "user" },
                SECRET,
                { expiresIn: "6h" })
            res.json(token)
        }   else {
                const first = user.given_name.split(' ')[0]
                const created = await UserData.create({
                    name: user.name,
                    email: user.email,
                    firstName: first
                });

                const token = jwt.sign(
                    { id: created._id, email: created.email, role: "user" },
                    SECRET,
                    { expiresIn: "6h" })
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
        let points = Number(existing.points);
        
        let { userans, quesid, tokens, reward, tokenInput } = req.body;

        const currentquestion = questions.find(q => q.id === quesid);

        if (!currentquestion)
            return res.status(404).json({ success: false, message: "Question not found" });

        if (Number(currentquestion.correct_answer) === Number(userans)) {
            reward = Number(reward) + rewardPoints
            tokens = Number(tokens) - Number(tokenInput)
            points = tokens + reward * 15
            existing.tokens = tokens
            existing.rewards = reward
            existing.points = points
            const updating = existing.questions.find(q => q.id === quesid);
            if (updating) {
                updating.status = 'success';
                existing.markModified('questions');
                await existing.save()
                const { question, attackIndex } = await addRandomQuestion(userid)
                return res.json({ question, tokens, reward, attackIndex })
            }
        }

        else {
            tokens = tokens - tokenInput
            points = tokens + reward * 15
            existing.tokens = tokens
            existing.rewards = reward
            existing.points = points

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

app.get('/gettokens', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id
        const data = await UserData.findById(userid)
        if (!data)
            return res.status(404).json({ success: false, message: 'User not found' });
        const tokens = data.tokens
        const rewards = data.rewards
        res.json({ tokens, rewards })
    }
    catch (err) {
        console.error('Error fetching tokens:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/getuserdata', authenticateToken, async (req,res) => {
    const userid = req.user.id
    const user = await UserData.findById(userid)
    if (user)
        res.json({name: user.firstName})

})


app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
