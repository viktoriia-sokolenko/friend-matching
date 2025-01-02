import { useState, useEffect } from 'react'
import PlaceholderImage from './assets/placeholder.jpg'

const ProfileCard = ({firstName, lastName, year, bio, major}) => {
    return (
        <div className = "ProfileCard">
            <img 
                    className = "icons"
                    src={PlaceholderImage}
                    alt={`Placeholder Image`}
            />
            <div className='ProfileText'>
                <h1>{firstName} {lastName}</h1>
                <h2>{major}</h2>
                <h2>Class of {year}</h2>
                <p>{bio}</p>
            </div>
        </div>
    )

}
export default ProfileCard;