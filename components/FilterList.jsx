import {useEffect, useState } from "react";
import { cn } from "@/dbox/utils/cn";
import { AiOutlineSearch } from "react-icons/ai";
import { normalize } from "@/dbox/utils/string";
import { forwardRef } from "react";

/**
 * 
 * @param {object} props 
 * @param {any[]} list
 * @param {(newList: any[])=>void} setList
 * @param {(oldList: any[], filterValue: string)=>any[]} filterList
 * @returns 
 */
export const FilterList = forwardRef( function FilterListComponent({list, setList, filterList, className}, ref) {

  const [filter, setFilter] = useState("");
  useEffect( () => {
    setList(filter.trim().length?filterList(list, normalize(filter)):list);
  }, [filter] );

  return (
    <div className="flex gap-2 items-center px-2  bg-background rounded-[4px] ">
      <AiOutlineSearch className="text-primary size-6" />
      <input
        className={cn("placeholder:text-text/30 py-2 text-text bg-background h-full outline-none border-none focus:ring-0 w-full", className)}
        value={filter}
        onChange={ e => setFilter(e.target.value) }
        ref={ref}
      />
    </div>
  )
});
