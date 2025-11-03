import React, { useState, useEffect } from 'react';
import Blocnum from './Blocnum.jsx';

const MainContent = () => {
  const [blocks, setBlocks] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(0);
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
      console.log(data.correct_answer)
      setAnswerIndex(data.correct_answer);      //correctly storing value
    } catch (err) {
      console.error('Failed to fetch new question:', err);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const checkAnswer = () => {
    if (!currentQuestion || answerIndex === 0) return false;
    const idx = parseInt(answerIndex) - 1;
    return currentQuestion.options[idx] === currentQuestion.correct_answer;
  };

  const handleStartMining = () => {
    if (!currentQuestion ) return;
    if (!Number.isFinite(numericTokenInput) || isBelowBase || !hasEnoughTokens) return;

    setTokens(prev => prev - numericTokenInput);
    setIsMining(true);
    setMiningTimeLeft(miningSeconds);

    const existingBlock = blocks.find(b => b.questionId === currentQuestion.id);
    console.log(blocks,existingBlock)
    let blockId;

    if (existingBlock) {
      blockId = existingBlock.id;
      setBlocks(prev =>
        prev.map(b => (b.id === blockId ? { ...b, status: 'pending' } : b))
      );
    } else {                                          // Question object is added if the user renders it 
      console.log('single questionis added')
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

          setBlocks(prev =>
            prev.map(b =>
              b.id === blockId
                ? { ...b, status: correct ? 'success' : 'failed' }
                : b
            )
          );

          if (correct) {
            setReward(r => r + 5);
            fetchNewQuestion();
          }

          setAnswerIndex('');
          setTokenInput('');
          setIsMining(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-black text-gray-200">
      
      {/* Blockchain visualization */}
      <div className="lg:col-span-3 bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <Blocnum blocks={blocks} />
      </div>

      {/* Stats */}
      <div className="lg:col-span-1 bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-col justify-center items-center">
        <p className="text-lg text-gray-400">Tokens</p>
        <p className="text-5xl font-bold text-green-400">{tokens}</p>
        <p className="text-lg text-gray-400 mt-4">Reward</p>
        <p className="text-5xl font-bold text-yellow-400">{reward}</p>
      </div>

      {/* Question Section */}
      <div className="lg:col-span-3 bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-col items-center">
        {currentQuestion ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">{currentQuestion.question}</h2>
            <ul className="space-y-2 w-full max-w-xl">
              {currentQuestion.options.map((opt, i) => (
                <li key={i} className="bg-gray-800 p-3 rounded text-lg">
                  {i + 1}. {opt}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center">
              <label className="text-gray-400 mb-2">Enter Option Number</label>
              <input
                type="number"
                min="1"
                max={currentQuestion.options.length}
                value={answerIndex}
                onChange={e => setAnswerIndex(e.target.value)}
                className="w-24 p-3 rounded bg-gray-800 text-center text-white border border-gray-600"
                disabled={isMining}
              />
            </div>
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>

      {/* Mining Controls */}
      <div className="lg:col-span-1 bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-col justify-center items-center gap-4">
        <div className="text-gray-400">Est. Time: <span className="text-white">{miningSeconds}s</span></div>
        <div className="w-full">
          <label className="block text-sm text-gray-400 mb-1">Tokens to mine</label>
          <input
            type="number"
            min={baseTokens}
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
            disabled={isMining}
          />
        </div>
        <button
          onClick={handleStartMining}
          disabled={isMining || !hasEnoughTokens }
          className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {isMining ? `Mining... ${miningTimeLeft}s` : 'Start Mining'}
        </button>
      </div>
    </div>
  );
};

export default MainContent;
