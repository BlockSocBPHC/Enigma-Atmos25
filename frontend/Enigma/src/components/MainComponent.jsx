import React, { useState, useEffect } from 'react';
import Blocnum from './Blocnum.jsx';

const MainContent = () => {
  const [blocks, setBlocks] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [tokens, setTokens] = useState(1000);
  const [reward, setReward] = useState(0);
  const [tokenInput, setTokenInput] = useState('');

  const [miningTimeLeft, setMiningTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);

  const baseTokens = 10;
  const baseTimeSecondsForTenTokens = 60;

  const numericTokenInput = tokenInput === '' ? NaN : Number(tokenInput);
  const isBelowBase = Number.isFinite(numericTokenInput) && numericTokenInput < baseTokens;
  const safeTokens = Number.isFinite(numericTokenInput) ? Math.max(baseTokens, numericTokenInput) : baseTokens;
  const miningSeconds = Math.ceil((10 / safeTokens) * baseTimeSecondsForTenTokens);
  const hasEnoughTokens = Number.isFinite(numericTokenInput) && numericTokenInput <= tokens;

  const fetchNewQuestion = async () => {
    try {
      const usedIds = blocks.map(b => b.id);
      const res = await fetch('http://localhost:4000/getquestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usedIds),
      });
      const data = await res.json();
      setCurrentQuestion(data);
      setAnswer('');
    } catch (err) {
      console.error('Failed to fetch new question:', err);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const checkAnswer = () => {
    if (!currentQuestion || !answer.trim()) return false;
    return answer.trim() === currentQuestion.correct_answer;
  };

 const handleStartMining = () => {
  if (!currentQuestion || !answer.trim()) return;
  if (!Number.isFinite(numericTokenInput) || isBelowBase || !hasEnoughTokens) return;

  setTokens(prev => prev - numericTokenInput);
  setIsMining(true);
  setMiningTimeLeft(miningSeconds);

  // Check if a block for this question already exists
  const existingBlock = blocks.find(b => b.questionId === currentQuestion.id);

  let blockId;
  if (existingBlock) {
    blockId = existingBlock.id;
    // Reset status to pending for retry
    setBlocks(prevBlocks =>
      prevBlocks.map(b => 
        b.id === blockId ? { ...b, status: 'pending' } : b
      )
    );
  } else {
    blockId = blocks.length + 1;
    const newBlock = {
      id: blockId,
      status: 'pending',
      answer: currentQuestion.correct_answer,
      timestamp: new Date().toLocaleTimeString(),
      questionId: currentQuestion.id,
    };
    setBlocks(prev => [...prev, newBlock]);
  }

  const interval = setInterval(() => {
    setMiningTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        const correct = checkAnswer();

        // Update block status
        setBlocks(prevBlocks =>
          prevBlocks.map(b =>
            b.id === blockId ? { ...b, status: correct ? 'success' : 'failed' } : b
          )
        );

        if (correct) {
          setReward(prev => prev + 5);
          fetchNewQuestion(); // fetch next question only if correct
        }

        setAnswer('');
        setTokenInput('');
        setIsMining(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};


  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300">

      {/* Blockchain visualization */}
      <div className="lg:col-span-3 rounded-2xl p-6 sm:p-8 bg-gray-900/60 border border-gray-700/40 shadow-xl ring-1 ring-white/10">
        <Blocnum blocks={blocks} />
      </div>

      {/* Tokens and reward */}
      <div className="lg:col-span-1 rounded-2xl p-6 sm:p-7 bg-gray-900/60 border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-gray-400 mb-2">Your Tokens</h3>
        <p className="text-6xl font-extrabold text-green-400">{tokens}</p>
        <h3 className="text-lg font-semibold text-gray-400 mt-6 mb-2">Total Reward</h3>
        <p className="text-6xl font-extrabold text-yellow-400">{reward}</p>
      </div>

      {/* Question area */}
      <div className="lg:col-span-3 rounded-2xl p-6 sm:p-8 bg-gray-900/60 border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-gray-400">Question of the Block</h3>
        {currentQuestion ? (
          <>
            <p className="text-3xl my-6 text-white font-semibold">{currentQuestion.question}</p>
            <div className="flex flex-col gap-2">
              {currentQuestion.options?.map(opt => (
                <button
                  key={opt}
                  className={`p-3 rounded-lg text-white text-lg border border-gray-600 
                    ${answer === opt ? 'bg-blue-600' : 'bg-gray-800'}`}
                  onClick={() => setAnswer(opt)}
                  disabled={isMining}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>

      {/* Mining controls */}
      <div className="lg:col-span-1 rounded-2xl p-6 sm:p-7 bg-gray-900/60 border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-400">Mine Controls</h3>

        <div className="flex justify-between text-base mt-2">
          <div>Est. Time:</div>
          <div className="font-semibold text-white">{miningSeconds}s</div>
        </div>

        <div>
          <label className="block text-sm text-gray-400">Tokens to mine</label>
          <input
            type="number"
            min={baseTokens}
            placeholder="" // removed default 0
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            className="mt-1 w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
            disabled={isMining}
          />
        </div>

        <button
          type="button"
          onClick={handleStartMining}
          disabled={isMining || !hasEnoughTokens || !answer.trim()}
          className="mt-auto w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white font-bold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition"
        >
          {isMining ? `Mining... ${miningTimeLeft}s` : 'Start Mining'}
        </button>
      </div>
    </div>
  );
};

export default MainContent;
