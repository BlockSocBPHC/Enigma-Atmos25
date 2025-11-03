import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";


function App() {
  const {login} = useContext(AuthContext)
  const {token} = useContext(AuthContext)
  const navigate=useNavigate()

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const user = jwtDecode(credentialResponse.credential);
      const res=await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` },
        body: JSON.stringify({user}),
      });
      const data=await res.json()
      if (data) {
        login(data)
        navigate('/')
      }
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default App;
