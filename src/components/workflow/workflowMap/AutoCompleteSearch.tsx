import { useCallback, useRef, useEffect, useState } from "react";
import { DefaultOptionType } from "../../../types/general";
import { debounce } from "lodash";
import AutoComplet from "../../controls/AutoComplet";
import { convertToFarsiDigits } from "../../../utilities/general";

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
  selectedOption: DefaultOptionType;
  setSelectedOption: (option: DefaultOptionType) => void;
  options: { id: string | number; text: string }[];
  disabled?: boolean;
  isEntered?: boolean;
  setIsEntered?: (isEntered: boolean) => void;
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
}: Props) => {
  const [search, setSearch] = useState("");
  //for api search
  useEffect(() => {
    //if user entered the search box, then call the api
    if (isEntered) {
      fieldValues.forEach((fieldValue) => {
        //console.log(fieldValue.field, fieldValue.value, "fieldValue in AutoCompleteSearch");
        setField(fieldValue.field, fieldValue.value);
      });
      handleDebounceFilterChange(fieldSearch, search); // for search change
    }
  }, [isEntered, search]);
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
      {label!=="" && (
        <label htmlFor={label} className={labelWidth + " text-left"}>
          {label}:
        </label>
      )}
      <div className="flex-1">
        <AutoComplet
          options={options.map((b) => ({
            id: b.id,
            title: convertToFarsiDigits(b.text),
          }))}
          value={{
            id: selectedOption?.id ?? "",
            title: convertToFarsiDigits(selectedOption?.title ?? ""),
          }}
          handleChange={(_event, newValue) => {
            return setSelectedOption({
              id: (newValue as DefaultOptionType)?.id ?? "",
              title: convertToFarsiDigits(
                (newValue as DefaultOptionType)?.title ?? ""
              ),
            });
          }}
          setSearch={setSearch}
          showLabel={false}
          inputPadding="4px !important"
          outlinedInputPadding="0px"
          backgroundColor="white"
          showClearIcon={false}
          setIsEntered={setIsEntered}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AutoCompleteSearch;
