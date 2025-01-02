import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard';


const Profiles = () => {
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    useEffect(() => {
        setFilteredProfiles([
            {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                graduationyear: 2027,
                major: 'Human Development',
                bio: 'Thinking about Roman Empire.'
            },
            {
                id: 2,
                firstname: 'Jane',
                lastname: 'Smith',
                graduationyear: 2025,
                major: 'Data Science',
                bio: 'Love books, films, music.'
            }
        ]);
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
                    />
                ))
            }
        </div>
    )

}
export default Profiles;