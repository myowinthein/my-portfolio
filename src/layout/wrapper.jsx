import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

const Wrapper = ({ children }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default Wrapper;