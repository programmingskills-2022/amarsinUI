import { useCallback, useRef, useEffect, useState } from "react";
import { DefaultOptionType, DefaultOptionTypeStringId } from "../../types/general";
import { debounce } from "lodash";
import AutoComplet from "./AutoComplet";
import { convertToFarsiDigits } from "../../utilities/general";

type FieldValues = {
  field: string;
  value: string | number;
};

type Props = {
  label: string;
  labelWidth?: string;
  setField: (field: string, value: string | number) => void;
  fieldValues: FieldValues[];
  fieldSearch: string;
  selectedOption: DefaultOptionType | DefaultOptionTypeStringId | DefaultOptionTypeStringId[] | null;
  setSelectedOption?: (option: DefaultOptionType | DefaultOptionTypeStringId | DefaultOptionTypeStringId[] | null) => void;
  options: { id: string | number; text: string }[];
  disabled?: boolean;
  isEntered?: boolean;
  setIsEntered?: (isEntered: boolean) => void;
  handleChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: DefaultOptionType | DefaultOptionType[] | null
  ) => void;
  textAlign?: "left" | "center" | "right";
  placeholder?: string;
  multiple?: boolean;
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  desktopfontsize?:string

};

const AutoCompleteSearch = ({
  label,
  labelWidth = "w-24",
  setField,
  fieldValues,
  fieldSearch,
  selectedOption,
  setSelectedOption,
  options,
  disabled = false,
  isEntered = false,
  setIsEntered = () => {},
  handleChange = () => {},
  textAlign = "right",
  placeholder = "",
  multiple = false,
  isLoading = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  desktopfontsize
}: Props) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  //for api search
  useEffect(() => {
    //if user entered the search box, then call the api
    if (isEntered || isOpen) {
      //console.log(fieldValues,fieldSearch,"fieldValue in AutoCompleteSearch")
      fieldValues.forEach((fieldValue) => {
        //console.log(fieldValue.field, fieldValue.value, "fieldValue in AutoCompleteSearch");
        setField(fieldValue.field, fieldValue.value);
      });
      handleDebounceFilterChange(fieldSearch, search); // for search change
    }
  }, [isEntered, search, isOpen]);
  ///////////////////////////////////////////////////////
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setField(field, value);
    }, 500),
    [setField]
  );
  ////////////////////////////////////////////////////////
  return (
    <div className="flex w-full justify-center items-center gap-2 text-sm">
      {label !== "" && (
        <label htmlFor={label} className={labelWidth + " text-left"}>
          {label}:
        </label>
      )}
      <div className="flex-1">
        <AutoComplet
          options={options?.map((b) => ({
            id: b.id,
            title: convertToFarsiDigits(b.text),
          }))}
          value={
            multiple && Array.isArray(selectedOption)
              ? selectedOption.map((opt) => ({
                  id: opt.id,
                  title: convertToFarsiDigits(opt.title ?? ""),
                }))
              : selectedOption && !Array.isArray(selectedOption)
              ? {
                  id: selectedOption.id ?? "",
                  title: convertToFarsiDigits(selectedOption.title ?? ""),
                }
              : null
          }
          handleChange={
            handleChange !== undefined && setSelectedOption === undefined
              ? (_event, newValue) =>
                  handleChange(_event, newValue as DefaultOptionType | DefaultOptionType[] | null)
              : (_event, newValue) => {
                  if (multiple && Array.isArray(newValue)) {
                    return setSelectedOption?.(
                      newValue.map((opt) => ({
                        id: String(opt.id),
                        title: opt.title,
                      })) as DefaultOptionTypeStringId[]
                    );
                  } else if (newValue && !Array.isArray(newValue)) {
                    return setSelectedOption?.({
                      id: String(newValue.id),
                      title: newValue.title,
                    } as DefaultOptionTypeStringId);
                  } else {
                    return setSelectedOption?.(null);
                  }
                }
          }
          setSearch={setSearch}
          showLabel={false}
          inputPadding="4px !important"
          outlinedInputPadding="0px"
          backgroundColor="white"
          showClearIcon={false}
          setIsEntered={setIsEntered}
          disabled={disabled}
          textAlign={textAlign}
          placeholder={placeholder}
          onIsOpenChange={setIsOpen}
          multiple={multiple} 
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          desktopfontsize={desktopfontsize}
        />
      </div>
    </div>
  );
};

export default AutoCompleteSearch;
