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
import { Input } from "./Input";
import { inputfieldVariants } from "./InputfieldVariants";

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
export const Inputfield = forwardRef( function InputFieldComponent ({options, readOnly, canAddNewOption, registerOptions, direction="vertical", renderError=true, children, id, button, className, onChange, type, labelClassName, customInputMap, labelSize="default", raw=false, ...props}, ref) {
      
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
        readOnly: readOnly,
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
            readOnly={readOnly}
            {...register(id, registerOptions)}
            {...props}
          />
        else
          return <div className="w-full">
            <textarea
              className={cn(inputCurrentVariant,"resize-none h-auto")}
              id={id}
              ref={ref}
              readOnly={readOnly}
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
          readOnly={readOnly}
          ref={ref}
          {...props}
        />
      case "ci": 
        return <PrefixInput
          defaultPrefix="V"
          prefixes={["V", "E", "J", "G"]}
          value={currentValue??""}
          readOnly={readOnly}
          setValue={value=>setValue(id, value)}
          id={id}
          ref={ref}
          {...props}
        />
      case "phone": 
        return <PrefixInput
          defaultPrefix="424"
          prefixes={["424", "414", "412", "212", "416", "426"]}
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
          value={currentValue}
          setValue={value=>setValue(id, value)}
          {...props}
        />
      case "multiselect":
        return <Multiselect
          id={id}
          options={options}
          readOnly={readOnly}
          value={currentValue}
          setValue={value=>setValue(id, value)}
          {...props}
        />
      case "addressvzla":
        return <AddressInput readOnly={readOnly} id={id} {...props}/>
      case "selectdocs":
        return <SelectsearchFirestoreInput
          canAddNewOption={canAddNewOption}
          readOnly={readOnly}
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
              "h-full px-4 w-full border-primary/20 border-[1px] rounded-md gap-x-4 justify-start",
              (options.length<6)?
                "grid grid-cols-2"
                :
                "grid grid-cols-3"
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
                  child_id = child?.id?.length? child.id : normalize(child.label) ;
                }

                return <InputFieldComponent
                  // raw={true}
                  labelSize="fit"
                  className={(children_type=="number"||children_type=="text"||children_type=="checkbox")?"w-fit":"w-full"}
                  customInputMap={customInputMap}
                  key={`${i}${child_id}`} 
                  type={children_type}
                  placeholder={child_label}
                  id={`${id}.${child_id}`}
                  direction="horizontal"
                  readOnly={readOnly}
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
                readOnly={readOnly}
                customInputMap={customInputMap}
                // placeholder={`${id}.${child_id??normalize(child_label)}`}
                {...child_props}
              >
                {f?.label}
              </InputFieldComponent>

            })}
          </div>
        }

        if(readOnly)
          return (
            <div className="w-full h-full">
              {
                currentValue&&currentValue?.trim()?.length?
                  currentValue
                  :
                  "No Especificado"
              }
            </div>
          );

        return <Input
          id={id}
          type={type}
          ref={ref}
          {...register(id, registerOptions)}
          {...props}
        /> 
    }
  }, [type, id, defaultValues?defaultValues[id]:false, options, currentValue, readOnly]);

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
        <div className={cn("flex grow", direction=="vertical"?"h-fit items-start w-full":"h-full items-center grow")}>
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
