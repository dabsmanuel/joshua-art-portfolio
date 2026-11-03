import { useEffect, useState } from 'react';

const countForWidth = (width: number) => (width >= 1024 ? 3 : width >= 640 ? 2 : 1);

// How many gallery columns fit the screen (1, 2 or 3, matching the Tailwind sm and lg breakpoints).
export const useColumnCount = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => setCount(countForWidth(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
};
