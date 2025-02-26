import React, {useEffect, useState} from 'react';
import './index.scss'
import {useAuth} from "../../context/auth.jsx";
import cn from "classnames";
import {auth, db, doc, updateDoc, updatePassword, updateEmail} from "../../firabase/firebase.js";
import {loadImage} from "../../utils/cloudinary.js";
import {emailRegex} from "../../utils/validation.js";
import Loader from "../UI/Loader/index.jsx";
import Button from "../UI/Button/index.jsx";
import {validationErrors} from "../../constants/errors.js";
import InputField from "../UI/InputField/index.jsx";

const Index = () => {
  const { user, setUserData } = useAuth();
  
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [image, setImage] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , name: '', age: ''})
  const [isChanged, setIsChanged] = useState(false)
  
  useEffect(() => {
    const timerMessage = setTimeout(() => {
      setIsSuccessful(false)
    }, 5000)
    
    return () => clearTimeout(timerMessage);
  }, [isSuccessful]);
  
  useEffect(() => {
    if (
        email !== user.email ||
        name !== user.name ||
        age !== user.age ||
        password.length > 0 ||
        image
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [email, name, age, password, image, user]);
  
  useEffect(() => {
    setIsChanged(false);
  }, [user]);
  
  const validate = (email, password, name, age) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', name: '', age: ''};
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = validationErrors.passwordError
      isValid = false
    }
    
    if (password.length > 0 && password.length < 8) {
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
  const handleEdit = async (e) => {
    e.preventDefault()
    
    setConfirmMessage(false)
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
        
        // try {
        //   await updateEmail(userFirebase, email);
        //   setConfirmMessage(true);
        //   userObject.email = email;
        // } catch (emailError) {
        //   console.error("Error change email:", emailError.message);
        //   setConfirmMessage(true);
        // }
        
        await updateDoc(userDoc, userObject);
        setUserData(userObject);
        setIsChanged(false)
        
        setIsSuccessful(true)
      } catch(err) {
        console.log(err.message)
        setIsLoading(true)
      } finally {
        setIsLoading(false)
        setIsChanged(false)
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
            {confirmMessage && <span className='profile__successful'>Please check your original address for confirm change your email</span>}
            <InputField
                type='password'
                name='password'
                id='password'
                value={password}
                handleState={setPassword}
                labelTitle='New Password'
                error={errors.password}
            />
            <InputField
                type='number'
                name='age'
                id='age'
                value={age}
                handleState={setAge}
                labelTitle='Age'
                error={errors.age}
            />
            {isSuccessful && <span className='profile__successful'>Data changed</span>}
            {!isLoading ? (
                <Button
                    text='Go'
                    handler={handleEdit}
                    disabled={!isChanged || isLoading}
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