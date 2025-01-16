import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AccountForm = ({ user}) => {
    const { token } = useAuth();
    const [userData, setUserData] = useState({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setUserData({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const editAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error("Failed to update account");
            }
            navigate(`/profiles`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="Form">
            <form>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" onClick={editAccount}>Edit Account</button>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AccountForm;