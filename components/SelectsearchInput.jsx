import { useState, useEffect, useRef, useMemo } from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoIosCheckmark } from "react-icons/io";
import { normalize } from "@/dbox/utils/string";
import { RiArrowGoBackFill } from "react-icons/ri";
import Button from "@/dbox/components/Button";
import { FilterList } from "@/dbox/components/FilterList";

/**
 * @typedef {object} SelectSearchProps
 * @property {string[]|{value:string, label:string}[]} options array of options to be displayed in the dropdown menu
 * @property {string} selectedOption current selected option (should be a state)
 * @property {(newSelectedOption: string)=>void} setSelectedOption setter of the `selectedOption` state
 * @property {string} [placeholder] what will be displayed while there's no current selection
 * @property {'up' | 'down'} [direction] direction of the dropdown menu
 * @property {boolean} canAddNewOption
 * @property {number} searchbarTreshold
 */

/**
 * @param {SelectSearchProps} props
 * @returns {import("react").ReactNode}
 */
const SelectsearchInput = ({
  options,
  selectedOption,
  setSelectedOption,
  placeholder,
  direction = "down",
  onChange,
  canAddNewOption = false,
  searchbarTreshold=5
}) => {
  // handle open/close
  const [open, setOpen] = useState(false);
  
  // current option list
  const [optList, setOptList] = useState(options);

  // handle search
  const searchbarRef = useRef(null);  
  
  // handle new option
  const [inputNewOpt, setInputNewOpt] = useState(false);
  /** @type {import("react").Ref<HTMLInputElement>} */
  const newOptRef = useRef(null);
  
  const displayValue = useMemo( 
    () => {
      if(!options || !options.length)
        return "No hay opciones...";

      if(!selectedOption)
        return placeholder || "Selecciona una opción...";

      if(typeof options[0] == "string")
        return typeof selectedOption == "string"? selectedOption:selectedOption.value;
      else
        return options.find( opt => opt.value == selectedOption )?.label
    },
    [selectedOption, options]
  );

  // simulate onChange
  useEffect(() => {
    if (onChange) onChange();
  }, [selectedOption]);
  
  // close if no options
  useEffect(() => {
    if (
      (Array.isArray(options) && options.length === 0) ||
      Object.keys(options).length === 0
    ) {
      setOpen(false);
    }
  }, [options]);  
  
  // close if click outside
  const selectRef = useRef(null); // Ref for the select component
  useEffect(() => {
    // Close select on outside click
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      
      {/* NEW OPTION INPUT */}
      <div className={`input text-text flex-1 items-center justify-between rounded-[4px] text-sm leading-none outline-none border-background border-2 w-full h-full p-0 m-0 ${(canAddNewOption && inputNewOpt)? "inline-flex":"hidden"}`}>
        <input 
          type="text"
          ref={newOptRef}
          className=" rounded-r-none h-full border-r-0 w-full px-2"
          onChange={ e => setSelectedOption( e.target.value ) }
        />
        <Button
          type="button"
          onClick={ e => { 
            e.preventDefault(); 
            newOptRef.current.value = "";
            setSelectedOption("");
            setInputNewOpt(false);
          } }
          className="w-fit px-2 h-[35px] rounded-l-none border-background border-2 border-l-0"
        >
          <RiArrowGoBackFill/>
        </Button>
      </div>
      
      <div className={`input text-text inline-flex h-full w-full flex-1 items-center justify-between rounded-[4px] text-sm leading-none outline-none border-background border-2 relative ${(canAddNewOption && inputNewOpt)? "hidden":"inline-flex"}`} ref={selectRef}>
        <div
          onClick={() => {
            if (
              (Array.isArray(options) && options.length > 0) ||
              Object.keys(options).length > 0
            ) {
              setOpen(!open);
              searchbarRef.current?.focus();
            }
          }}
          className={`flex justify-between items-center w-full h-full ${((Array.isArray(options) && options.length > 0) || Object.keys(options).length > 0) && "hover:cursor-pointer"}`}
        >
          <p
            className={`text-text text-sm line-clamp-1
                  ${
                    !selectedOption || // Condition for no selected option
                    (typeof selectedOption === "object" &&
                      Object.keys(selectedOption).length === 0) ||
                    (typeof selectedOption === "string" &&
                      selectedOption.length === 0)
                      ? "text-text/30"
                      : ""
                  }`}
          >
            {displayValue}
          </p>
          <BiChevronDown
            className={`${!open && "-rotate-90"} ${
              open && direction === "up" && "rotate-180"
            } size-6 text-primary`}
          />
        </div>
        <ul
          className={`bg-foreground overflow-y-auto absolute z-10 w-full text-sm rounded-[4px] customshadow right-0 ${
            open ? "max-h-40 p-2" : "max-h-0"
          } ${direction === "up" ? "bottom-14" : "top-10"}`}
        >
          {(options.length > searchbarTreshold) &&
            <div className="w-full sticky -top-2 pt-2 z-20 bg-foreground">
              <FilterList
                list={options}
                setList={setOptList}
                ref={searchbarRef}
                filterList={
                  (oldList, filterValue) => 
                    oldList
                      .filter( 
                        item => 
                          typeof item == "string"?
                            normalize(item).includes(filterValue)
                          :
                            normalize(item.label).includes(filterValue)
                      )
                }
              />
            </div>
          }
          {
            canAddNewOption &&
            <li
              key={"otherSelect"}
              className={`relative flex items-center h-fit px-2 pl-8 py-1 rounded-sm text-sm text-text hover:bg-primary/10 focus:outline-none focus:bg-primary/10 cursor-pointer`}
              onClick={() => {
                setInputNewOpt(true);
              }}
            >
              <p className="line-clamp-1">Nueva Opción...</p>
            </li>
          }
          {
            optList.map(
              (option, index) => {
                const value = typeof option == "string"? option:option?.value;
                const selected = normalize(selectedOption) == normalize(value);
                return (
                  <li
                    key={index}
                    className={`relative flex items-center h-fit px-2 pl-8 py-1 rounded-sm text-sm text-text hover:bg-primary/10 focus:outline-none focus:bg-primary/10 cursor-pointer ${selected &&"bg-primary/10"}`}
                    onClick={() => {
                      if (!selected) {
                        setSelectedOption(value);
                        setOpen(false);
                        setOptList(options);
                      }
                    }}
                  >
                    {selected && <IoIosCheckmark className="text-primary absolute left-2 size-6" />}
                    <p className="line-clamp-1">{typeof option == "string"?option:option.label}</p>
                  </li>
                )
              }
            )
          }
        </ul>
      </div>
    </div>
  );
};

export default SelectsearchInput;