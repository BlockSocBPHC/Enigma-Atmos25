import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { QuestionsContext } from '../Hooks/QuestionsContext';
import { UsedIdsContext } from '../Hooks/UsedIdsContext';
import { CorrectQuestionIdContext } from '../Hooks/CorrectQuestionIdContext';
import JayeshContent from '../components/JayshContent'
import { CurrentQuestion } from '../Hooks/CurrentQuestion';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [usedIds, setUsedIds] = useState([]);
  const [currentQuestion, setCurrentQuestion]= useState(null)

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      <UsedIdsContext.Provider value={{ usedIds, setUsedIds }}>
      <CurrentQuestion.Provider value={{ currentQuestion, setCurrentQuestion }}>
        <div className="bg-white text-blue-900 flex flex-col min-h-screen">
          <Navbar />
          <JayeshContent />
        </div>
      </CurrentQuestion.Provider>
      </UsedIdsContext.Provider>
    </QuestionsContext.Provider>
  );
};

export default HomePage;
