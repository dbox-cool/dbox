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
import { normalize } from "@/dbox/utils/string";
import { cva } from "class-variance-authority";

const inputfieldVariants = cva("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2",
  {variants: {
    variant: {
      default: "",
      button: "rounded-l-none",
    },
    type: {
      file: "p-0 pr-3 italic text-black/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-black/70",
      checkbox: "hover:cursor-pointer"
    }
  }}
);

const labelVariants = cva("text-text h-[35px] flex text-sm",
  {variants: {
    type: {
      diagnosis: "text-md",
      section: "text-lg font-medium"
    },
    size: {
      default: "w-1/4",
      sm: "w-14",
      fit: "w-fit"
    },
    direction: {
      vertical: "items-end w-full justify-start",
      horizontal: "items-center justify-end",
    },
  }}
);

const fieldsetVariants = cva("flex h-full gap-3 w-full",
  {variants: {
    direction: {
      vertical: "flex-col items-center",
      horizontal: "flex-row items-center"
    },
    type: {
      section: "gap-0"
    }
  }}
);

/**
 * @typedef {object} InputfieldProps
 * @property {import("react-hook-form").RegisterOptions<import("react-hook-form").FieldValues, any>} registerOptions
 * @property {"horizontal"|"vertical"} direction
 * @property {"sm"|"fit"|"default"} labelSize
 * @property {Element} button
 * @property {React.HTMLInputTypeAttribute|"multiselect"|"select"|"textarea"|"ci"|"phone"|"radio"} type
 * @property {string[]|{value: string, label: string}[]|string|undefined} options
 * @property {string} [labelClassName]
 * @property {boolean?} canAddNewOption
 * @property {boolean} [raw]
 * @property {Object<string,import("react").ReactNode>} [props.customInputMap]
 */

/** @type {React.FC<InputfieldProps | import("react").InputHTMLAttributes>}  */
export const Inputfield = forwardRef( function InputFieldComponent ({options, canAddNewOption, registerOptions, direction="vertical", renderError=true, children, id, button, className, onChange, type, labelClassName, customInputMap, labelSize="default", raw=false, ...props}, ref) {
      
  const inputCurrentVariant = inputfieldVariants({variant: button?"button":"default", type});
  const labelCurrentVariant = labelVariants({type, direction, size: labelSize});
  const fieldsetCurrentVariant = fieldsetVariants({direction, type});

  const {
    register,
    watch,
    setValue,
    formState:{errors, defaultValues}
  } = useFormContext();
  
  const currentValue = watch(id);
  
  useEffect( () => {if(onChange)onChange({target:{value:currentValue}})}, [currentValue] );
  
  const inputElement = useMemo( () => {

    if(customInputMap && customInputMap[type])
      return customInputMap[type]({
        ...register(id, registerOptions),
        id: id,
        value: watch(id),
        setValue:value=>setValue(id, value),
        options:options??[],
        canAddNewOption: canAddNewOption,
        ...props
      });
    
    switch (type) {
      case "textarea":
        if(!options || !options.length)
          return  <textarea
            className={cn(inputCurrentVariant,"resize-none h-auto")}
            id={id}
            ref={ref}
            rows="5"
            {...register(id, registerOptions)}
            {...props}
          />
        else
          return <div className="w-full">
            <textarea
              className={cn(inputCurrentVariant,"resize-none h-auto")}
              id={id}
              ref={ref}
              rows="5"
              {...register(id, registerOptions)}
              {...props}
            />
            <h3 className="text-xs font-bold my-2">Sugerencias:</h3>
            <div className="flex flex-wrap space-x-2">
              {options.map( sug =>
                <span 
                  key={sug.value}
                  className="border-2 rounded-xl bg-foreground px-2 py-1 text-xs cursor-pointer border-background hover:border-primary"
                  onClick={()=>setValue(id, `${sug.label}\n${currentValue??""}`)}
                >
                  {sug.label}
                </span>
              )}
            </div>
          </div> 
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
          return <div 
            id={id} 
            className={cn(
              "px-4 w-full border-primary/20 border-[1px] rounded-md space-x-2",
              (children_type == "checkbox" && options.length>6)?
                "grid grid-cols-4 justify-between"
                :
                "flex flex-row flex-wrap justify-between pt-6"
            )} 
          >
            {options.map( 
              (child, i) => {
                let child_label, child_id;
                if(typeof child == "string"){
                  child_label = child;
                  child_id = normalize(child);
                }else{
                  child_label = child.label;
                  child_id = child.id;
                }

                return <InputFieldComponent
                  // raw={true}
                  // className={type == "checkbox"? "size-4":inputCurrentVariant}
                  labelSize="fit"
                  className={(children_type=="text"||children_type=="checkbox")?"w-fit":"w-full"}
                  customInputMap={customInputMap}
                  key={`${i}${child_id}`} 
                  type={children_type}
                  placeholder={child_label}
                  id={`${id}.${child_id}`}
                  direction="horizontal"
                >
                  {child_label}
                </InputFieldComponent>
              }
            )}
          </div>
        }else if(type == "section"){
          // console.log("section", children, type, options)
          return <div className="w-full h-full flex flex-col px-4 border-[1px] border-primary/20 rounded-md">
           {options.map( (f, i) => {
                
              const {id: child_id, label: child_label, ...child_props} = f

              return <InputFieldComponent
                key={`section${id}${i}`}
                id={`${id}.${!child_id?normalize(child_label):child_id}`}
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

  if(raw) return inputElement;
  
  return (
    <div className={cn(" w-full h-full", className)}>
      <fieldset className={cn(fieldsetCurrentVariant)}>
        {
          children &&
          <label className={cn(labelCurrentVariant, labelClassName)} htmlFor={id}>
            {children}
          </label>
        }
        <div className={cn("flex grow h-full items-center", direction=="vertical"?"w-full":"grow")}>
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
