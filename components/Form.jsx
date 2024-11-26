import { FormProvider } from "react-hook-form"

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {import("react-hook-form").UseFormReturn<object>} props.methods
 * @param {import("react-hook-form").SubmitHandler<any>} props.onSubmit
 * @param {import("react-hook-form").SubmitErrorHandler<any>} props.onError
*/
export const Form = ({children, methods, onSubmit, onError, ...props}) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)} 
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  )
}

