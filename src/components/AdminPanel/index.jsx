import React, {useEffect, useState} from 'react';
import './index.scss'
import {useAuth} from "../../context/auth.jsx";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import UsersList from "../UsersList/index.jsx";
import Loader from "../UI/Loader/index.jsx";
import {db} from "../../firabase/firebase.js";
import {useNavigate} from "react-router-dom";
import Button from "../UI/Button/index.jsx";
import Modal from "../UI/Modal/index.jsx";
import CreateUser from "../CreateUser/index.jsx";

const Index = () => {
  
  const { user } = useAuth()
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  
  if(user.role !== 'admin') {
    navigate('/')
  }
  
  useEffect(() => {
    const getUsers = async () => {
      
      setIsLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        
        setUsers(usersList);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUsers();
  }, []);
  
  return (
      <div className='admin'>
        <div className='admin__top'>
          <h1 className='admin__title'>Hello <span>{user.firstName}</span></h1>
          <CreateUser
              setUsers={setUsers}
          />
        </div>
        {isLoading ? <Loader/>
            : (<UsersList
                users={users}
              setUsers={setUsers}
          />)}
      </div>
  );
};

export default Index;