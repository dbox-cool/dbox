import { forwardRef } from "react";
import { inputfieldVariants } from "./InputfieldVariants";

export const Input = forwardRef( 
  /**
   * @param {import("react").InputHTMLAttributes} props
   * @returns {import("react").ReactNode}
  */
  function InputComponent({type, button, ...props}, ref){
    const inputCurrentVariant = inputfieldVariants({variant: button?"button":"default", type});
    if(type == "file")
    return (
      <input 
        className={type == "checkbox"? "size-4":inputCurrentVariant}
        ref={ref}
        type={type}
        multiple
        {...props}
      /> 
    )
      else
    return (
      <input 
        className={type == "checkbox"? "size-4":inputCurrentVariant}
        ref={ref}
        type={type}
        step="0.01"
        {...props}
      /> 
    )
  }
)

