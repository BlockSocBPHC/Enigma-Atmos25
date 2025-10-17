import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const Total_Questions = process.env.Total_Questions
const num_of_questions_at_a_time = process.env.num_of_questions_at_a_time
const num_of_attack_question = process.env.num_of_attack_question
const attack_after_which_question = process.env.attack_after_which_question

const app = express()
const PORT = 4000

app.use(cors());
app.use(express.json());

const { default: questions } = await import('./ques.json', { with: { type: 'json' } });

app.post("/getquestions", async (req, res) => {
    try {
        const usedIds = req.body; 
        const Total_Questions = questions.length;

        let randomIndex;
        let selectedQuestion;

        // keep trying until we find a new question
        do {
            randomIndex = Math.floor(Math.random() * Total_Questions);
            selectedQuestion = questions[randomIndex];
        } while (usedIds.includes(selectedQuestion.id));  // retry if question already used

        res.json(selectedQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }

})
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));