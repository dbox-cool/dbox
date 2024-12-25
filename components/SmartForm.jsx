import { FormProvider } from "react-hook-form"
import { Loading } from "@/dbox/components/ui/Loading"
import { isValidElement, useMemo } from "react"
import { Inputfield } from "@/dbox/components/inputs/Inputfield"
import { normalize } from "@/dbox/utils/string"

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
 * @param {Object<string, import("react").ReactNode>} [props.customInputMap]
 * @param {import("react-hook-form").UseFormReturn<object>} props.methods
 * @param {import("react-hook-form").SubmitHandler<any>} props.onSubmit
 * @param {import("react-hook-form").SubmitErrorHandler<any>} props.onError
 * @param {string|undefined} props.loadingPrompt
 * @param {"vertical"|"horizontal"} [props.direction]
*/
export const SmartForm = ({customInputMap, children, methods, onSubmit, onError, loadingPrompt, direction="vertical", ...props}) => {

  /** @type {FormfieldSpecType[]} */
  const formSpec = useMemo(()=>!isValidElement(children)?children.filter(f=>f):undefined, [children]);

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
                      const {type, id, label, options, direction: dirF, ...fieldProps} = field;
                      return <Inputfield 
                        key={idx} 
                        id={!id?normalize(field.label):id}
                        options={options??[]}
                        direction={dirF??direction}
                        type={type}
                        customInputMap={customInputMap}
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

