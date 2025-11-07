import React, { useState } from "react";

const EndPage = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-8">
      <div className="w-full max-w-4xl rounded-2xl border-4 border-gray-800 shadow-2xl bg-gray-900/95 flex flex-col items-center justify-center py-10 px-8">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg leading-tight">
            CONGRATULATIONS!!!
          </h1>
          <h2 className="text-3xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_8px_rgba(255,0,150,0.7)] leading-snug">
            You Have Completed The Game
          </h2>
        </div>
      </div>
    </div>
  );
};

export default EndPage;