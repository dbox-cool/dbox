import { FormProvider } from "react-hook-form"
import { Loading } from "./Loading"
import { isValidElement, useMemo } from "react"
import { Inputfield } from "./Inputfield"
import { normalize } from "../utils/string"

/** @typedef {object} FormfieldSpecType
 *  @property {string} [id]
 *  @property {string} label
 *  @property {React.HTMLInputTypeAttribute|"select"|"textarea"|"ci"|"phone"|"radio"} type
 *  @property {string[]|{value: string, label: string}[]} [options]
 *  @property {"vertical"|"horizontal"} [direction]
*/

/**
 * @param {object} props
 * @param {FormfieldSpecType[]|import("react").ReactNode} props.children
 * @param {import("react-hook-form").UseFormReturn<object>} props.methods
 * @param {import("react-hook-form").SubmitHandler<any>} props.onSubmit
 * @param {import("react-hook-form").SubmitErrorHandler<any>} props.onError
 * @param {string|undefined} props.loadingPrompt
 * @param {"vertical"|"horizontal"} [props.direction]
*/
export const SmartForm = ({children, methods, onSubmit, onError, loadingPrompt, direction="horizontal", ...props}) => {

  /** @type {FormfieldSpecType[]} */
  const formSpec = useMemo(()=>!isValidElement(children)?children.filter(f=>f):undefined, [children]);
  // console.log("form children",children,formSpec)
  // console.log("form spec", isValidElement(children), formSpec)

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)} 
        {...props}
      >
        {
          loadingPrompt?
            <div className="h-full">
              <Loading>
                {loadingPrompt}
              </Loading>
            </div>
            :
            isValidElement(children)?
              children
              :
              <>
                {formSpec.map( (field, idx) => {
                  if(field){
                    if(isValidElement(field))
                      return field;
                    else{
                      const {id, label, options, direction: dirF, ...fieldProps} = field;
                      return <Inputfield 
                        key={idx} 
                        id={id??normalize(field.label)}
                        options={options??[]}
                        direction={dirF??direction}
                        {...fieldProps}
                      >
                        {label}
                      </Inputfield>
                    }

                  }
                })}
              </>
        }
      </form>
    </FormProvider>
  )
}

