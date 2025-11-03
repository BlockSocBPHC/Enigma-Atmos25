import React, { useContext } from "react";
import { CurrentQuestion } from "../Hooks/CurrentQuestion";

const Blocnum = ({ blocks }) => {
  const {currentQuestion, setCurrentQuestion}= useContext(CurrentQuestion)
  const scrollToQuestion = (id) => {
    document
      .getElementById(`question-${id}`)
      ?.scrollIntoView({ behavior: "auto", block: 'nearest', inline: "center" });
  };
  return (
    <div className="flex space-x-4 px-6 py-3 min-w-max">
      {blocks.map((b, i) => (
        <React.Fragment key={b.id}>
          <button
            onClick={() => {scrollToQuestion(b.id); setCurrentQuestion(b)}}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all ${b.status === "success"
                ? "bg-green-600"
                : b.status === "failed"
                  ? "bg-red-600"
                  : b.status === "pending"
                    ? "bg-gray-500"
                    : "bg-gray-700 hover:bg-gray-600"
              }`}
            disabled={b.status === "success"}
          >
            {i + 1}
          </button>

          {i !== blocks.length - 1 && (
            <svg
              className="w-8 h-8 text-gray-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
export default Blocnum