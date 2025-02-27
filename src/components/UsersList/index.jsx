import React, {useState} from 'react';
import './index.scss'
import User from "../User/index.jsx";

const Index = ({ users, setUsers }) => {
  
  const [visibleUsers, setVisibleUsers] = useState(5);
  
  const showMore = () => {
    setVisibleUsers((prev) => prev + 5);
  };
  
  return (
      <div className='users-list-wrapper'>
        <div className="user-list">
          <div className="user-list__top">
            <span>Image</span>
            <span>Email</span>
            <span>FirstName</span>
            <span>lastName</span>
            <span>Age</span>
            <span>Role</span>
            <span>Tasks</span>
          </div>
          <ul className="user-list__bottom">
            {users.slice(0, visibleUsers).map((user) => (
                <User
                    key={user.id}
                    user={user}
                    setUsers={setUsers}
                />
            ))}
          </ul>
          {visibleUsers < users.length && <span onClick={showMore} className="user-list__load-more">Load More</span>}
        </div>
      </div>
  );
};

export default Index;