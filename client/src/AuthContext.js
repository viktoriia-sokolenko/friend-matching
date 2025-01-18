import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

const AuthContext = createContext({
    token: "",
    setToken: () => {},
    userId: null,
    setUserId: () => {},
    handleLogout: () => {},
    savedProfiles: [],
    handleToggleSave: () => {},
    listOfInterests: [],
    getInterestScore: () => 0,
});
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    const listOfInterests = useMemo(() => [
        "History/Politics", "Science/Technology", "Video Games", "Sports/Fitness",
        "Sports (watching)", "Literature", "Film/Television", "Music", "Visual Arts",
        "Performing Arts", "Cooking/Baking", "Crafts/DIY", "Hiking/Outdoor activities",
        "Travel", "Sustainability", "Activism/Advocacy", "Volunteering", "Other"
    ], []);
    const getInterestVector = (rankedInterests) =>{
        return listOfInterests.map(interest => rankedInterests[interest] || 0);
    }
    const calculateSimilarity = (vec1, vec2) => {
        const dotpdt = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
        const vec1sqrd = vec1.reduce((acc, val) => acc + val * val, 0);
        const vec2sqrd = vec2.reduce((acc, val) => acc + val * val, 0);
        if (vec2sqrd === 0 || vec1sqrd === 0){
            return 0;
        }
        const cosineSimilarity = (dotpdt/(Math.sqrt(vec1sqrd)*Math.sqrt(vec2sqrd)));
        return (Math.max(0, cosineSimilarity)*100);
    }
    const getInterestScore = (rankings, user) => {
        const userVector = getInterestVector(user.user_profiles.rankings);
        const studentVector = getInterestVector(rankings);
        const score = calculateSimilarity(userVector, studentVector);
        return score.toFixed(2);
    }
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
    const fetchSavedProfiles = async () => {
        if (!userId || !token) return;
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/saved_profiles/${userId}`, {
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
    useEffect(() => {
        fetchSavedProfiles();
    }, [userId, token]);
    const handleToggleSave = async (profileId, isSaved) => {
        const method = isSaved ? 'DELETE' : 'POST';
        const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/users/saved_profiles/`;
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
                fetchSavedProfiles();
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
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout, savedProfiles, handleToggleSave, listOfInterests, getInterestScore }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};