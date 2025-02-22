import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setToken, setUserId } = useAuth(); 

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            localStorage.setItem("access_token", data.token);
            localStorage.setItem("user_id", data.userId);
            setToken(data.token);
            setUserId(data.userId);
            setError("");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className = "Page">
            <h2>Login</h2>
            <form className = "Form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" onClick={handleSignIn}>Sign In</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SignIn;