import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Decode JWT and extract payload
  useEffect(() => {
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setUser({
            id: payload.id,
            name: payload.name,
            role: payload.role,
          });
          // use expiry from backend (payload.exp)
          const expMs = payload.exp * 1000; // exp is seconds
          const timeLeft = expMs - Date.now();

          if (timeLeft <= 0) {
            logout();
            navigate("/login", { replace: true });
            return;
          }

          const timer = setTimeout(() => {
            logout();
            navigate("/login", { replace: true });
          }, timeLeft);

          return () => clearTimeout(timer);

        } else {
          console.warn("Invalid JWT structure");
          setUser(null);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // Save token from backend (string directly)
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    console.log("Logout successful");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
