import React, { useState } from 'react';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './Routes/PrivateRoute';
import { AuthProvider } from './Context/AuthProvider';
import Login from './Pages/Login';
import AdminLogin from './Pages/AdminLogin';
import AdminPage from './Pages/AdminPage';
import { StartContext } from './Hooks/StartContext';
import EndPage from './components/EndPage';

function App() {
  const [start, setStart] = useState(false)
  return (
    <BrowserRouter>
      <StartContext.Provider value={{ start, setStart }}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path='/'
              element={
                <PrivateRoute role="user">
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <PrivateRoute role="admin">
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/results'
              element={
                <PrivateRoute role="user">
                  <EndPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </StartContext.Provider>
    </BrowserRouter>
  );
}

export default App;
