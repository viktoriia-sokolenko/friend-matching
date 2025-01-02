import React from 'react';
import { Outlet, Link } from "react-router-dom";


const NavBar = () => {
    return (
        <nav className='menu'>
        <ul className='nav-sections'>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profiles">Search</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    );
};

export default NavBar;