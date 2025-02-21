import React, {useEffect, useState} from 'react';
import './index.scss'
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom'

const Index = () => {
  const [isProfile, setIsProfile] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    location.pathname === '/profile' ? setIsProfile(true) : setIsProfile(false)
  }, [location.pathname]);
  
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  
  const handleProfile = () => {
    navigate('/profile');
  }
  
  return (
      <header className='header'>
        <div className="site-container">
          <a href='/' className='header__logo-box'>
            <img src="/logo.png" alt="logo"/>
          </a>
          <div className="header__links">
            {user && !isProfile && (
                <div className="header__profile" onClick={() => handleProfile()}>
                  <img src="/user.svg" alt="profile"/>
                </div>
            )}
            {user && (
                <img className='header__logout' src="/logout.png" alt="logout" onClick={() => handleLogout()} />
            )}
          </div>
        </div>
      </header>
  );
};

export default Index;