import React, { useState } from 'react';
import './index.scss'
import { auth, db, signInWithEmailAndPassword, getDoc, doc } from '../../firabase/firebase.js';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";
import {validationErrors} from "../../constants/errors.js";
import InputField from "../UI/InputField/index.jsx";

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
      formErrors.email = validationErrors.emailError
      isValid = false
    }
    
    if (password.length < 8 || password.length === 0) {
      formErrors.password = validationErrors.passwordError
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
    } else {
      setIsLoading(false)
    }
  }
  
  
  return (
      <div className="login">
        <h2 className="login__title">Sign In</h2>
        <form onSubmit={handleLogin} className='login__form'>
          <div className='login__error'>{errorMessage}</div>
          <InputField
              type='email'
              name='email'
              id='email'
              value={email}
              handleState={setEmail}
              labelTitle='Email'
              error={errors.email}
          />
          <InputField
              type='password'
              name='password'
              id='password'
              value={password}
              handleState={setPassword}
              labelTitle='New Password'
              error={errors.password}
          />
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