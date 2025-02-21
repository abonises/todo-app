import React, {useState} from 'react';
import './index.scss'
import SignIn from "../SignIn/index.jsx";
import SignUp from "../SignUp/index.jsx";
import {useAuth} from "../../context/auth.jsx";
import {Navigate} from "react-router-dom";

const Index = () => {
  const [isRegistration, setIsRegistration] = useState(true);
  
  const { user } = useAuth()
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return (
      <div className='login-wrapper'>
        {isRegistration ? (<SignIn />) : (<SignUp />)}
        {isRegistration ? (
            <div className='login-wrapper__swap-form'>Already have an account? <span className='login-wrapper__swap-link' onClick={() => setIsRegistration(false)}>Click here</span></div>
        ) : (<div className='login-wrapper__swap-form'>No Account? <span
            className='login-wrapper__swap-link' onClick={() => setIsRegistration(true)}>Click here</span></div>)}
      </div>
  );
};

export default Index;