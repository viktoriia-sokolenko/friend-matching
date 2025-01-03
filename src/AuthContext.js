import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    const handleLogout = () => {
        setUserId("");
        localStorage.removeItem("user_id");
        setToken("");
        localStorage.removeItem("access_token");
        window.location = `/`;
    };
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
            setToken(accessToken);
            localStorage.setItem("access_token", accessToken);
            window.history.replaceState(null, "", window.location.pathname);
        } else {
            const savedToken = localStorage.getItem("access_token");
            if (savedToken) {
                setToken(savedToken);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};