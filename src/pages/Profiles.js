import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard';


const Profiles = () => {
    const [allProfiles, setAllProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    useEffect(() => {
        const getAllProfiles = async () => {
          try {
            const response = await fetch("/users");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setAllProfiles(data);
            setFilteredProfiles(data);
          } catch (error) {
            console.error("Error fetching profiles:", error);
          }
        };
        getAllProfiles();
      }, []);
    return (
        <div className="Grid">
            {filteredProfiles.map((student) => (
                   <ProfileCard 
                        key={student.id} 
                        id={student.id} 
                        firstName={student.firstname}
                        lastName={student.lastname} 
                        year={student.graduationyear}
                        major={student.major}
                        bio = {student.bio}
                        image = {student.profilepicture}
                    />
                ))
            }
        </div>
    )

}
export default Profiles;