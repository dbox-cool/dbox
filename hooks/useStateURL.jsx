/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom"

/**
 * 
 * @param {object} props
 * @param {string} key
 * @param {string} defaultValue 
 * @returns {[value: string, setValue: (value:string|(prev:string)=>string)=>void]}
 */
export const useStateURL = ({key, defaultValue}) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);

  const setValue = useCallback((newValue) => {
    const val = typeof newValue == "function"? newValue(value):newValue;
    setSearchParams( params => { 
      if(val!==undefined)
        params.set(key, val); 
      else if(params.get(key))
        params.delete(key);
      return params;
    })
  }, []);

  useEffect( () => 
    setSearchParams( params => {
      if(defaultValue)
        params.set(key, defaultValue);
      return params;
    })
  , [defaultValue]);

  return [value, setValue];
}
