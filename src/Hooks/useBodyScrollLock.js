import { useEffect } from 'react';

const useBodyScrollLock = (active = true) => {
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [active]);
};

export default useBodyScrollLock;
