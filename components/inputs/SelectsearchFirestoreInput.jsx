import { useFirestoreDoc }from "@/dbox/hooks/useFirestoreDoc"
import { forwardRef, useMemo } from "react"
import { capitalizeAll, normalize } from "@/dbox/utils/string";
import { SelectsearchInput } from "./SelectsearchInput";
import { useFormContext } from "react-hook-form";

/**
 * @typedef {object} SelectSearchFirestoreProps
 * @property {boolean} canAddNewOption
 * @property {boolean} disabled
 * @property {string} className
 * @property {string} docPath
 * @property {string} id
 */

/**
 * @param {SelectSearchFirestoreProps} props
 * @returns {import("react").ReactNode}
 */
export const SelectsearchFirestoreInput = forwardRef(function SelectsearchFirestoreInputComponent({className, docPath, canAddNewOption = false, id, ...props}, ref) {

  const {
    register,
    watch,
    setValue,
  } = useFormContext();

  const currentValue = watch(id);
    
  const path = useMemo( () => docPath.split("."), [docPath] );
  const {data} = useFirestoreDoc(path[0]);

  const displayOptions = useMemo( () => {

    if(!data)
      return undefined;
    
    let displayOpt;

    if(path.length == 1)
      displayOpt = Array.isArray(data)?
        data.map( opt => capitalizeAll(opt.toLowerCase()) )
        :
        Object.values(data).map( opt => capitalizeAll(opt.toLowerCase()) );

    else if(path.length == 2)
      displayOpt = Array.isArray(data[path[1]])?
        data[path[1]].map( opt => capitalizeAll(opt.toLowerCase()) )
        :
        Object.values(data[path[1]]).map( opt => capitalizeAll(opt.toLowerCase()) );
    else
     displayOpt = data[path[1]].map( opt => {
      /** @type {string || object} */
      let ans = opt;
      for (let i = 2; i < path.length; ++i)
        ans = ans[path[i]];
      return capitalizeAll(ans.toLowerCase());
    } );

    return displayOpt.map( opt => { return {label: opt, value: normalize(opt)} } );
    // return displayOpt;

  }, [path, data]);

  return (
    <SelectsearchInput
      selectedOption={currentValue}
      setSelectedOption={value=>setValue(id, value)}
      ref={ref}
      className={className}
      id={id}
      options={displayOptions??[]}
      type="select"
      canAddNewOption={canAddNewOption}
      {...register(id)}
      {...props}
    />
  )
})

