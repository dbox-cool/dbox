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
import { normalize } from "../utils/string";
import { cva } from "class-variance-authority";

const inputfieldVariants = cva("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2",
  {variants: {
    variant: {
      default: "",
      button: "rounded-l-none"
    }
  }}
);

const labelVariants = cva("text-text h-[35px] flex ",
  {variants: {
    type: {
      default: "text-sm",
      diagnosis: "text-md",
      section: "text-lg font-medium"
    },
    direction: {
      vertical: "items-end w-full justify-start",
      horizontal: "items-center w-1/4 justify-end",
    }
  }}
);

const fieldsetVariants = cva("flex h-full",
  {variants: {
    direction: {
      vertical: "flex-col items-center",
      horizontal: "flex-row items-start"
    },
    type: {
      default: "gap-3",
      section: ""
    }
  }}
);

/**
 * @typedef {object} InputfieldProps
 * @property {import("react-hook-form").RegisterOptions<import("react-hook-form").FieldValues, any>} registerOptions
 * @property {"horizontal"|"vertical"} direction
 * @property {Element} button
 * @property {React.HTMLInputTypeAttribute|"multiselect"|"select"|"textarea"|"ci"|"phone"|"radio"} type
 * @property {string[]|{value: string, label: string}[]|string|undefined} options
 * @property {string} [labelClassName]
 * @property {boolean?} canAddNewOption
 * @property {(key: string):import("react").ReactNode} [props.customInputMap]
 */

/** @type {React.FC<InputfieldProps | import("react").InputHTMLAttributes>}  */
export const Inputfield = forwardRef( function InputFieldComponent ({options, canAddNewOption, registerOptions, direction="vertical", renderError=true, children, id, button, className, onChange, type, labelClassName, customInputMap, ...props}, ref) {
      
  const inputCurrentVariant = inputfieldVariants({variant: button?"button":"default"});
  const labelCurrentVariant = labelVariants({type, direction});
  const fieldsetCurrentVariant = fieldsetVariants({direction, type});

  const {
    register,
    watch,
    setValue,
    formState:{errors, defaultValues}
  } = useFormContext();
  
  const currentValue = (type=="multiselect" || type=="select" || type=="ci" || type=="phone" || type=="radio")?watch(id):undefined;
  
  useEffect( () => {if(onChange)onChange({target:{value:currentValue}})}, [currentValue] );
  
  const inputElement = useMemo( () => {

    if(customInputMap && customInputMap[type])
      return customInputMap[type]({id: id});
    
    switch (type) {
      case "textarea":
        return  <textarea
          className={cn(inputCurrentVariant,"resize-none h-auto")}
          id={id}
          ref={ref}
          rows="5"
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
        if(type?.includes("group")){
          const children_type = type.split("-")[0];
          return <div id={id} className="grid w-full md:grid-cols-3 gap-3 grid-cols-2" >
            {options.map( 
              (child, i) => <input
                className={type == "checkbox"? "size-4":inputCurrentVariant}
                key={`${i}${child}`} 
                type={children_type}
                placeholder={child}
                {...register(`${id}.${child}`)}
              /> 
            )}
          </div>
        }else if(type == "section"){
          // console.log("section", children, type, options)
          return <div className="w-full h-full flex flex-col px-4 border-[1px] border-primary/20 rounded-md">
           {options.map( (f, i) => {
                
              const {id: child_id, label: child_label, ...child_props} = f

              return <InputFieldComponent
                key={`section${id}${i}`}
                id={`${id}.${child_id??normalize(child_label)}`}
                customInputMap={customInputMap}
                // placeholder={`${id}.${child_id??normalize(child_label)}`}
                {...child_props}
              >
                {f?.label}
              </InputFieldComponent>

            })}
          </div>
        }

        return <input
          className={type == "checkbox"? "size-4":inputCurrentVariant}
          id={id}
          type={type}
          ref={ref}
          {...register(id, registerOptions)}
          {...props}
        /> 
    }
  }, [type, id, defaultValues[id], options, currentValue]);
  
  return (
    <div className={cn(" w-full h-full", className)}>
      <fieldset className={cn(fieldsetCurrentVariant)}>
        {
          children &&
          <label className={cn(labelCurrentVariant, labelClassName)} htmlFor={id}>
            {children}
          </label>
        }
        <div className={cn("flex grow h-full", direction=="vertical"?"w-full":"")}>
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
