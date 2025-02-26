import React from 'react';
import './index.scss'

const Index = ({ text, handler, disabled }) => {
  return (
      <>
        <input
            className={`submit-button ${disabled ? 'disabled' : ''}`}
            type="submit"
            value={text}
            onClick={(e) => !disabled && handler(e)}
            disabled={disabled}
        />
      </>
  );
};

export default Index;