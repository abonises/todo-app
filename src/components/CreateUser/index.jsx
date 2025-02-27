import React, {useState} from 'react';
import './index.scss'
import Modal from "../UI/Modal/index.jsx";
import Button from "../UI/Button/index.jsx";
import InputField from "../UI/InputField/index.jsx";
import Loader from "../UI/Loader/index.jsx";
import {emailRegex} from "../../utils/validation.js";
import {validationErrors} from "../../constants/errors.js";
import {auth, createUserWithEmailAndPassword, db, doc, setDoc} from "../../firabase/firebase.js";
import {useNavigate} from "react-router-dom";

const Index = ({ setUsers }) => {
  
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' , role: '' });
  const [errorMessage, setErrorMessage] = useState('')
  
  const validate = (email, password, role) => {
    let isValid = true;
    
    const formErrors = { email: '', password: '', role: '' };
    
    if (!emailRegex.test(email) || email.length === 0) {
      formErrors.email = validationErrors.passwordError
      isValid = false
    }
    
    if (password.length < 0 && password.length === 0) {
      formErrors.password = validationErrors.emailError
      isValid = false
    }
    
    if (!role) {
      formErrors.role = validationErrors.roleError
      isValid = false
    }
    
    setErrors(formErrors)
    
    return isValid
  }
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    setIsLoading(true)
    
    if(validate(email, password, role)) {
      try {
        const adminUser = auth.currentUser;
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        const userId = user.uid
        
        const userObject = {
          id: userId,
          firstName: '',
          lastName: '',
          email: email,
          age: 18,
          tasks: [],
          loginsCount: 0,
          role: role,
          image: ''
        }
        
        await setDoc(doc(db, "users", userId), userObject);
        
        if (adminUser) {
          await auth.updateCurrentUser(adminUser);
        }
        
        setUsers((prev) => [...prev, userObject]);
        
        setEmail('');
        setPassword('');
        setRole('')
        setIsModalOpen(false)
        
      } catch (err) {
        console.log('unlucky')
        err.code === 'auth/email-already-in-use' ? setErrorMessage('User with this email already exists') : setErrorMessage('Server Error. Please try letter')
      } finally {
        setIsLoading(false)
        
      }
    } else {
      setIsLoading(false)
      navigate('/admin')
    }
  }
  
  return (
      <>
        <Button
            text='Add user'
            handler={() => setIsModalOpen(true)}
        />
        <Modal
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        >
          <h2 className='create-user__modal-title'>Create New User</h2>
          <form onSubmit={handleCreateUser} className='create-user__form'>
            <div className='create-user__error'>{errorMessage}</div>
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
                labelTitle='Password'
                error={errors.password}
            />
            <select name="role" id="role" className='create-user__role-select'
                    onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {!isLoading ? (
                <Button
                    text='Create User'
                    handler={handleCreateUser}
                />
            ) : (
                <Loader/>
            )}
          </form>
        </Modal>
      </>
  );
};

export default Index;