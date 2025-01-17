import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, first_name, last_name }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setError("Registration successful! Confirm your email and sign in.");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className = "Page">
            <h2>Sign Up</h2>
            <form className = "Form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" onClick={handleSignUp}>Sign Up</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SignUp;