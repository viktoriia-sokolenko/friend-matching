import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext';
import { useNavigate } from "react-router-dom";
import PlaceholderImage from '../assets/logo.png'
import ProfileForm from '../components/ProfileForm';
import AccountForm from '../components/AccountForm';

const Profile = () => {
    const { token, userId } = useAuth();
    const [student, setStudent] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [isNew, setIsNew] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const editProfile = () => {
        setEditMode(true);
    };
    const deleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                const response = await fetch(`/users/profiles/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    navigate(`/profiles`);
                    setError("");
                } else {
                    setError("Failed to delete profile.");
                }
            } catch (error) {
                console.error("Error deleting profile:", error);
                setError("Failed to delete profile.");
            }
        }
    };
    useEffect(() => {
        const getProfile = async () => {
          try {
            const response = await fetch(`/users/profiles/${userId}`,{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setStudent(data);
            if (data.user_profiles) {
                setIsNew(false);
                setUserProfile(data.user_profiles);
            } else {
                setIsNew(true);
            }
          } catch (error) {
            console.error("Error fetching student profile:", error);
          }
        };
        getProfile();
      }, [userId, token]);
    return (
        <div className = "Profile">
            <img 
                    className = "icons"
                    src={PlaceholderImage}
                    alt={`Northwestern Logo`}
            />
            {editMode?
            (
                <div className = "ColumnPage">
                <AccountForm user={student}/>
                <ProfileForm user={userProfile} new={isNew}/>
                </div>
            )
            :
            (<div className = "ProfileText">
                <h1>{student.first_name} {student.last_name}</h1>
                {isNew?
                (<button onClick = {editProfile}>Edit</button>)
                : 
                (
                <>
                <h2>{student.user_profiles?.major || 'Unknown major'}</h2>
                {student.user_profiles?.year && (<h2>Class of {student.user_profiles.year}</h2>)}
                {student.user_profiles?.rankings && 
                (<>
                <h4>Interests:</h4>
                <ul>
                {Object.entries(student.user_profiles?.rankings)
                  .sort((a, b) => b[1] - a[1])
                  .map(([interest, ranking]) => (
                  <li key={interest}>
                    {interest}: {ranking}
                  </li>
                ))}
                </ul>
                </>)
                }
                {student.user_profiles?.bio && (<p>{student.user_profiles.bio}</p>)}
                {student.user_profiles?.contact_info && (<h4>Contact me at: {student.user_profiles.contact_info}</h4>)}
                <div className="buttonRow">
                <button onClick = {editProfile}>Edit</button>
                <button onClick = {deleteProfile}>Delete</button>
                </div>
                {error && <p className="error">{error}</p>}
                </>
                )
                }
            </div>)
            }
        </div>
    )

}
export default Profile;