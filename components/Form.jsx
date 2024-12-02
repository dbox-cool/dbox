import { FormProvider } from "react-hook-form"
import { Loading } from "./Loading"
import { isValidElement } from "react"
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
export const Form = ({children, methods, onSubmit, onError, loadingPrompt, direction="horizontal", ...props}) => {

  /** @type {FormfieldSpecType[]} */
  const formSpec = !isValidElement(children)?children:undefined;
  // console.log("form children",children)
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
                  if(field) ;
                    return isValidElement(field)?
                      field
                      :
                      <Inputfield 
                        key={idx} 
                        id={field?.id??normalize(field.label)}
                        type={field.type}
                        options={field.options??[]}
                        direction={direction}
                        disabled={field?.disabled}
                      >
                        {field.label}
                      </Inputfield>
                })}
              </>
        }
      </form>
    </FormProvider>
  )
}

