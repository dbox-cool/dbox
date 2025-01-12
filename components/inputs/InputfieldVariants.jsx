import { cva } from "class-variance-authority";

export const inputfieldVariants = cva("input text-text inline-flex h-[35px] flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm leading-none outline-none border-background border-2",
  {variants: {
    variant: {
      default: "",
      button: "rounded-l-none",
    },
    type: {
      file: "p-0 pr-3 italic text-black/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-black/70",
      checkbox: "hover:cursor-pointer"
    }
  }}
);
