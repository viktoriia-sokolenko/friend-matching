import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    const [toggleTrigger, setToggleTrigger] = useState(0);
    const handleLogout = () => {
        if (userId) {
            setUserId("");
            localStorage.removeItem("user_id");
            setToken("");
            localStorage.removeItem("access_token");
            setSavedProfiles([]);
            window.location = `/`;
        }
    };
    const [savedProfiles, setSavedProfiles] = useState([]);
    useEffect(() => {
        const fetchSavedProfiles = async () => {
            if (!userId || !token) return;
            try {
              const response = await fetch(`/users/saved_profiles/${userId}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (!response.ok) {
                throw new Error(`Error fetching saved profiles: ${response.status}`);
              }
              const data = await response.json();
              setSavedProfiles(data);
            } catch (error) {
              console.error('Error fetching saved profiles:', error);
            }
          };
        fetchSavedProfiles();
    }, [userId, token, toggleTrigger]);
    const handleToggleSave = async (profileId, isSaved) => {
        const method = isSaved ? 'DELETE' : 'POST';
        const endpoint = `/users/saved_profiles/`;
        const body = JSON.stringify({ saved_id: profileId, user_id: userId });

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (response.ok) {
                setToggleTrigger((prev) => prev + 1);  // Trigger fetch
            } else {
                throw new Error(`Failed to toggle profile save: ${response.status}`);
            }
        } catch (error) {
            console.error('Error toggling saved profile:', error);
        }
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
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout, savedProfiles, handleToggleSave }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};