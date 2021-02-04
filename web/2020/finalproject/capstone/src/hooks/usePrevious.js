import { useRef, useEffect } from 'react';

/**
 * A custom hook to keep track of previous values before change
 * @param {*} value the value to keep reference on.
 * @example const prevCount = usePrevious(countState)
 */
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;