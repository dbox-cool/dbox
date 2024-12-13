import { useMemo, useRef } from "react";
import { cn } from "@/dbox/utils/cn"
import { FaX } from "react-icons/fa6";
import { normalize } from "@/dbox/utils/string";

export const Multiselect = ({id, value, setValue}) => {

  const inputClassName = cn("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2");

  /** @type {import("react").Ref<HTMLInputElement>} */
  const newOptRef = useRef(undefined);

  const addOption = () => {
    const newValue = newOptRef.current.value?.trim()??"";
    if( newValue.length ){

      if(Array.isArray(value) && value.length && typeof value[0] == "string")
        setValue([...value??[], newValue])
      else
        setValue([
          ...value??[],
          {label: newValue, value: normalize(newValue)}
        ])
    
      newOptRef.current.value = "";
    }
  }

  const valueList = useMemo(() =>{
    if(!value || !Array.isArray(value) || value.length==0)
      return [];
    if(typeof value[0] == "string")
      return value.map( str => { return {label: str, value: normalize(str)}; } );
    return value;
  } , [value, id])

  return (
    <div className="w-full" id={id}>
      <div className={cn(inputClassName, "w-full flex p-0")}>
        <input
          ref={newOptRef}
          className="grow focus:border-0 h-full rounded-l-[4px] pl-2"
          placeholder="Escribe una nueva opción..."
          onKeyDown={ e => {
            if(e.key == "Enter"){
              e.preventDefault();
              addOption();
            }
          }}
        />
        <button
          className="w-6 border-l-2 h-full px-4 text-center rounded-r-[4px] justify-center items-center flex hover:text-lg"
          type="button"
          onClick={()=>{addOption()}}
        >
          +
        </button>
      </div>
      <div className="flex flex-1 flex-wrap gap-2 justify-start mt-3">
        {valueList?.map( (opt, idx) =>
          <div
            key={idx}
            className="text-xs rounded-md border-black/20 border-[1px] px-2 py-1 hover:border-destructive hover:cursor-pointer group relative"
          > 
            <span className="group-hover:invisible">
              {opt.label}
            </span>
            <span 
              className="hidden group-hover:flex h-full -mt-1 absolute top-1 w-full text-center items-center justify-center -ml-2 text-destructive"
              onClick={()=>{setValue( [...value].filter( (_,f_idx)=>f_idx!=idx ) )}}
            >
              <FaX/>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

