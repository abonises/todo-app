import React, {useEffect, useState} from 'react';
import cn from "classnames";
import Button from "../UI/Button/index.jsx";
import Loader from "../UI/Loader/index.jsx";
import './index.scss'
import {db, doc, updateDoc} from "../../firabase/firebase.js";
import {useAuth} from "../../context/auth.jsx";
import {getDoc} from "firebase/firestore";

const Index = () => {
  
  const { user, setUserData } = useAuth()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '' });
  
  useEffect(() => {
    const timerMessage = setTimeout(() => {
      setIsSuccessful(false)
    }, 5000)
    
    return () => clearTimeout(timerMessage);
  }, [isSuccessful]);
  
  const validate = (title, description) => {
    let isValid = true;
    
    const formErrors = { title: '', description: '' };
    
    if(title.length < 2 || title.length === 0) {
      formErrors.title = 'Minimum 2 length'
      isValid = false
    }
    
    if (description.length < 2 || description.length === 0) {
      formErrors.description = 'Minimum 2 length'
      isValid = false
    }
    
    setErrors(formErrors)
    
    return isValid
  }
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    setIsSuccessful(false)
    setIsLoading(true)
    
    if(validate(title, description)) {
      try {
        const userId = user.id
        
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const tasks = userData.tasks || [];
          
          const taskObject = {
            id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            title: title,
            description: description,
            isCompleted: false,
            createdAt: new Date(),
            userId: userId
          };
          
          const updatedTasks = [...tasks, taskObject];
          
          const updatedUserObject = {
            ...userData,
            tasks: updatedTasks
          };
          
          await updateDoc(userDoc, updatedUserObject);
          setUserData(updatedUserObject);
          
          setIsSuccessful(true);
        }
        
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
      <div className="add-task">
        <form onSubmit={handleCreateTask} className='add-task__form'>
          <h2 className='add-task__title'>
            Let’s create some tasks
          </h2>
          <div className='add-task__title-container add-task__input-container'>
            <input
                className={cn('add-task__title-input add-task__input', errors.title && 'validate')}
                placeholder=''
                type="text"
                name='title'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <label className='add-task__title-label add-task__label' htmlFor="title">Title</label>
            <div className='add-task__validate-error'>{errors.title}</div>
          </div>
          <div className='add-task__description-container add-task__input-container'>
            <textarea
                className={cn('add-task__description-input add-task__textarea', errors.description && 'validate')}
                placeholder=''
                name='description'
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label className='add-task__description-label add-task__label' htmlFor="description">Description</label>
            <div className='add-task__validate-error'>{errors.description}</div>
          </div>
          {isSuccessful && <span className='add-task__successful'>Task Created</span>}
          {!isLoading ? (
              <Button
                  text='Add'
                  handler={handleCreateTask}
              />
          ) : (
              <Loader />
          )}
        </form>
      </div>
  );
};

export default Index;