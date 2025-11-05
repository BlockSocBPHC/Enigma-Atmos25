import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { StartContext } from "../Hooks/StartContext";

function App() {
  const {start, setStart}= useContext(StartContext)
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const user = jwtDecode(credentialResponse.credential);
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user }),
      });
      const data = await res.json();
      if (data) {
        setStart(true)
        login(data);
        navigate("/");
      }
    }
  };

  const handleError = () => console.log("Login Failed");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-white">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1e3a8a,_#000000_70%)] animate-[pulse_8s_infinite_alternate]" />

      {/* Glow around logo */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <img
          src="/Blocksoc logo.jpeg"
          alt="Blocksoc Logo"
          className="w-48 sm:w-64 mb-8 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)] animate-[pulse_4s_infinite]"
        />

        <h1 className="text-5xl font-extrabold mb-3 leading-snug pb-4 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
          Welcome to Enigma
        </h1>


        <p className="text-gray-400 mb-10 text-lg">
          Decode. Compete. Rise in the leaderboard.
        </p>

        {/* Card container for login */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Sign in securely with your Google account
        </p>
      </div>
    </div>
  );
}

export default App;
