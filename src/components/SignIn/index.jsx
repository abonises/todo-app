import React, {useEffect, useState} from 'react';
import './index.scss'
import cn from 'classnames';
import { auth, db, signInWithEmailAndPassword, getDoc, doc } from '../../firabase/firebase.js';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";

const Index = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const validate = (email, password) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '' };
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = 'Incorrect email format'
      isValid = false
    }
    
    if (password.length < 8 || password.length === 0) {
      formErrors.password = 'Password must be at least 8 characters'
      isValid = false
    }
    
    setErrors(formErrors)
    
    return isValid
  }
  
  const handleLogin = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    if(validate(email, password)) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userId = user.uid;
        
        const userDoc = doc(db, "users", userId);
        const userDocData = await getDoc(userDoc);
        
        if (userDocData.exists()) {
          const userObject = userDocData.data();
          
          login(userObject);
          navigate('/')
          
          setEmail('');
          setPassword('');
        }
        
      } catch (err) {
        err.code === 'auth/invalid-credential' ? setErrorMessage('Invalid Email or Password') : setErrorMessage('Server Error. Please try letter')
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  
  return (
      <div className="login">
        <h2 className="login__title">Sign In</h2>
        <form onSubmit={handleLogin} className='login__form'>
          <div className='login__error'>{errorMessage}</div>
          <div className='login__email-container login__input-container'>
            <input
                className={cn('login__email-input login__input', errors.email && 'validate')}
                placeholder=''
                type="email"
                name='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label className='login__email-label login__label' htmlFor="email">Email</label>
            <div className='login__validate-error'>{errors.email}</div>
          </div>
          <div className='login__password-container login__input-container'>
            <input
                className={cn('login__password-input login__input', errors.password && 'validate')}
                type="password"
                placeholder=''
                name='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <label className='login__password-label login__label' htmlFor="password">Password</label>
            <div className='login__validate-error'>{errors.password}</div>
          </div>
          {!isLoading ? (
              <Button
                text='Go'
                handler={handleLogin}
              />
          ) : (
              <Loader />
          )}
        </form>
      </div>
  );
};

export default Index;