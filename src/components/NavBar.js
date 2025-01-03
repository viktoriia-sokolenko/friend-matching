import React from 'react';
import { Link } from "react-router-dom";


const NavBar = ({ token, onLogout }) => {
    return (
        <nav className='menu'>
        <ul className='nav-sections'>
          <li>
            <Link to="/">Home</Link>
          </li>
          {token ? (
          <>
            <li>
              <Link to="/profiles">Search</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={onLogout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
        </ul>
      </nav>
    );
};

export default NavBar;