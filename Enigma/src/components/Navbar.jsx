import React, { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../Context/AuthProvider'

const Navbar = () => {

  const [username, setUsername] = useState('')
  const [showRules, setShowRules] = useState(false);
  const { token } = useContext(AuthContext)
  const popupRef = useRef(null);

  const getuserdata = async () => {
    const res = await fetch("/getuserdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await res.json()
    console.log('data: ', data)
    if (data) {
      setUsername(data.name)
    }
  };

  useEffect(() => {
    getuserdata()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowRules(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
   <div className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-10 py-4 md:py-5 bg-gray-900 border-b border-gray-700 shadow-md relative">
      <div className="font-bold text-2xl text-white flex items-center">
        <img
          src="/Blocksoc logo.jpeg"
          alt="Blocksoc Logo"
          className="h-12 w-auto"
        />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.25)]"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >ATMOS ENIGMA</div>

      <div className="flex items-center gap-4 relative">
        <div className="relative" ref={popupRef}>
          <button
            onMouseEnter={() => setShowRules(true)}
            onMouseLeave={() => setShowRules(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            i
          </button>
          {showRules && (
            <div className="absolute right-0 mt-2 w-74 bg-gray-800 text-gray-200 rounded-md shadow-lg border border-gray-700 p-4 text-sm animate-fade-in">
              <h3 className="font-bold text-lg mb-2">Rules</h3>
              <ul className="list-disc pl-4 space-y-1">
                {/* <li>Final Score will be Weighted Addition of Tokens left and Rewards Earned.</li>
                <li>Game ends if you runs out of tokens.</li>
                <li>Correct answer turns block green.</li>
                <li>Wrong answer turns block red.</li>
                <li>Unanswered block stays Grey.</li>
                <li>Player with highest final score wins.</li>
                <li>You can convert rewards earned into token</li> */}
                <li>All da Best guys.</li>
                <li>Ana toh chahiye.</li>
                <li>Never Gonna Give You Up.</li>
                <li>Never gonna let you down.</li>
              </ul>
            </div>
          )}
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-bold border border-gray-600 transition-colors cursor-pointer">
          {username }
        </button>
      </div>
    </div>
  );
};

export default Navbar;
