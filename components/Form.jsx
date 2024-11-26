import { FormProvider } from "react-hook-form"

/**
 * @param {object} props
 * @param {Element} children
 * @param {import("react-hook-form").UseFormReturn<object>} methods
 * @param {(data: object, e: Event?)=>Promise<void>} onSubmit
 * @param {(data: object, e: Event?)=>Promise<void>} onError
*/
export const Form = ({children, methods, onSubmit, onError}) => {
  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit, onError)} 
      >
        {children}
      </form>
    </FormProvider>
  )
}

