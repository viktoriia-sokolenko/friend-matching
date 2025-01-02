import { useState, useEffect } from 'react'

const Profile = () => {
    const [firstName, setFirstName] = useState("First Name");
    const [lastName, setLastName] = useState("Last Name");
    const [year, setYear] = useState(1000);
    const [bio, setBio] = useState("Bio");
    const [major, setMajor] = useState("Major");
    return (
        <div className = "Profile">
            <div>
                <h1>{firstName} {lastName}</h1>
                <h2>{major}</h2>
                <h2>Class of {year}</h2>
                <p>{bio}</p>
            </div>
        </div>
    )

}
export default Profile;