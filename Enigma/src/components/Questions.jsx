import React, { useContext, useState, useRef, useEffect } from "react";
import { QuestionsContext } from "../Hooks/QuestionsContext";
import { CorrectQuestionIdContext } from "../Hooks/CorrectQuestionIdContext";
import { QuestionsScrollContext } from "../Hooks/QuestionScrollContext";
import { UsedIdsContext } from "../Hooks/UsedIdsContext";
import { getData } from "../utitls/getData";
import './Questions.css'

const Questions = ({ questionRefs }) => {
  const { questions, setQuestions } = useContext(QuestionsContext);
  const { usedIds, setUsedIds } = useContext(UsedIdsContext);
  const [answers, setAnswers] = useState({});
  const { correctquestionid, setCorrectquestionid } = useContext(CorrectQuestionIdContext);
  const { scrollToQuestion } = useContext(QuestionsScrollContext);

  // Ref to store ID of the newly added question
  const lastAddedQuestionIdRef = useRef(null);

  // Scroll to the newly added question after it renders
  useEffect(() => {
    if (lastAddedQuestionIdRef.current) {
      scrollToQuestion(lastAddedQuestionIdRef.current);
      lastAddedQuestionIdRef.current = null;
    }
  }, [questions, scrollToQuestion]);

  const handleChange = (e, questionId) => {
    const value = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e, question, i) => {
    e.preventDefault();

    const selectedOption = parseInt(answers[question.id]);
    if (!selectedOption || selectedOption < 1 || selectedOption > question.options.length) {
      alert("Please enter a valid option number.");
      return;
    }

    if (selectedOption === question.correct_answer) {
      alert("✅ Correct!");

      // Add to correct questions if not already
      if (!correctquestionid.includes(question.id)) {
        setCorrectquestionid((arr) => [...arr, question.id]);
      }

      if (i === questions.length - 1) {
        // Last question: fetch new one
        const newQuestion = await getData(usedIds, setQuestions, setUsedIds);
        if (newQuestion) {
          lastAddedQuestionIdRef.current = newQuestion.id; // mark for scrolling
        }
      } else {
        // Scroll to next question in the list
        scrollToQuestion(questions[i + 1].id);
      }
    } else {
      alert("❌ Incorrect!");
    }
  };

  return (
    <div className="questions-container h-[420px] w-full max-w-[800px] my-5 mx-auto flex overflow-x-auto overflow-y-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      {questions.map((question, i) => (
        <div
          key={question.id}
          ref={(el) => (questionRefs.current[question.id] = el)}
          className="min-w-full h-full border border-gray-700 rounded-lg shadow-xl p-6 flex-shrink-0 bg-gray-800 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">{question.question}</h2>
            <ul className="list-decimal pl-6 space-y-2">
              {question.options.map((option, idx) => (
                <li
                  key={idx}
                  className="text-gray-200 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={(e) => handleSubmit(e, question, i)}
            className="mt-6 flex items-center space-x-3"
          >
            <label className="text-gray-100 font-medium">
              Correct Option:
              <input
                type="number"
                min="1"
                max={question.options.length}
                value={answers[question.id] || ""}
                onChange={(e) => handleChange(e, question.id)}
                className="ml-2 border border-gray-600 rounded px-3 py-1 w-20 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Submit
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Questions;
