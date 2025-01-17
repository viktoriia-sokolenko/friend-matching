import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import PlaceholderImage from '../assets/logo.png'

const ViewProfile = () => {
    let params = useParams();
    let id = params.id;
    const [student, setStudent] = useState({})
    useEffect(() => {
        const getProfile = async () => {
        const token = localStorage.getItem('access_token');
          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profiles/${id}`,{
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
                    alt={`Northwestern Logo`}
            />
            <div className = "ProfileText">
                <h1>{student.first_name} {student.last_name}</h1>
                <h2>{student.user_profiles?.major || 'N/A'}</h2>
                <h2>Class of {student.user_profiles?.year || 'N/A'}</h2>
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
                <p>{student.user_profiles?.bio || 'No bio available'}</p>
                <h4>
                  {student.user_profiles?.contact_info
                    ? `Contact me at ${student.user_profiles.contact_info}`
                    : 'No contact info available'}
                </h4>
            </div>
        </div>
    )

}
export default ViewProfile;