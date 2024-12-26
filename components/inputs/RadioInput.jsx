import * as RadioGroup from "@radix-ui/react-radio-group";
import { forwardRef } from "react";

/**
 * @typedef {object} RadioInputProps
 * @property {string} id
 * @property {string[]|{label: string, value: string}[]} options
 * @property {string} value
 * @property {(value: string)=>void} setValue
 */

/** @type {React.FC<RadioInputProps | import("react").InputHTMLAttributes>}  */
export const RadioInput = forwardRef(function RadioInputComponent ({id, options, setValue, value, readOnly, ...props}, ref) {

  const displayValue = typeof options[0] == "string"? value : options.find((item) => item.value==value )?.label

  if(readOnly)
    return (
      <div className="w-full h-full">
        {displayValue??"No Especificado"}
      </div>
    );

  return (
    <RadioGroup.Root
      ref={ref}
      id={id}
      className="flex gap-8 w-full"
      name={id}
      value={value}
      onValueChange={(value) => setValue(value)}
      {...props}
    >
      {
        options.map( (opt) => {
          const label = typeof opt == "string"? opt : opt.label;
          const value = typeof opt == "string"? opt : opt.value;

          return (
            <div className="flex items-center" key={value}>
              <RadioGroup.Item
                className="bg-background size-5 rounded-full outline-none cursor-pointer"
                value={value}
                id={value}
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-primary" />
              </RadioGroup.Item>
              <label
                className="text-text text-sm leading-none pl-2 cursor-pointer"
                htmlFor={value}
              >
                {label}
              </label>
            </div>
          );
        })
      }
    </RadioGroup.Root>
  )
})
