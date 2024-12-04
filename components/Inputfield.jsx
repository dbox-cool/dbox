import { cn } from "@/dbox/utils/cn"
import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form"
import {SelectsearchInput} from "./SelectsearchInput";
import { PrefixInput } from "./PrefixInput";
import { PasswordInput } from "./PasswordInput";
import { forwardRef } from "react";
import { RadioInput } from "./RadioInput";
import { Multiselect } from "./Multiselect";
import { AddressInput } from "./AddressInput";
import { SelectsearchFirestoreInput } from "./SelectsearchFirestoreInput";

/**
 * @typedef {object} InputfieldProps
 * @property {import("react-hook-form").RegisterOptions<import("react-hook-form").FieldValues, any>} registerOptions
 * @property {"horizontal"|"vertical"} direction
 * @property {Element} button
 * @property {React.HTMLInputTypeAttribute|"multiselect"|"select"|"textarea"|"ci"|"phone"|"radio"} type
 * @property {string[]|{value: string, label: string}[]|string|undefined} options
 * @property {string} [labelClassName]
 * @property {boolean?} canAddNewOption
 */

/** @type {React.FC<InputfieldProps | import("react").InputHTMLAttributes>}  */
export const Inputfield = forwardRef( function InputFieldComponent ({options, canAddNewOption, registerOptions, direction="vertical", renderError=true, children, id, button, className, onChange, type, labelClassName, ...props}, ref) {
      
  const inputClassName = cn("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2", button?"rounded-l-none":"");
    
  const {
    register,
    watch,
    setValue,
    formState:{errors, defaultValues}
  } = useFormContext();
  
  const currentValue = (type=="multiselect" || type=="select" || type=="ci" || type=="phone" || type=="radio")?watch(id):undefined;
  
  useEffect( () => {if(onChange)onChange({target:{value:currentValue}})}, [currentValue] );
  
  const inputElement = useMemo( () => {
    
    switch (type) {
      case "textarea":
        return  <textarea
          className={inputClassName}
          id={id}
          ref={ref}
          {...register(id, registerOptions)}
          {...props}
        />
      case "password":
        return <PasswordInput
          register={register(id)}
          id={id}
          ref={ref}
          {...props}
        />
      case "ci": 
        return <PrefixInput
          defaultPrefix="V"
          prefixes={["V", "E", "J", "G"]}
          value={currentValue??""}
          setValue={value=>setValue(id, value)}
          id={id}
          ref={ref}
          {...props}
        />
      case "phone": 
        return <PrefixInput
          defaultPrefix="424"
          prefixes={["424", "414", "412", "212", "416", "426"]}
          value={currentValue??""}
          setValue={value=>setValue(id, value)}
          id={id}
          ref={ref}
          {...props}
        />
      case "select":
        return <SelectsearchInput
          canAddNewOption={canAddNewOption}
          options={options??[]}
          id={id}
          selectedOption={currentValue}
          setSelectedOption={value=>setValue(id, value)}
          ref={ref}
          {...register(id, registerOptions)}
          {...props}
        />
      case "radio":
        return <RadioInput
          options={options??[]}
          id={id}
          value={currentValue}
          setValue={value=>setValue(id, value)}
          {...props}
        />
      case "multiselect":
        return <Multiselect
          id={id}
          options={options}
          value={currentValue}
          setValue={value=>setValue(id, value)}
          {...props}
        />
      case "addressvzla":
        return <AddressInput id={id} {...props}/>
      case "selectdocs":
        return <SelectsearchFirestoreInput
          canAddNewOption={canAddNewOption}
          id={id}
          ref={ref}
          docPath={options}
          {...props}
        />
      default:
        return <input
          className={type == "checkbox"? "size-4":inputClassName}
          id={id}
          type={type}
          ref={ref}
          {...register(id, registerOptions)}
          {...props}
        /> 
    }
  }, [type, id, defaultValues[id], options, currentValue]);
  
  return (
    <div className={cn("w-full", className)}>
      <fieldset className={cn("flex gap-3", direction=="vertical"?"flex-col items-center":"flex-row items-start")}>
        {
          children &&
          <label className={cn("text-text text-sm h-[35px] flex", direction=="vertical"?"items-end w-full justify-start":"items-center w-1/4 justify-end", labelClassName)} htmlFor={id}>
            {children}
          </label>
        }
        <div className={cn("flex grow", direction=="vertical"?"w-full":"")}>
          {button}
          {inputElement}
        </div>
      </fieldset>
      {
        renderError &&
        <p className="errormsg msgbottom text-right">{errors[id]?.message}</p>
      }
    </div>
  )
}); 
