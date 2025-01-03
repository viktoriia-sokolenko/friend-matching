import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard';


const Profiles = () => {
    const [allProfiles, setAllProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    useEffect(() => {
        const getAllProfiles = async () => {
            const token = localStorage.getItem('access_token');
            try {
            const response = await fetch('/users/profiles', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const data_with_profiles = data.filter(student => student.user_profiles !== null);
            setAllProfiles(data_with_profiles);
            setFilteredProfiles(data_with_profiles);
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
                        firstName={student.first_name}
                        lastName={student.last_name} 
                        year={student.user_profiles.year}
                        major={student.user_profiles.major}
                        bio = {student.user_profiles.bio}
                        image = {student.profilepicture}
                    />
                ))
            }
        </div>
    )

}
export default Profiles;