import React, {useEffect, useState} from 'react';
import './index.scss'
import {useAuth} from "../../context/auth.jsx";
import cn from "classnames";
import {auth, createUserWithEmailAndPassword, db, doc, setDoc, updateDoc, updatePassword, updateEmail} from "../../firabase/firebase.js";
import {loadImage} from "../../utils/cloudinary.js";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";

const Index = () => {
  const { user, setUserData } = useAuth();
  
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [image, setImage] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , name: '', age: ''})
  
  useEffect(() => {
    const timerMessage = setTimeout(() => {
      setIsSuccessful(false)
    }, 5000)
    
    return () => clearTimeout(timerMessage);
  }, [isSuccessful]);
  const validate = (email, password, name, age) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', name: '', age: ''};
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = 'Incorrect email format'
      isValid = false
    }
    
    if (password.length > 0 && password.length < 8) {
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
  const handleEdit = async (e) => {
    e.preventDefault()
    
    setIsSuccessful(false)
    setIsLoading(true)
    
    if(validate(email, password, name, age)) {
      try {
        const userFirebase = auth.currentUser
        const userId = user.id

        const userDoc = doc(db, "users", userId);
        
        const userObject = {
          id: userId,
          name: name,
          email: email,
          age: age,
        }
        
        if(image) {
          userObject.image = await loadImage(image)
        } else {
          userObject.image = user.image;
        }

        if (password.length > 0) {
          await updatePassword(userFirebase, password);
        }

        // await updateEmail(userFirebase, email);
        await updateDoc(userDoc, userObject);
        setUserData(userObject);
        
        setIsSuccessful(true)
      } catch(err) {
        console.log(err.message)
        setIsLoading(true)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }
  
  return (
      <div className='profile__wrapper'>
        <div className='profile'>
          <form onSubmit={handleEdit} className='profile__form'>
            <div className='profile__image-container profile__image-container'>
              <input
                  className={cn('profile__image-input', errors.image && 'validate')}
                  placeholder=''
                  type="file"
                  name='image'
                  id='image'
                  accept="image/png, image/jpeg"
                  onChange={(e) => setImage(e.target.files[0])}
              />
              <img
                  className="profile__user-image"
                  src={image ? URL.createObjectURL(image) : user.image || "/user-icon.svg"}
                  alt="user-image"
              />
              <img className='profile__edit-icon' src="/edit-icon.svg" alt="image-edit-icon"/>
            </div>
            <div className='profile__name-container profile__input-container'>
              <input
                  className={cn('profile__name-input profile__input', errors.name && 'validate')}
                  placeholder=''
                  type="text"
                  name='name'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
              <label className='profile__name-label profile__label' htmlFor="name">Name</label>
              <div className='profile__validate-error'>{errors.name}</div>
            </div>
            <div className='profile__email-container profile__input-container'>
              <input
                  className={cn('profile__email-input profile__input', errors.email && 'validate')}
                  placeholder=''
                  type="email"
                  name='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <label className='profile__email-label profile__label' htmlFor="email">Email</label>
              <div className='profile__validate-error'>{errors.email}</div>
            </div>
            <div className='profile__password-container profile__input-container'>
              <input
                  className={cn('profile__password-input profile__input', errors.password && 'validate')}
                  type="password"
                  placeholder=''
                  name='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <label className='profile__password-label profile__label' htmlFor="password">New Password</label>
              <div className='profile__validate-error'>{errors.password}</div>
            </div>
            <div className='profile__age-container profile__input-container'>
              <input
                  className={cn('profile__age-input profile__input', errors.age && 'validate')}
                  placeholder=''
                  type="number"
                  name='age'
                  id='age'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
              />
              <label className='profile__age-label profile__label' htmlFor="age">Age</label>
              <div className='profile__validate-error'>{errors.age}</div>
            </div>
            {isSuccessful && <span className='profile__successful'>Data changed</span>}
            {!isLoading ? (
                <Button
                    text='Go'
                    handler={handleEdit}
                />
            ) : (
                <Loader />
            )}
          </form>
        </div>
      </div>
  );
};

export default Index;