import React, {useState} from 'react';
import './index.scss'

const Index = ({ users }) => {
  
  const [visibleUsers, setVisibleUsers] = useState(5);
  
  const showMore = () => {
    setVisibleUsers((prev) => prev + 5);
  };
  
  return (
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
              <div key={user.id} className="user-list__item">
                <img src={user.image || "/user.svg"} alt="user-image" className="user-list__image" />
                <span>{user.email}</span>
                <span>{user.firstName}</span>
                <span>{user.lastName}</span>
                <span>{user.age}</span>
                <span>{user.role}</span>
                <span>{user.tasks.length}</span>
              </div>
          ))}
        </ul>
        {visibleUsers < users.length && <span onClick={showMore} className="user-list__load-more">Load More</span>}
      </div>
  );
};

export default Index;