import React, { useState } from 'react';

const MainContent = () => {
  const [question, setQuestion] = useState({
    text: "What is 2 + 2 * 2?",
    type: "integer"
  });
  
  const [tokenInput, setTokenInput] = useState(10);
  const [tokens, setTokens] = useState(1000);
  const [reward, setReward] = useState(0);

  const baseTokens = 10;
  const baseTimeSecondsForTenTokens = 60;
  const numericTokenInput = tokenInput === '' ? NaN : Number(tokenInput);
  const isBelowBase = Number.isFinite(numericTokenInput) && numericTokenInput < baseTokens;
  const safeTokens = Number.isFinite(numericTokenInput) ? Math.max(baseTokens, numericTokenInput) : baseTokens;
  const miningSeconds = Math.ceil((10 / safeTokens) * baseTimeSecondsForTenTokens);
  const hasEnoughTokens = Number.isFinite(numericTokenInput) && numericTokenInput <= tokens;

  const handleStartMining = () => {
    if (!Number.isFinite(numericTokenInput) || isBelowBase || !hasEnoughTokens) return;
    setTokens((prev) => Math.max(0, prev - numericTokenInput));
    setReward((prev) => prev + 5);
  };

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300">
      

      <div className="lg:col-span-3 rounded-2xl p-6 sm:p-8 bg-gray-900/60 backdrop-blur-md border border-gray-700/40 shadow-xl ring-1 ring-white/10">

      </div>


      <div className="lg:col-span-1 rounded-2xl p-6 sm:p-7 bg-gray-900/60 backdrop-blur-md border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-gray-400 mb-2 tracking-wide">Your Tokens</h3>
        <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.12)]">{tokens.toLocaleString()}</p>
        <h3 className="text-lg font-semibold text-gray-400 mt-6 mb-2 tracking-wide">Total Reward</h3>
        <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.12)]">{reward}</p>
      </div>

      <div className="lg:col-span-3 rounded-2xl p-6 sm:p-8 bg-gray-900/60 backdrop-blur-md border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-gray-400 tracking-wide">Question of the Block</h3>
        <p className="text-3xl sm:text-4xl my-6 text-white font-semibold tracking-tight">{question.text}</p>
        <input
          type="text"
          placeholder="Enter your answer"
          className="w-3xs p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400/80 text-base shadow-inner shadow-black/20 hover:border-gray-500 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all"
        />
      </div>

      <div className="lg:col-span-1 rounded-2xl p-6 sm:p-7 bg-gray-900/60 backdrop-blur-md border border-gray-700/40 shadow-xl ring-1 ring-white/10 flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-400 tracking-wide">Mine Controls</h3>
        <div className="flex justify-between text-base mt-2">
          <div>Est. Time:</div>
          <div className="font-semibold text-white">{Number.isFinite(numericTokenInput) ? `${miningSeconds}s` : '--'}</div>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-gray-700/40">
          <div>Minimum to mine:</div>
          <div className="font-semibold text-white">{baseTokens}</div>
        </div>
        <div>
           <label className="block text-sm text-gray-400">Tokens to mine</label>
           <input
            type="number"
            min={baseTokens}
            value={tokenInput}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setTokenInput('');
              } else {
                setTokenInput(Number(val));
              }
            }}
            className="mt-1 w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400/80 text-base shadow-inner shadow-black/20 hover:border-gray-500 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all"
          />
        </div>
        {Number.isFinite(numericTokenInput) && isBelowBase && (
          <div className="text-sm text-red-400">Minimum to mine is {baseTokens} tokens.</div>
        )}
        {Number.isFinite(numericTokenInput) && !isBelowBase && !hasEnoughTokens && (
          <div className="text-sm text-red-400">Not enough tokens available.</div>
        )}
        <button
          type="button"
          onClick={handleStartMining}
          disabled={!Number.isFinite(numericTokenInput) || isBelowBase || !hasEnoughTokens}
          className="mt-auto w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white font-bold shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Start Mining
        </button>
      </div>
    </div>
  );
};

export default MainContent;