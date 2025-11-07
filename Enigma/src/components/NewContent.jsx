import React, { useState, useEffect, useContext } from 'react';
import Blocnum from './Blocnum.jsx';
import './Questions.css'
import { CurrentQuestion } from '../Hooks/CurrentQuestion.js';
import { AuthContext } from '../Context/AuthProvider.jsx';
import { StartContext } from '../Hooks/StartContext.js';
import { useNavigate } from 'react-router-dom';

const NewContent = () => {
    const navigate= useNavigate()
    const { token } = useContext(AuthContext);
    const { start, setStart } = useContext(StartContext);
    const { currentQuestion, setCurrentQuestion } = useContext(CurrentQuestion);
    const [convert, setConvert] = useState('')
    const [blocks, setBlocks] = useState([]);
    const [answerIndex, setAnswerIndex] = useState('');
    const [tokens, setTokens] = useState(5000);
    const [reward, setReward] = useState(0);
    const [tokenInput, setTokenInput] = useState('');
    const [miningTimeLeft, setMiningTimeLeft] = useState(0);
    const [isMining, setIsMining] = useState(false);
    const [disabledConversion, setDisabledConversion] = useState(true)

    const baseTokens = 10;
    const baseTimeSecondsForTenTokens = 180;

    const numericTokenInput = tokenInput === '' ? NaN : Number(tokenInput);
    const safeTokens = Number.isFinite(numericTokenInput) ? Math.max(baseTokens, numericTokenInput) : baseTokens;
    const miningSeconds = Math.ceil((10 / safeTokens) * baseTimeSecondsForTenTokens);
    const hasEnoughTokens = Number.isFinite(numericTokenInput) && numericTokenInput <= tokens;

    // Fetch questions from server
    const fetchNewQuestion = async () => {
        try {
            const res = await fetch("/getquestions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (data) {
                setBlocks(data.question);
                setTokens(data.tokens);
                setReward(data.rewards);
            }
            if (data.attackIndex)
                alert(`You have been attacked on block: ${data.attackIndex + 1}`);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        if (reward <= 0 || !reward) {
            setDisabledConversion(true)
            console.log('jayesh')
        }
        else
            setDisabledConversion(false)
    }, [reward])

    // Get user tokens from server
    const getTokens = async () => {
        try {
            const res = await fetch("/gettokens", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const data = await res.json();
            if (data) {
                setTokens(data.tokens);
                setReward(data.rewards);
            }
        } catch (err) {
            console.error('Error fetching tokens:', err);
        }
    };

    // fetch Question after reload
    const fetchQuestion = async () => {
        try {
            console.log('hi')
            const res = await fetch('/currentquestion', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            const data = await res.json()
            console.log(data)
            if (data) {
                setBlocks(data.question)
            }
        }
        catch (err) {
            console.log('err: ', err)
        }
    }

    const conversion = async () => {
        try {
            const res = await fetch("/conversion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ reward, tokens, convert })
            });
            const data = await res.json()
            console.log('convert:', data)
            if (data) {
                setTokens(data.tokens)
                setReward(data.reward)
            }
        }

        catch (err) {
            console.log('err: ', err)
        }
    }

    // Run start logic only once using localStorage
    useEffect(() => {
        const alreadyStarted = localStorage.getItem("hasStarted");
        getTokens();
        fetchQuestion();
        if (!alreadyStarted) {
            localStorage.setItem("hasStarted", "true");
            setStart(true);
        }
    }, []);

    // Scroll to first pending question
    useEffect(() => {
        for (const block of blocks) {
            if (block.status === 'pending') {
                scrollToQuestion(block.id);
                setCurrentQuestion(block);
                break; // stop at first pending question
            }
        }
    }, [blocks]);

    // Check answer
    const checkAnswer = async (ques) => {
        const res = await fetch('/checkans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userans: answerIndex,
                quesid: ques.id,
                tokens,
                reward,
                tokenInput
            }),
        });
        const data = await res.json();
        if (data) {
            setBlocks(data.question);
            const lastIndex = 25; // check up to question 10
            if (blocks.length >= 20 && blocks.slice(0, lastIndex + 1).every(q => q.status === 'success'))
                navigate('/results')
            setReward(data.reward);
            setTokens(data.tokens);
        }
        if (data.attackIndex)
            alert(`You have been attacked on block: ${data.attackIndex + 1}`);
    };

    // Mining logic
    const handleStartMining = () => {
        setTokens(prev => prev - numericTokenInput);
        setIsMining(true);
        setMiningTimeLeft(miningSeconds);

        const interval = setInterval(() => {
            setMiningTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    checkAnswer(currentQuestion);
                    setAnswerIndex('');
                    setTokenInput('');
                    setIsMining(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const scrollToQuestion = (id) => {
        const el = document.getElementById(`question-${id}`);
        if (el) el.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    };

    return (
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-black text-gray-200">
            {/* Blockchain visualization */}
            <div className="lg:col-span-3 bg-gray-900 rounded-2xl overflow-auto p-6 border border-gray-700 h-[150px]">
                <Blocnum blocks={blocks} />
            </div>

            {/* Stats */}
            <div className="lg:col-span-1 h-[150px] bg-gray-900 rounded-2xl p-4 border border-gray-700 flex flex-col justify-between shadow-lg">

                {/* Top stats */}
                <div className="flex justify-between items-center">
                    {/* Tokens */}
                    <div className="flex flex-col items-center justify-center px-2">
                        <p className="text-sm text-gray-400 uppercase tracking-wider">Tokens</p>
                        <p className="text-3xl font-extrabold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">{tokens}</p>
                    </div>

                    {/* Reward */}
                    <div className="flex flex-col items-center justify-center px-2">
                        <p className="text-sm text-gray-400 uppercase tracking-wider">Reward</p>
                        <p className="text-3xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">{reward}</p>
                    </div>
                </div>
                <div className='flex justify-evenly gap items-center'>
                    {/* Convert Input */}
                    <div className="flex flex-col items-center justify-center px-2">
                        <p className="text-sm text-gray-400 uppercase tracking-wider"></p>
                        <input
                            type="number"
                            min="1"
                            max={reward}
                            value={convert}
                            onChange={(e) => { let value = Number(e.target.value); if (value > reward) value = reward; setConvert(value) }}
                            className="w-50 p-1 rounded-md bg-gray-800 text-center text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>


                    {/* Bottom button */}
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={conversion}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={disabledConversion}
                        >
                            Convert
                        </button>
                    </div>
                </div>
            </div>


            {/* Question Section */}
            <div className="questions-container lg:col-span-3 bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-row overflow-auto items-center">
                {blocks.length > 0 ? (
                    blocks.map((question, i) => (
                        <div key={question.id} id={`question-${question.id}`} className="min-w-[1075px] px-5 max-w-3xl">
                            <h2 className="text-2xl font-semibold mb-4">{`Q${i + 1}. ${question.question}`}</h2>
                            <ul className="space-y-2">
                                {question.options.map((opt, j) => (
                                    <li key={j} className="bg-gray-800 p-3 rounded text-lg">
                                        {j + 1}. {opt}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 flex flex-row justify-center gap-10 items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max="4"
                                    value={answerIndex}
                                    onChange={(e) => setAnswerIndex(e.target.value)}
                                    className="w-24 p-3 rounded bg-gray-800 text-center text-white border border-gray-600"
                                    disabled={isMining}
                                />

                            </div>

                        </div>
                    ))
                ) : (
                    <p><button onClick={fetchNewQuestion}>Start</button></p>
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
                    disabled={isMining || !hasEnoughTokens}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-500 disabled:opacity-50"
                >
                    {isMining ? `Mining... ${miningTimeLeft}s` : 'Start Mining'}
                </button>
            </div>
        </div>
    );
};

export default NewContent;
