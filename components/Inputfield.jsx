import { cn } from "@/dbox/utils/cn"
import { useMemo } from "react";
import { useFormContext } from "react-hook-form"
import SelectsearchInput from "./SelectsearchInput";

/**
 * 
 * @param {import("react").InputHTMLAttributes | object} props
 * @param {import("react-hook-form").RegisterOptions<import("react-hook-form").FieldValues, any>} props.registerOptions
 * @param {"up"|"down"} props.direction
 * @param {Element} props.button
 * @param {React.HTMLInputTypeAttribute|"select"|"textarea"} props.type
 * @param {string[]|{value: string, label: string}[]|undefined} props.options
 * @param {boolean?} props.canAddNewOption
 * @returns 
 */
export const Inputfield = ({options, canAddNewOption, registerOptions, direction="vertical", renderError=true, children, id, button, className, type, ...props}) => {
  
  const {
    register,
    watch,
    setValue,
    formState:{errors, defaultValues}
  } = useFormContext();

  const currentValue = type == "select"?watch(id):undefined;

  const inputClassName = cn("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2", button?"rounded-l-none":"");

  const inputElement = useMemo( () => {
    switch (type) {
      case "textarea":
        return  <textarea
          className={inputClassName}
          id={id}
          {...props}
          {...register(id, registerOptions)}
        />
      case "ci": return <></>
      case "select":
        return <SelectsearchInput
          canAddNewOption={canAddNewOption}
          options={options??[]}
          id={id}
          selectedOption={currentValue}
          setSelectedOption={value=>setValue(id, value)}
          {...props}
        />
      default:
        return <input
          className={inputClassName}
          id={id}
          type={type}
          {...props}
          {...register(id, registerOptions)}
        /> 
    }
  }, [type, id, defaultValues[id], currentValue]);

  return (
    <div className={cn("w-full", className)}>
      <fieldset className={cn("flex items-center gap-3", direction=="vertical"?"flex-col":"flex-row")}>
        {
          children &&
          <label className={cn("text-text text-sm", direction=="vertical"?"w-full text-left":"w-1/4 text-right")} htmlFor={id}>
            {children}
          </label>
        }
        <div className={cn("flex", direction=="vertical"?"w-full":"w-3/4")}>
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
}
