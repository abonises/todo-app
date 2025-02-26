import React from 'react';
import cn from "classnames";
import './index.scss'

const Index = ({type, name, id, value, handleState, labelTitle, error}) => {
  return (
      <div className='input-container'>
        <input
            className={cn('input-field', error && 'validate')}
            type={type}
            placeholder=''
            name={name}
            id={id}
            value={value}
            onChange={(e) => handleState(e.target.value)}
        />
        <label className='label-field' htmlFor={name}>{labelTitle}</label>
        <div className='validate-error'>{error}</div>
      </div>
  );
};

export default Index;