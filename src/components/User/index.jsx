import React, {useEffect, useState} from 'react';
import Modal from "../UI/Modal/index.jsx";
import './index.scss'
import {validationErrors} from "../../constants/errors.js";
import {db, doc, updateDoc} from "../../firabase/firebase.js";
import {loadImage} from "../../utils/cloudinary.js";
import cn from "classnames";
import InputField from "../UI/InputField/index.jsx";
import Button from "../UI/Button/index.jsx";
import Loader from "../UI/Loader/index.jsx";


const Index = ({ user, setUsers }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSuccessful, setEditSuccessful] = useState(false);
  const [image, setImage] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({ firstName: '', lastName: '', age: '', role: ''})
  
  useEffect(() => {
    if (
        firstName !== user.firstName ||
        lastName !== user.lastName ||
        age !== user.age ||
        role !== user.role ||
        image
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [firstName, lastName, age, image, role, user]);
  
  useEffect(() => {
    setIsChanged(false);
  }, [user]);
  
  useEffect(() => {
    const timerMessage = setTimeout(() => {
      setEditSuccessful(false)
    }, 5000)
    
    return () => clearTimeout(timerMessage);
  }, [editSuccessful]);
  
  const handleShowProfile = () => {
    setIsModalOpen(true);
    
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAge(user.age);
    setRole(user.role);
  }
  
  const validate = (firstName, lastName, age, role) => {
    let isValid = true;
    
    const formErrors = { firstName: '', lastName: '', age: '', role: ''};
    
    if (age < 18 || age.length === 0) {
      formErrors.age = validationErrors.ageError
      isValid = false
    }
    
    if (firstName.length > 0 && firstName.length < 2) {
      formErrors.firstName = validationErrors.nameError
      isValid = false
    }
    
    if (lastName.length > 0 && lastName.length < 2) {
      formErrors.lastName = validationErrors.nameError
      isValid = false
    }
    
    if (!role) {
      formErrors.role = validationErrors.roleError
      isValid = false
    }
    
    setErrors(formErrors)
    
    return isValid
  }
  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    setEditSuccessful(false)
    setIsLoading(true)
    
    if(validate(firstName, lastName, age, role)) {
      try {
        const userId = user.id
        
        const userDoc = doc(db, "users", userId);
        
        const userObject = {
          id: userId,
          firstName: firstName.length > 0 ? firstName : user.firstName,
          age: age,
          role: role,
          lastName: lastName.length > 0 ? lastName : user.lastName,
          image: image ? await loadImage(image) : user.image
        }
        
        await updateDoc(userDoc, userObject);
        
        setUsers((prev) =>
            prev.map((item) => (item.id === userId ? { ...item, ...userObject } : item))
        );
        
        setIsChanged(false)
        setEditSuccessful(true)
        setIsModalOpen(false)
        
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
      <>
        <div key={user.id} className="user" onClick={handleShowProfile}>
          <img src={user.image || "/user.svg"} alt="user-image" className="user__image"/>
          <span>{user.email}</span>
          <span>{user.firstName}</span>
          <span>{user.lastName}</span>
          <span>{user.age}</span>
          <span>{user.role}</span>
          <span>{user.tasks.length}</span>
        </div>
        <Modal
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        >
          <h2 className='user__modal-title'>{user.firstName} Profile</h2>
          <div className='user__modal-box'>
            <form onSubmit={handleEditProfile} className='user__form'>
              <div className='user__image-container user__image-container'>
                <input
                    className={cn('user__image-input', errors.image && 'validate')}
                    placeholder=''
                    type="file"
                    name='image'
                    id='image'
                    accept="image/png, image/jpeg"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <img
                    className="user__user-image"
                    src={image ? URL.createObjectURL(image) : user.image || "/user-icon.svg"}
                    alt="user-image"
                />
                <img className='user__edit-icon' src="/edit-icon.svg" alt="image-edit-icon"/>
              </div>
              <select name="role" id="role" className='user__role-select' value={role}
                      onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
                  type='number'
                  name='age'
                  id='age'
                  value={age}
                  handleState={setAge}
                  labelTitle='Age'
                  error={errors.age}
              />
              {editSuccessful && <span className='profile__successful'>Data changed</span>}
              {!isLoading ? (
                  <Button
                      text='Go'
                      handler={handleEditProfile}
                      disabled={!isChanged || isLoading}
                  />
              ) : (
                  <Loader/>
              )}
            </form>
          </div>
        </Modal>
      </>
  );
};

export default Index;