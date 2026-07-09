import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

const Wrapper = ({ children }) => {
  useEffect(() => {
    const src = 'https://www.google.com/recaptcha/api.js';
    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
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