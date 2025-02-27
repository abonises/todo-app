import React, {useState} from 'react';
import './index.scss'
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../../firabase/firebase.js';
import {useAuth} from "../../context/auth.jsx";
import {useNavigate} from "react-router-dom";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";
import {validationErrors} from "../../constants/errors.js";
import InputField from "../UI/InputField/index.jsx";

const Index = () => {
  
  const { login } = useAuth();
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , name: '', age: ''});
  const [errorMessage, setErrorMessage] = useState('')
  
  const validate = (email, password, name, age) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', name: '', age: '' };
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = validationErrors.passwordError
      isValid = false
    }
    
    if (password.length < 0 && password.length === 0) {
      formErrors.password = validationErrors.emailError
      isValid = false
    }
    
    if (age < 18 || age.length === 0) {
      formErrors.age = validationErrors.ageError
      isValid = false
    }
    
    if (name.length < 2 || name.length === 0) {
      formErrors.name = validationErrors.nameError
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
          firstName: name,
          lastName: '',
          email: email,
          age: age,
          tasks: [],
          loginsCount: 0,
          role: 'user',
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
        err.code === 'auth/email-already-in-use' ? setErrorMessage('User with this email already exists') : setErrorMessage('Server Error. Please try letter')
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }
  
  
  return (
      <div className="register">
        <h2 className="register__title">Sign Up</h2>
        <div className='register__error'>{errorMessage}</div>
        <form onSubmit={handleRegister} className='register__form'>
          <div className='register__top'>
            <InputField
                type='text'
                name='name'
                id='name'
                value={name}
                handleState={setName}
                labelTitle='Name'
                error={errors.name}
            />
            <InputField
                type='email'
                name='email'
                id='email'
                value={email}
                handleState={setEmail}
                labelTitle='Email'
                error={errors.email}
            />
          </div>
          <div className='register__bottom'>
            <InputField
                type='number'
                name='age'
                id='age'
                value={age}
                handleState={setAge}
                labelTitle='Age'
                error={errors.age}
            />
            <InputField
                type='password'
                name='password'
                id='password'
                value={password}
                handleState={setPassword}
                labelTitle='Password'
                error={errors.password}
            />
          </div>
          {!isLoading ? (
              <Button
                  text='Go'
                  handler={handleRegister}
              />
          ) : (
              <Loader/>
          )}
        </form>
      </div>
  );
};

export default Index;