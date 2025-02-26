import React, {useState} from 'react';
import './index.scss'
import {deleteTask, editTask} from "../../utils/task-handlers.js";
import {useAuth} from "../../context/auth.jsx";
import Loader from "../UI/Loader/index.jsx";
import {validateTask} from "../../utils/validation.js";

const Index = ({ item }) => {
  
  const { user, setUserData } = useAuth()
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false)
  const handleDeleteTask = async (id, userId) => {
    const userObject = await deleteTask(id, userId)
    setUserData(userObject);
  }
  
  const handleEdit = () => {
    setIsEdit(true)
    setTitle(item.title);
    setDescription(item.description);
  }
  
  const handleCompleteEdit = async (taskId, userId) => {
    
    setIsLoading(true)
    
    const { isValid, formErrors } = validateTask(title, description)
    
    setErrors(formErrors)
    
    if(isValid) {
      try {
        const userObject = await editTask(taskId, userId, title, description)
        setUserData(userObject);
      } catch (err) {
        console.log(err.message)
      } finally {
        setIsEdit(false)
        setIsLoading(false)
      }
    }
  }
  
  
  return (
      <>
        {isLoading ? <Loader /> : (
            <div className='task'>
              <div className='task__info'>
                {!isEdit ? (
                    <>
                      <span className='task__title'>{item.title}</span>
                      <p className='task__description'>{item.description}</p>
                    </>
                ) : (
                    <>
                      <input className='task__input-field' type="text" name='title' id='title' value={title}
                             onChange={(e) => setTitle(e.target.value)}/>
                      <div className='task__validate-error'>{errors.title}</div>
                      <textarea className='task__textarea-field' name='description' id='description' value={description}
                                onChange={(e) => setDescription(e.target.value)}/>
                      <div className='task__validate-error'>{errors.description}</div>
                    </>
                )}
              </div>
              <div className="task__manage">
                {!isEdit ? (
                    <img
                        className='task__edit-icon'
                        src="/edit-icon.svg"
                        alt="edit-task-icon"
                        onClick={() => handleEdit()}
                    />
                ) : (
                    <img
                        className='task__complete-icon'
                        src="/complete.svg"
                        alt="complete-task-icon"
                        onClick={() => handleCompleteEdit(item.id, user.id)}
                    />
                )}
                <img
                    className='task__trash-icon'
                    src="/trash-icon.svg"
                    alt="trash-icon"
                    onClick={() => handleDeleteTask(item.id, user.id)}
                />
              </div>
            </div>
        )}
      </>
  );
};

export default Index;