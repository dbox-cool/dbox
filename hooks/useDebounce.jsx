import { useEffect, useState } from "react";

/**
* Does not update the state of the `debouncedValue` until certain time (`delay`) passes without an update to `value`
 * @template T
 * @param {T} value 
 * @param {number} [delay] 
 * @returns {T}
 */
export const useDebounce = (value, delay = 750) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect( () => {

    const timeout = setTimeout( () => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);

  }, [value, delay])

  /** @type {T} */
  return debouncedValue;
}
