import React, {useEffect, useState} from 'react';
import './index.scss'
import cn from 'classnames';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../../firabase/firebase.js';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";

const Index = () => {
  
  const { login } = useAuth();
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , name: '', age: ''});
  const validate = (email, password, name, age) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', name: '', age: '' };
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = 'Incorrect email format'
      isValid = false
    }
    
    if (password.length < 8 || password.length === 0) {
      formErrors.password = 'Password must be at least 8 characters'
      isValid = false
    }
    
    if (age < 18 || age.length === 0) {
      formErrors.age = 'You must be 18 y.o for registration'
      isValid = false
    }
    
    if (name.length < 2 || name.length === 0) {
      formErrors.name = 'Minimum 2 length'
      isValid = false
    }
    
    setErrors(formErrors)
    
    return isValid
  }
  
  const handleRegister = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    if(validate(email, password, name, age)) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        const userId = user.uid
        
        const userObject = {
          id: userId,
          name: name,
          email: email,
          age: age,
          tasks: [],
          image: ''
        }
        
        await setDoc(doc(db, "users", userId), userObject);
        
        login(userObject);
        navigate('/')
        
        setEmail('');
        setPassword('');
        setName('');
        setAge('');
        
      } catch (err) {
        console.log('unlucky')
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  
  return (
      <div className="register">
        <h2 className="register__title">Sign Up</h2>
        <form onSubmit={handleRegister} className='register__form'>
          <div className='register__top'>
            <div className='register__name-container register__input-container'>
              <input
                  className={cn('register__name-input register__input', errors.name && 'validate')}
                  placeholder=''
                  type="text"
                  name='name'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
              <label className='register__name-label register__label' htmlFor="name">Name</label>
              <div className='register__validate-error'>{errors.name}</div>
            </div>
            <div className='register__email-container register__input-container'>
              <input
                  className={cn('register__email-input register__input', errors.email && 'validate')}
                  placeholder=''
                  type="email"
                  name='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <label className='register__email-label register__label' htmlFor="email">Email</label>
              <div className='register__validate-error'>{errors.email}</div>
            </div>
          </div>
          <div className='register__bottom'>
            <div className='register__age-container register__input-container'>
              <input
                  className={cn('register__age-input register__input', errors.age && 'validate')}
                  placeholder=''
                  type="number"
                  name='age'
                  id='age'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
              />
              <label className='register__age-label register__label' htmlFor="age">Age</label>
              <div className='register__validate-error'>{errors.age}</div>
            </div>
            <div className='register__password-container register__input-container'>
              <input
                  className={cn('register__password-input register__input', errors.password && 'validate')}
                  type="password"
                  placeholder=''
                  name='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <label className='register__password-label register__label' htmlFor="password">Password</label>
              <div className='register__validate-error'>{errors.password}</div>
            </div>
          </div>
          {!isLoading ? (
              <Button
                  text='Go'
                  handler={handleRegister}
              />
          ) : (
              <Loader />
          )}
        </form>
      </div>
  );
};

export default Index;