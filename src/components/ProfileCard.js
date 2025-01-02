import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import PlaceholderImage from '../assets/placeholder.jpg'

const ProfileCard = ({id, firstName, lastName, year, bio, major, image}) => {
    return (
        <div className = "ProfileCard">
            <img 
                    src={image? image : PlaceholderImage}
                    alt={`${firstName} ${lastName}'s profile picture`}
            />
            <div className='ProfileText'>
                <h1>{firstName} {lastName} <span>Class of {year}</span></h1>
                <h2>{major}</h2>
                <p>{bio}</p>
                <Link to={`/profiles/${id}`}><button>Connect</button></Link>
            </div>
        </div>
    )

}
export default ProfileCard;