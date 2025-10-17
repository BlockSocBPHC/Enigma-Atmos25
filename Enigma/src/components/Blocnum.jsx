import React, { useEffect, useState, useRef } from "react";

const Blocnum = () => {
  const [questions, setQuestions] = useState([]);
  const [usedIds, setUsedIds] = useState(new Set());


  const getData = async () => {
    try {
      const res = await fetch("http://localhost:4000/getquestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.from(usedIds)), 
      });

      const data = await res.json();

      // 👇 avoid duplicates by checking ID
      if (!usedIds.has(data.id)) {
        setQuestions((prev) => [...prev, data]);
        setUsedIds((prev) => new Set(prev).add(data.id));
      } else {
        console.log(`⚠️ Duplicate question ${data.id} skipped`);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Blockchain Question Series
      </h1>

      <div className="flex justify-center items-center h-auto">
        {questions.map((num, i) => (
          <React.Fragment key={num.id}>
            {/* Block */}
            <div className="flex items-center justify-center w-8 h-8 bg-zinc-400 text-white font-bold rounded-full shadow-md">
              {num.id}
            </div>

            {/* Arrow */}
            {i !== questions.length - 1 && (
              <div className="flex items-center mx-2">
                <svg
                  className="w-6 h-6 text-gray-500"
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
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Blocnum;
