import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StartContext } from "../Hooks/StartContext";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const {start, setStart}= useContext(StartContext)
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true); // <-- add this

  useEffect(() => {
    const verifyToken = () => {
      if (!token) {
        setUser(null);
        setChecking(false);
        return;
      }

      try {
        const parts = token.split(".");
        if (parts.length !== 3) {
          console.warn("Invalid JWT structure");
          logout();
          setChecking(false);
          return;
        }

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(
          decodeURIComponent(escape(window.atob(base64)))
        );

        const expMs = payload.exp * 1000;
        if (Date.now() > expMs) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setUser({
          id: payload.id,
          name: payload.name,
          role: payload.role,
        });

        // auto logout on expiry
        const timeLeft = expMs - Date.now();
        const timer = setTimeout(() => {
          logout();
          navigate("/login", { replace: true });
        }, timeLeft);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Error decoding token:", err);
        logout();
      } finally {
        setChecking(false); // <-- stop loading
      }
    };

    verifyToken();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("start");
    setStart(false);
    setToken(null);
    setUser(null);
    console.log("Logout successful");
  };

  // prevent children from rendering until token is verified
  if (checking) return null; // <-- add this line

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
