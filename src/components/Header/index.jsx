import React, {useEffect, useState} from 'react';
import './index.scss'
import {useAuth} from "../../context/auth.jsx";
import cn from 'classnames'
import {useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom'

const Index = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if(location.pathname === '/profile') {
      setIsProfile(true)
    } else {
      setIsProfile(false)
    }
    
    if(location.pathname === '/admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [location.pathname]);
  
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  
  const handleProfile = () => {
    navigate('/profile');
  }
  
  const handleAdmin = () => {
    navigate('/admin');
  }
  
  return (
      <header className='header'>
        <a href='/' className='header__logo-box'>
          <img src="/logo.png" alt="logo"/>
        </a>
        <div className="header__links">
          {user && (
              <span className='header__login-count'>Logins Count: {user.loginsCount || 0}</span>
          )}
          {user && user.role === 'admin' &&  (
              <div className={cn('header__admin', isAdmin && 'current')} onClick={() => handleAdmin()}>
                A
              </div>
          )}
          {user && (
              <div className={cn('header__profile', isProfile && 'current')} onClick={() => handleProfile()}>
                <img src="/user.svg" alt="profile"/>
              </div>
          )}
          {user && (
              <img className='header__logout' src="/logout.png" alt="logout" onClick={() => handleLogout()}/>
          )}
        </div>
      </header>
  );
};

export default Index;