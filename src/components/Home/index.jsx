import React, {useEffect, useState} from 'react';
import './index.scss'
import AddTask from "../AddTask/index.jsx";
import TaskList from "../TaskList/index.jsx";
import {useAuth} from "../../context/auth.jsx";
import Statistic from "../Statistic/index.jsx";

const Index = () => {
  
  const { user } = useAuth();
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    
    const getTasks = async () => {
      try {
        if (user?.tasks) {
          setTasks(user.tasks);
        }
      } catch (err) {
        console.log(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    getTasks()
    
  }, [user]);
  
  return (
      <main className='home'>
        <div className='home__top'>
          <AddTask/>
          <Statistic
              tasks={tasks}
          />
        </div>
        <div className='home__bottom'>
          <TaskList
              tasks={tasks}
              isLoading={isLoading}
          />
        </div>
      </main>
  );
};

export default Index;