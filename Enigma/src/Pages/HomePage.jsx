import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { QuestionsContext } from '../Hooks/QuestionsContext';
import { CurrentQuestion } from '../Hooks/CurrentQuestion';
import NewContent from '../components/NewContent';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [usedIds, setUsedIds] = useState([]);
  const [currentQuestion, setCurrentQuestion]= useState(null)

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      <CurrentQuestion.Provider value={{ currentQuestion, setCurrentQuestion }}>
        <div className="bg-white text-blue-900 flex flex-col min-h-screen">
          <Navbar />
          <NewContent />
        </div>
      </CurrentQuestion.Provider>
    </QuestionsContext.Provider>
  );
};

export default HomePage;
