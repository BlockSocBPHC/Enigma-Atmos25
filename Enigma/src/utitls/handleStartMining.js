 const handleStartMining = (currentQuestion,answer, numericTokenInput, isBelowBase, hasEnoughTokens, setTokens ) => {
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