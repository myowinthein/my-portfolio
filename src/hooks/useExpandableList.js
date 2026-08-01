import { useState } from 'react';

const useExpandableList = (items, initialCount) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, initialCount);
  const toggle = () => setShowAll(prev => !prev);
  return { visible, showAll, toggle };
};

export default useExpandableList;
