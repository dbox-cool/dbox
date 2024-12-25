
import { useState, useMemo, useEffect } from "react"
import VzlaLocations from "@/dbox/utils/VzlaLocations";
import { useFormContext } from "react-hook-form";
import { Inputfield } from "@/dbox/components/inputs/Inputfield";
import { cn } from "@/dbox/utils/cn";

/**
 * @param {{
 *  id: string
 * }} prop 
 * @returns {React.Component}
 */
export const AddressInput = ({id, ...props}) => {

  const {watch, resetField, register, formState: {errors}} = useFormContext();
  const currState=watch(`${id}.state`);
  const currMun=watch(`${id}.mun`);
  const currParr=watch(`${id}.parr`);
  const street=watch(`${id}.street`);
  const inputClassName = cn("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2");

  /** @type {string[]} */
  const stateOpts = useMemo(()=>Object.keys(VzlaLocations).sort(), []);
  
  /** @type {ReturnType<typeof useState<string[]>>} */
  const [munOpts, setMunOpts] = useState(
    currState?
      Object.keys(VzlaLocations[currState]).sort()
      :
      []
  );

  /** @type {ReturnType<typeof useState<string[]>>} */
  const [parrOpts, setParrOpts] = useState(
    currState && currMun && Object.keys(VzlaLocations[currState]).includes(currMun) ?
      VzlaLocations[currState][currMun]?.sort()??[]
      :
      []
  );

  useEffect( ()=>{
    // setMun(selectedState==currState?selectedMun:undefined);
    if(!currState){
      setMunOpts([]);
    }else{
      setMunOpts( Object.keys(VzlaLocations[currState]).sort() );
      // resetField(`${id}.mun`, {defaultValue: ""});
      resetField(`${id}.mun`)
    }
    setParrOpts([]);
  }, [currState]);

  useEffect( ()=> {
    // setParr(selectedMun==currMun?selectedParr:undefined);
    if(!currMun || !currState){
      setParrOpts([]);
    }else{
      resetField(`${id}.parr`)
      // resetField(`${id}.parr`, {defaultValue: ""});
      setParrOpts( VzlaLocations[currState][currMun]?.sort()??[] );
    }
  }, [currMun, currState]);

  const labelClassName="w-[5rem]";

  if(props.readOnly)
    return (
      <div className="w-full h-full">
        {`${currState??"Estado no especificado"}, ${currMun??"Municipio no especificado"}, ${currParr??"Parroquia no especificada"}`}
        {
          (street && street.length)?
          <><br/>{street}</>:""
        }
      </div>
    );
      
  
  return (<div className="flex flex-col w-full">
    <Inputfield
      id={`${id}.state`}
      options={stateOpts}
      type="select"
      direction="horizontal"
      labelClassName={labelClassName}
    >
      Estado
    </Inputfield>
    <Inputfield
      id={`${id}.mun`}
      options={munOpts}
      type="select"
      direction="horizontal"
      disabled={!currState}
      labelClassName={labelClassName}
    >
      Municipio
    </Inputfield>
    <Inputfield
      id={`${id}.parr`}
      options={parrOpts}
      type="select"
      direction="horizontal"
      disabled={!currMun}
      labelClassName={labelClassName}
    >
      Parroquia
    </Inputfield>
    <div className={cn("w-full")}>
      <fieldset className={cn("flex gap-3", "flex-row items-start")}>
        <label className={cn("text-text text-sm h-[35px] flex", "items-center w-1/4 justify-end", labelClassName)} htmlFor={`${id}.street`}>
          Dirección
        </label>
        <div className={cn("flex grow")}>
          <input
            className={inputClassName}
            id={`${id}.street`}
            {...register(`${id}.street`)}
          /> 
        </div>
      </fieldset>
      <p className="errormsg msgbottom text-right">{errors[`${id}.street`]?.message}</p>
    </div>
  </div>)
}
