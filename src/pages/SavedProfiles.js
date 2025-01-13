import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import ProfileCard from '../components/ProfileCard';

const SavedProfiles = () => {
  const { savedProfiles } = useAuth();
  return (
    <div className="Page">
      <div className="grid">
        {savedProfiles.map((profile) => (
          <ProfileCard
            key={profile.saved_id}
            id={profile.saved_id}
            firstName={profile.users.first_name}
            lastName={profile.users.last_name}
            year={profile.users.user_profiles.year}
            major={profile.users.user_profiles.major}
            bio={profile.users.user_profiles.bio}
            image={profile.users.profilepicture}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedProfiles;