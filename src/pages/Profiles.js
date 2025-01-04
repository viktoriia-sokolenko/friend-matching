import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../AuthContext';


const Profiles = () => {
    const [allProfiles, setAllProfiles] = useState([]);
    const { savedProfiles } = useAuth();
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedYears, setSelectedYears] = useState([]);
    const [allYears, setAllYears] = useState([]);
    const [includeSavedProfiles, setIncludeSavedProfiles] = useState(false);
    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYears((prevYears) => {
            if (prevYears.includes(year)) {
                return prevYears.filter((selectedYear) => selectedYear !== year);
            } else {
                return [...prevYears, year];
            }
        });
    };
    const handleSavedProfilesChange = (e) => {
        setIncludeSavedProfiles(e.target.checked);
    };
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
            setAllYears(Array.from(new Set(data_with_profiles.map((profile) => profile.user_profiles.year.toString()))));
          } catch (error) {
            console.error("Error fetching profiles:", error);
          }
        };
        getAllProfiles();
      }, []);
      useEffect(() => {
        const filterProfiles = () => {
            if (allProfiles) {
                const filteredData = allProfiles.filter((profile) => {
                  const matchesYear= (selectedYears.length === 0 || selectedYears.includes(profile.user_profiles.year.toString()));
                    if (!matchesYear) return false;
                    const isSaved = savedProfiles.some((savedProfile) => profile.id === savedProfile.saved_id);
                    if (!includeSavedProfiles && isSaved) {
                        return false;
                    }
                    if (searchInput === "") return true;
                    const lowerSearchInput = searchInput.toLowerCase();
                    const bioMatches = (profile.user_profiles.bio?.toLowerCase().includes(lowerSearchInput));
                    const majorMatches = (profile.user_profiles.major?.toLowerCase().includes(lowerSearchInput));
                    const firstNameMatches = (profile.first_name.toLowerCase().includes(lowerSearchInput));
                    const lastNameMatches = (profile.last_name.toLowerCase().includes(lowerSearchInput));
                    return (bioMatches || majorMatches || firstNameMatches || lastNameMatches);
                });
                setFilteredProfiles(filteredData);
              }
        };
        filterProfiles();
      }, [searchInput, allProfiles, selectedYears, includeSavedProfiles, savedProfiles]);
    return (
        <div className='Page'>
            <div className = "Form">
                <input
                    type="text"
                    placeholder="Search by keywords"
                    className='input-name'
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <p>Graduation Year:</p>
                <div>
                    {allYears.map((year) => (
                        <label key={year}>
                            <input
                                type="checkbox"
                                value = {year}
                                checked={selectedYears.includes(year)}
                                onChange={handleYearChange}
                            />
                            {year}
                        </label>
                    ))}
                </div>
                <label>
                    <input
                        type="checkbox"
                        checked={includeSavedProfiles}
                        onChange={handleSavedProfilesChange}
                    />
                    Include saved profiles
                </label>
            </div> 
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
        </div>
    )

}
export default Profiles;