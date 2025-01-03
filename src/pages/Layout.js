import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
    const [token, setToken] = useState("");
    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("authToken");
    };
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
            setToken(accessToken);
            window.history.replaceState(null, "", window.location.pathname);
        }
        else {
            const savedToken = localStorage.getItem("access_token");
            if (savedToken) {
            setToken(savedToken);
      }
        }
        
    }, [])
    return (
    <>
      <NavBar token={token} onLogout={handleLogout}/>
      <Outlet context={{ setAuthToken: setToken }}/>
    </>
    )
};

export default Layout;