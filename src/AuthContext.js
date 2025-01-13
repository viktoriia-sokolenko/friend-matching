import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    const [toggleTrigger, setToggleTrigger] = useState(0);
    const listOfInterests = ["History/Politics", "Science/Technology", "Video Games", "Sports/Fitness", "Sports (watching)", "Literature", "Film/Television", "Music", "Visual Arts", "Performing Arts", "Cooking/Baking", "Crafts/DIY", "Hiking/Outdoor activities", "Travel", "Sustainability", "Activism/Advocacy", "Volunteering", "Other"];
    const getInterestVector = (interests, rankings) =>{
        const rankedInterests = interests.reduce((acc, interest, index) => {
            acc[interest] = rankings[index];
            return acc;
        }, {});
        return listOfInterests.map(interest => rankedInterests[interest] || 0);
    }
    const calculateSimilarity = (vec1, vec2) => {
        const dotpdt = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
        const vec1sqrd = vec1.reduce((acc, val) => acc + val * val, 0);
        const vec2sqrd = vec2.reduce((acc, val) => acc + val * val, 0);
        if (vec2sqrd == 0 || vec1sqrd == 0){
            return 0;
        }
        const cosineSimilarity = (dotpdt/(Math.sqrt(vec1sqrd)*Math.sqrt(vec2sqrd)));
        return (Math.max(0, cosineSimilarity)*100);
    }
    const getInterestScore = (interests, rankings, user) => {
        const userVector = getInterestVector(user.user_profiles.interests, user.user_profiles.rankings);
        const studentVector = getInterestVector(interests, rankings);
        return calculateSimilarity(userVector, studentVector);
    }
    const memoizedGetInterestScore = useMemo(() => getInterestScore, [getInterestVector, calculateSimilarity]); 
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
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout, savedProfiles, handleToggleSave, listOfInterests, memoizedGetInterestScore }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};