import { cn } from "@/dbox/utils/cn";
import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState, forwardRef, useMemo } from "react";
import { Input } from "./Input";

/**
 * @typedef {object} FilesetInputProps
 * @property {string} id 
 * @property {string} value 
 * @property {(newValue: string)=>void} setValue 
 * @property {string[]} prefixes
 * @property {string} defaultPrefix
 * @property {boolean} disabled
 */

/** @type {React.FC<PrefixInputProps | import("react").InputHTMLAttributes>}  */
export const FilesetInput = forwardRef( function FilesetInputComponent({id, value, setValue, className, disabled, readOnly, ...props}, ref) {

  const [files2Upload, setFiles2Upload] = useState([])
  const [filesUploaded, setFilesUploaded] = useState([])
  
  /** @type {(e: Event)=>void} */
  const onFileSelect = e => {
    const newValue = [...e.target.files, ...files2Upload]
    setFiles2Upload( prev => newValue )
    e.target.value = null
  };

  useEffect(() => {
    if(value) setFilesUploaded([value])
  }, []);

  useEffect( () => {
    const newValue = [...filesUploaded, ...files2Upload]
    setValue(newValue);
    // console.log("new value", newValue)
  }, [files2Upload, filesUploaded] );

  const element = (
    <div className="space-y-4 w-full">
      <div className={cn("flex items-center w-full", className)} {...props}>
        <Input
          type="file"
          multiple
          disabled={disabled}
          id={id}
          name={id}
          onChange={e=>onFileSelect(e)}
        />
      </div>
      <div
        className="w-full flex flex-wrap gap-x-2"
      >
        {files2Upload.map((f, idx) => {
          return (
            <div 
              key={`2upload${idx}`}
              className="h-20 w-48 border-2 border-primary/30 flex flex-col rounded-lg"
            >
              <div className="w-full overflow-ellipsis h-2/3 overflow-x-clip align-middle px-2">
                {f.name}
              </div>
              <div className="flex justify-between items-center px-2 h-1/3">
                <span className="text-sm">Acciones:</span>
                <button
                  onClick={()=>{ window.open(URL.createObjectURL(f), '_blank'); }}
                  type="button"
                  className="size-6 flex justify-center align-middle"
                >
                  <Eye className="size-5 hover:size-6 text-primary"/>
                </button>
                <button
                  onClick={()=>{setFiles2Upload( prev => prev.filter( (_, i)=> i!=idx ) )}}
                  type="button"
                  className="size-6 flex justify-center align-middle"
                >
                  <Trash2 className="size-5 hover:size-6 text-destructive"/>
                </button>
              </div>
            </div>
          )
        })}

        {filesUploaded.map((f, idx) => {
          return (
            <div 
              key={`2upload${idx}`}
              className="h-20 w-48 border-2 border-primary/30 flex flex-col rounded-lg"
            >
              <div className="w-full overflow-ellipsis h-2/3 overflow-x-clip align-middle px-2">
                Archivos previos
              </div>
              <div className="flex justify-between items-center px-2 h-1/3">
                <span className="text-sm">Acciones:</span>
                <button
                  onClick={()=>{ window.open(f, '_blank'); }}
                  type="button"
                  className="size-6 flex justify-center align-middle"
                >
                  <Eye className="size-5 hover:size-6 text-primary"/>
                </button>
                <button
                  onClick={()=>{setFiles2Upload( prev => prev.filter( (_, i)=> i!=idx ) )}}
                  type="button"
                  className="size-6 flex justify-center align-middle"
                >
                  <Trash2 className="size-5 hover:size-6 text-destructive"/>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return element;
});
