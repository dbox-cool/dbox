
import { useEffect } from "react";

/**
 * @template T 
 * @param {object} props
 * @param {string} key
 * @param {T|undefined} defaultValue 
 * @returns {[value: T, setValue: (value:T|(prev:T)=>T)=>void, removeItem: ()=>void]}
 */
export const useStateLocalStorage = ({key, defaultValue}) => {


  const setValue = (newValue) => {
    const val = typeof newValue == "function"? newValue(value):newValue;
    try {
      if(val!==undefined)
        window.localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
      console.error(`Error while saving in local storage:\nkey ${key} value ${val}`, error);
    }
  };

  const getValue = () => {
    try {
      const val = window.localStorage.getItem(key);
      return val? JSON.parse(val):undefined;
    } catch (error) {
      console.error(`Error while getting '${key}' in local storage`, error);
    }
  }

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error while removing '${key}' from local storage`, error);
    }
  }

  const value = getValue();
  useEffect( () => setValue(defaultValue), [defaultValue]);

  return [value, setValue, removeItem];
}
