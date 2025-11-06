import React from "react";
import BlockSocLogo from "/Blocksoc logo.jpeg";

const StartPage = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-8 text-center">
      <div className="mb-10 animate-pulse-slow">
        <img
          src={BlockSocLogo}
          alt="Blocksoc Logo"
          className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        />
      </div>
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 pb-2 leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg tracking-wide">
        Welcome To Enigma
      </h2>


      <button
        onClick={onStart}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-2xl py-3 px-12 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartPage;