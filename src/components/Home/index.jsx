import React from 'react';
import './index.scss'
import AddTask from "../AddTask/index.jsx";

const Index = () => {
  
  return (
      <main className='home'>
        <div className="site-container">
          <div className='home__top'>
            <AddTask/>
          </div>
          <div className='home__bottom'>
          
          </div>
        </div>
      </main>
  );
};

export default Index;