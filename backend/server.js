import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const Total_Questions = process.env.Total_Questions;
const num_of_questions_at_a_time = process.env.num_of_questions_at_a_time;
const num_of_attack_question = process.env.num_of_attack_question;
const attack_after_which_question = process.env.attack_after_which_question;

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


const { default: questions } = await import("./ques.json", { with: { type: "json" } });

app.get('/', (req, res) => {
  res.send('Backend server is running. Use /getquestions and /checkanswer.');
});



app.post("/getquestions", async (req, res) => {
  try {
    const usedIds = req.body.usedIds || [];
    const total = questions.length;

    let randomIndex;
    let selectedQuestion;

    do {
      randomIndex = Math.floor(Math.random() * total);
      selectedQuestion = questions[randomIndex];
    } while (usedIds.includes(selectedQuestion.id));

    res.json(selectedQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/checkanswer", async (req, res) => {
  try {
    const { id, answer } = req.body;

    if (!id || !answer) {
      return res.status(400).json({ error: "Missing question ID or answer." });
    }

    const question = questions.find(q => q.id === id);

    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    const isCorrect = question.correct_answer.trim().toLowerCase() === answer.trim().toLowerCase();

    res.json({
      correct: isCorrect,
      correct_answer: question.correct_answer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
