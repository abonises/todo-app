import React from 'react';
import './index.scss'

const Index = ({ text, handler }) => {
  return (
      <>
        <input
            className='submit-button'
            type="submit"
            value={text}
            onClick={(e) => handler(e)}
        />
      </>
  );
};

export default Index;