import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import PlaceholderImage from '../assets/placeholder.jpg'


const ViewProfile = () => {
    let params = useParams();
    let id = params.id;
    const [student, setStudent] = useState({})
    useEffect(() => {
        const getProfile = async () => {
          try {
            const response = await fetch(`/users/${id}`);
            const data = await response.json();
            console.log(data);
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
                    src={student.image? student.image : PlaceholderImage}
                    alt={`${student.first_name} ${student.last_name}'s profile picture`}
            />
            <div className = "ProfileText">
                <h1>{student.first_name} {student.last_name}</h1>
                <h2>{student.major}</h2>
                <h2>Class of {student.year}</h2>
                <p>{student.bio}</p>
            </div>
        </div>
    )

}
export default ViewProfile;