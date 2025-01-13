import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProfileForm = ({ user, new: isNew }) => {
    const { userId, token, listOfInterests } = useAuth();
    const [profile, setProfile] = useState({
        user_id: userId,
        bio: user.bio || "",
        major: user.major || "",
        year: user.year || null,
        dateOfBirth: user.date_of_birth || "2025-01-01",
        contactInfo: user.contact_info || "",
        interests: user.interests || [],
        rankings: user.rankings || {},
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleInterestChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        if (selectedOptions.length <= 7) {
            setProfile((prevData) => ({
                ...prevData,
                interests: selectedOptions,
                rankings: selectedOptions.map(() => 1),
            }));
        }
    };
    const handleRatingChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevData) => ({
            ...prevData,
            rankings: {
                ...prevData.rankings,
                [name]: value,
            },
        }));
    };
    useEffect(() => {
        setProfile({
            user_id: userId,
            bio: user.bio || "",
            major: user.major || "",
            year: user.year || null,
            dateOfBirth: user.date_of_birth || "2025-01-01",
            contactInfo: user.contact_info || "",
            interests: user.interests || [],
            rankings: user.rankings || [],
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const createProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/users/profiles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error("Failed to create profile");
            }
            const newProfile = await response.json();
            console.log(newProfile);
            navigate(`/profiles`);
        } catch (err) {
            setError(err.message);
        }
    };
    const editProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/profiles/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
            navigate(`/profiles`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="ProfileForm">
            <form>
                <div className="formRow">
                    <label htmlFor="major">Major:</label>
                    <input
                        type="text"
                        id="major"
                        name="major"
                        value={profile.major}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="formRow">
                    <label htmlFor="year">Graduation Year:</label>
                    <input
                        type="text"
                        id="year"
                        name="year"
                        value={profile.year}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="formRow">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="formRow">
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="formRow">
                    <label htmlFor="contactInfo">Contact Info:</label>
                    <textarea
                        id="contactInfo"
                        name="contactInfo"
                        value={profile.contactInfo}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="formRow">
                    <label>Interests (Choose up to 7):</label>
                    <select
                        multiple
                        value={profile.interests}
                        onChange={handleInterestChange}
                        size="5"
                        disabled={profile.interests.length >= 7}
                    >
                        {listOfInterests.map((interest) => (
                            <option key={interest} value={interest}>
                                {interest}
                            </option>
                        ))}
                    </select>
                </div>

                {profile.interests.length > 0 && (
                    <div className="formRow">
                        <label>Rate your interests:</label>
                        {profile.interests.map((interest) => (
                            <div key={interest}>
                                <label>{interest}</label>
                                <select
                                    name={interest}
                                    value={profile.rankings[interest] || 1}
                                    onChange={handleRatingChange}
                                >
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit" onClick={isNew? createProfile : editProfile}>{isNew ? "Create Profile" : "Save Changes"}</button>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ProfileForm;