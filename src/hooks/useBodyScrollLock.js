import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = null;

const useBodyScrollLock = (active = true) => {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
    }
    lockCount += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = null;
      }
    };
  }, [active]);
};

export default useBodyScrollLock;
