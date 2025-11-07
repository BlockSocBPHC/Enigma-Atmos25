import React, { useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const navigate= useNavigate()
  const {login}= useContext(AuthContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    console.log('success')
    e.preventDefault();
    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('success')
        login(data)
        navigate('/admin')
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-gray-700"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-400">
          Admin Login
        </h2>

        <label className="block text-sm text-gray-400 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter admin name"
          required
        />

        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
