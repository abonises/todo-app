import React from 'react';
import './index.scss'

const Index = ({ isModalOpen, onClose, children }) => {
  
  if (!isModalOpen) return;
  
  return (
      <div
          className="modal"
          onClick={onClose}
      >
        <div
            className="modal__content"
            onClick={(e) => e.stopPropagation()}
        >
          <div onClick={onClose} className='modal__close'>
            CLOSE
          </div>
          {children}
        </div>
      </div>
  );
};

export default Index;