import React, {useEffect, useState} from 'react';
import cn from "classnames";
import Button from "../UI/Button/index.jsx";
import Loader from "../UI/Loader/index.jsx";
import './index.scss'
import {db, doc, updateDoc} from "../../firabase/firebase.js";
import {useAuth} from "../../context/auth.jsx";
import {getDoc} from "firebase/firestore";
import InputField from "../UI/InputField/index.jsx";
import {validateTask} from "../../utils/validation.js";

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
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    setIsSuccessful(false)
    setIsLoading(true)
    
    const { isValid, formErrors } = validateTask(title, description)
    
    setErrors(formErrors)
    
    if(isValid) {
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
          setTitle('');
          setDescription('');
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
          <InputField
              type='text'
              name='title'
              id='title'
              value={title}
              handleState={setTitle}
              labelTitle='Title'
              error={errors.title}
          />
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