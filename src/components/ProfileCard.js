import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';
import PlaceholderImage from '../assets/logo.png'

const ProfileCard = ({id, firstName, lastName, year, bio, major, image, interestScore}) => {
    const { savedProfiles, handleToggleSave } = useAuth();
    const isSaved = savedProfiles.some((profile) => profile.saved_id === id);
    return (
        <div className = "ProfileCard">
            <img 
                    src={image? image : PlaceholderImage}
                    alt={`Northwestern Logo`}
            />
            <div className='ProfileText'>
                <h1>{firstName} {lastName} <span>Match: {interestScore}%</span></h1>
                <h2>{major} Class of {year}</h2>
                <p>{bio}</p>
                <div className="formRow">
                <Link to={`/profiles/${id}`}><button>Connect</button></Link>
                <button onClick={() => handleToggleSave(id, isSaved)}>
                    {isSaved ? "Delete from Saved" : "Save"}
                </button>
                </div>
            </div>
        </div>
    )

}
export default ProfileCard;