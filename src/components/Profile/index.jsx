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
import Modal from "../UI/Modal/index.jsx";
import {deleteDoc} from "firebase/firestore";
import {deleteUser, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";

const Index = () => {
  const { user, setUserData, logout } = useAuth();
  
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [image, setImage] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , firstName: '', lastName: '', age: ''})
  const [isChanged, setIsChanged] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  
  
  useEffect(() => {
    const timerMessage = setTimeout(() => {
      setIsSuccessful(false)
    }, 5000)
    
    return () => clearTimeout(timerMessage);
  }, [isSuccessful]);
  
  useEffect(() => {
    if (
        email !== user.email ||
        firstName !== user.firstName ||
        lastName !== user.lastName ||
        age !== user.age ||
        password.length > 0 ||
        image
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [email, firstName, lastName, age, password, image, user]);
  
  useEffect(() => {
    setIsChanged(false);
  }, [user]);
  
  const validate = (email, password, firstName, lastName, age) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', firstName: '', lastName: '', age: ''};
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = validationErrors.emailError
      isValid = false
    }
    
    if (password.length > 0 && password.length < 8) {
      formErrors.password = validationErrors.passwordError
      isValid = false
    }
    
    if (age < 18 || age.length === 0) {
      formErrors.age = validationErrors.ageError
      isValid = false
    }
    
    if (firstName.length < 2 || firstName.length === 0) {
      formErrors.firstName = validationErrors.nameError
      isValid = false
    }
    
    if (lastName.length > 0 && lastName.length < 2) {
      formErrors.lastName = validationErrors.nameError
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
    
    if(validate(email, password, firstName, lastName, age)) {
      try {
        const userFirebase = auth.currentUser
        const userId = user.id

        const userDoc = doc(db, "users", userId);
        
        const userObject = {
          id: userId,
          firstName: firstName,
          age: age,
        }
        
        if (lastName.length > 0) {
          userObject.lastName = lastName
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
  
  const handleDeleteAccount = async (e) => {
    setDeleteError(false)
    
    const currentUser = auth.currentUser
    
    const userId = currentUser.uid
    
    try {
      
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      
      await reauthenticateWithCredential(currentUser, credential)
      
      await deleteDoc(doc(db, "users", userId));
      
      await deleteUser(currentUser);
      
      logout()
    } catch (error) {
      setDeleteError(true)
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
            <div className='profile__delete'>
              Wanna delete account? <span onClick={() => setIsModalOpen(true)} className='profile__delete-text'>Click for delete</span>
            </div>
            <Modal
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
              <h2 className='profile__modal-text'>If you want to delete your account, please enter your password</h2>
              <div className='profile__modal-box'>
                <input className='profile__modal-input' type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}/>
                <button type='button' className='profile__modal-btn' onClick={handleDeleteAccount}>Delete</button>
              </div>
              {deleteError && <div className='profile__error-edit'>Incorrect password</div>}
            </Modal>
            <InputField
                type='text'
                name='firstName'
                id='firstName'
                value={firstName}
                handleState={setFirstName}
                labelTitle='First Name'
                error={errors.firstName}
            />
            <InputField
                type='text'
                name='lastName'
                id='lastName'
                value={lastName}
                handleState={setLastName}
                labelTitle='Last Name'
                error={errors.lastName}
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