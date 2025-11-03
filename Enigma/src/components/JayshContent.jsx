import React, { useState, useEffect, useContext } from 'react';
import Blocnum from './Blocnum.jsx';
import './Questions.css'
import { CurrentQuestion } from '../Hooks/CurrentQuestion.js';
import { AuthContext } from '../Context/AuthProvider.jsx';

const MainContent = () => {
    const {token}= useContext(AuthContext) 
    const { currentQuestion, setCurrentQuestion } = useContext(CurrentQuestion)
    const [blocks, setBlocks] = useState([]);
    const [canfetch, setCanFetch] = useState(false)
    const [answerIndex, setAnswerIndex] = useState('');
    const [tokens, setTokens] = useState(100000);
    const [reward, setReward] = useState(0);
    const [tokenInput, setTokenInput] = useState('');
    const [miningTimeLeft, setMiningTimeLeft] = useState(0);
    const [isMining, setIsMining] = useState(false);
    const [usedIds, setUsedIds] = useState([])

    const baseTokens = 10;
    const baseTimeSecondsForTenTokens = 60;

    const numericTokenInput = tokenInput === '' ? NaN : Number(tokenInput);
    const isBelowBase = Number.isFinite(numericTokenInput) && numericTokenInput < baseTokens;
    const safeTokens = Number.isFinite(numericTokenInput) ? Math.max(baseTokens, numericTokenInput) : baseTokens;
    const miningSeconds = Math.ceil((10 / safeTokens) * baseTimeSecondsForTenTokens);
    const hasEnoughTokens = Number.isFinite(numericTokenInput) && numericTokenInput <= tokens;


    const fetchNewQuestion = async () => {
        try {
            if (!canfetch) return console.log('cancelled');
            const res = await fetch("http://localhost:4000/getquestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usedIds: Array.from(usedIds) }),
            });
            const data = await res.json();
            if (!data) return;
            if (!usedIds.includes(data.id)) {
                setBlocks((prev) => [...prev, data]);
                setUsedIds((prev) => [...prev, data.id]);
            }
            else {
                console.log(`⚠️ Duplicate question ${data.id} skipped`);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };



    const attack = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:4000/attack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocks, usedIds }),
        });

        const data = await res.json();
        setBlocks(data);
    };

    useEffect(() => {
        if (!canfetch || blocks.length === 0) return;
        const lastId = blocks[blocks.length - 1].id;
        const timeout = setTimeout(() => scrollToQuestion(lastId), 500);
        setCurrentQuestion(blocks[blocks.length - 1]);
        return () => clearTimeout(timeout);
    }, [blocks]);


    useEffect(() => {
        if (!canfetch) {
            const next = blocks.find(b => b.status === "pending" || b.status === "failed");
            if (next) {
                setTimeout(() => scrollToQuestion(next.id), 1000);
                setCurrentQuestion(next)
            } else {
                setCanFetch(true);
                fetchNewQuestion();
            }
        }
    }, [canfetch, blocks]);




    const checkAnswer = async (ques) => {
        const res = await fetch('http://localhost:4000/checkans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify({
                userans: answerIndex,
                quesid: ques.id,
                tokens: tokens,
                rewards: reward,
            }),
        });

        const data = await res.json();
        setBlocks(prev =>
            prev.map(q =>
                q.id === ques.id ? { ...q, status: data.success ? 'success' : 'failed' } : q
            )
        );
        if (data.success && canfetch) {
            console.log('ho rha hai')
            return 'true'
        }
        else {
            return 'false'
        }
    }

    const handleStartMining = async () => {
        setTokens(prev => prev - numericTokenInput);
        setIsMining(true);
        setMiningTimeLeft(miningSeconds);

        const interval = setInterval(() => {
            setMiningTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);

                    (async () => {
                        const correct = await checkAnswer(currentQuestion);
                        console.log('Answer correct:', correct);

                        if (correct==='true') {
                            setReward(r => r + 5);
                            await fetchNewQuestion();
                        }

                        setAnswerIndex('');
                        setTokenInput('');
                        setIsMining(false);
                    })();

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    const scrollToQuestion = (id) => {
        const el = document.getElementById(`question-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
        } else {
            console.log("element not found:", id);
        }
    };




    return (

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-black text-gray-200">

            {/* Blockchain visualization */}
            <div className="lg:col-span-3 bg-gray-900 rounded-2xl overflow-auto p-6 border border-gray-700 h-[150px]">
                <Blocnum blocks={blocks} />
            </div>

            {/* Stats */}
            <div className="lg:col-span-1 h-[150px]  bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-row justify-between items-center">
                <div>
                    <p className="text-lg text-gray-400">Tokens</p>
                    <p className="text-5xl font-bold text-green-400">{tokens}</p>
                </div>
                <div>
                    <p className="text-lg text-gray-400 ">Reward</p>
                    <p className="text-5xl font-bold text-yellow-400">{reward}</p>
                    <button
                        onClick={() => {
                            setCanFetch(true);
                            fetchNewQuestion();
                        }}
                    >
                        Start
                    </button>
                </div>
                <button onClick={(e) => { attack(e, blocks); setCanFetch(false) }}>Attack</button>
            </div>

            {/* Question Section */}
            <div className="questions-container lg:col-span-3 bg-gray-900 rounded-2xl p-6 border border-gray-700 flex flex-row overflow-auto items-center ">
                {blocks.length > 0 ? (
                    blocks.map((question, i) => (
                        <div key={question.id} id={`question-${question.id}`} className="min-w-[1075px] px-5 max-w-3xl ">
                            <h2 className="text-2xl font-semibold mb-4">{`Q${i + 1}. ${question.question}`}</h2>
                            <ul className="space-y-2">
                                {question.options.map((opt, j) => (
                                    <li key={j} className="bg-gray-800 p-3 rounded text-lg ">
                                        {j + 1}. {opt}
                                    </li>

                                ))}
                            </ul>

                            <div className="mt-6 flex flex-row justify-center gap-10 items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max={question.options.length}
                                    value={answerIndex}
                                    onChange={(e) => setAnswerIndex(e.target.value)}
                                    className="w-24 p-3 rounded bg-gray-800 text-center text-white border border-gray-600"
                                    disabled={isMining}
                                />
                                <button
                                    onClick={(e) => checkAnswer(e, question)}
                                    className=" bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-white transition-all"
                                >
                                    Check
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading questions...</p>
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


export default MainContent;
