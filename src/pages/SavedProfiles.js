import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import ProfileCard from '../components/ProfileCard';

const SavedProfiles = () => {
  const { savedProfiles, userId, memoizedGetInterestScore, token } = useAuth();
  const [profiles, setProfiles] = useState (savedProfiles);
  useEffect(() => {
    const calculateInterestScores = async () => {
      try {
        const response = await fetch(`/users/profiles/${userId}`,{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.user_profiles?.interests && data.user_profiles?.rankings){
          const data_with_scores = savedProfiles.map(student => {
              const { rankings } = student.users.user_profiles;
              const interestScore = memoizedGetInterestScore(rankings, data);
              return { ...student, interestScore };
          });
          setProfiles(data_with_scores);
      }
      } catch (error) {
        console.error("Error getting interest match scores for saved profiles:", error);
      }
    };
    calculateInterestScores();
  }, [savedProfiles, userId, memoizedGetInterestScore, token]);
  return (
    <div className="Page">
      <div className="grid">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.saved_id}
            id={profile.saved_id}
            firstName={profile.users.first_name}
            lastName={profile.users.last_name}
            year={profile.users.user_profiles.year}
            major={profile.users.user_profiles.major}
            bio={profile.users.user_profiles.bio}
            image={profile.users.profilepicture}
            score={profile.users.user_profiles.interestScore || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedProfiles;