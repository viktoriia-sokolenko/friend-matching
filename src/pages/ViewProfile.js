import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import PlaceholderImage from '../assets/placeholder.jpg'


const ViewProfile = () => {
    let params = useParams();
    let id = params.id;
    const [student, setStudent] = useState({})
    useEffect(() => {
        const getProfile = async () => {
        const token = localStorage.getItem('access_token');
          try {
            const response = await fetch(`/users/profiles/${id}`,{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setStudent(data);
          } catch (error) {
            console.error("Error fetching student profile:", error);
          }
        };
        getProfile();
      }, [id]);
    return (
        <div className = "Profile">
            <img 
                    className = "icons"
                    src={PlaceholderImage}
                    alt={`${student.first_name} ${student.last_name}'s profile picture`}
            />
            <div className = "ProfileText">
                <h1>{student.first_name} {student.last_name}</h1>
                <h2>{student.user_profiles?.major || 'N/A'}</h2>
                <h2>Class of {student.user_profiles?.year || 'N/A'}</h2>
                <p>{student.user_profiles?.bio || 'No bio available'}</p>
            </div>
        </div>
    )

}
export default ViewProfile;