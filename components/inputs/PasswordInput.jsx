import { cn } from '@/dbox/utils/cn';
import { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5'

export const PasswordInput = ({register={}, className, ...props}) => {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className="relative flex w-full">
      <input
        className={cn("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2", className)}
        type={showPwd ? "text" : "password"}
        id="pwd"
        name="pwd"
        placeholder="Mínimo 6 caracteres"
        required
        {...props}
        {...register}
      />
      {showPwd ? (
        <IoEyeOff
          onClick={() => setShowPwd(false)}
          className="size-6 text-secondary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer z-10"
        />
      ) : (
        <IoEye
          onClick={() => setShowPwd(true)}
          className="size-6 text-secondary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer z-10"
        />
      )}
    </div>
  )
}
