import { cn } from "@/dbox/utils/cn";
import { useEffect, useState, forwardRef, useMemo } from "react";

/**
 * @typedef {object} PrefixInputProps
 * @property {string} id 
 * @property {string} value 
 * @property {(newValue: string)=>void} setValue 
 * @property {string[]} prefixes
 * @property {string} defaultPrefix
 * @property {boolean} disabled
 */

/** @type {React.FC<PrefixInputProps | import("react").InputHTMLAttributes>}  */
export const PrefixInput = forwardRef( function PrefixInputComponent({id, value, setValue, className, disabled, prefixes=["V", "E"], defaultPrefix, ...props}, ) {
  
  const prefixSize = useMemo( () => prefixes[0].length, [prefixes]);
  const [prefix, setPrefix] = useState(value?value.slice(0, prefixSize):defaultPrefix??prefixes[0]);
  const [number, setNumber] = useState(value?value.slice(prefixSize):"");

  useEffect( () => {
    if(number.length > 0){
      setValue( `${prefix}${number}` );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, number] );

  useEffect( ()=>{
    if(value == undefined)
      return;
    
    if(value && typeof value == "string"){
      setPrefix(value.slice(0, prefixSize));
      setNumber(value.slice(prefixSize));
    }else{
      setNumber("");
      setPrefix(defaultPrefix??prefixes[0]??"");
    }
  }, [value]);

  return (
    <div className={cn("flex items-center w-full", className)} {...props}>
      <select
        className="input py-0 text-sm w-fit rounded-none rounded-l-[4px] border-r-0 border-background border-2 h-[35px]"
        onChange={e => setPrefix(e.target.value)}
        value={prefix}
        disabled={disabled}
      >
        {prefixes.map( p => <option key={p} className="font-sans">{p}</option> )}
      </select>
      <input
        disabled={disabled}
        value={number}
        onChange={e => setNumber(e.target.value)}
        id={id}
        name={id}
        className="input text-sm rounded-none rounded-r-[4px] border-background border-2 h-[35px]"
        placeholder="1234567"
      />
    </div>
  )
});
