import { Autocomplete, TextField } from "@mui/material";
import { colors } from "../../utilities/color";
import React, { forwardRef } from "react";
import { normalizeInputForSearch } from "../../utilities/general";

type Props<T extends { id: string | number; title: string }> = {
  options: T[];
  label?: string;
  value: T | T[] | null;
  handleChange: (event: any, newValue: T | T[] | null) => void;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  inputValue?: string;
  onInputChange?: (event: any, newInputValue: string) => void;
  className?: string;
  mobilefontsize?: string;
  desktopfontsize?: string;
  showLabel?: boolean;
  showBorder?: boolean;
  showBorderFocused?: boolean;
  showClearIcon?: boolean;
  showPopupIcon?: boolean;
  outlinedInputPadding?: string;
  inputPadding?: string;
  textAlign?: string;
  showBold?: boolean; // <-- add this
  placeholder?: string;
  multiple?: boolean;
  changeColorOnFocus?: boolean;
  textColor?: string;
  backgroundColor?: string;
  required?: boolean;
  handleBlur?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const AutoComplete = forwardRef(
  <T extends { id: string | number; title: string }>(
    {
      options,
      label,
      value,
      handleChange,
      setSearch,
      inputValue,
      onInputChange,
      mobilefontsize = "0.7rem",
      desktopfontsize = "0.875rem",
      showLabel = true,
      showBorder = true,
      showBorderFocused = false,
      showClearIcon = true,
      showPopupIcon = true,
      outlinedInputPadding = "10px",
      textAlign,
      inputPadding,
      showBold = false, // <-- default to false
      placeholder = "",
      multiple = false,
      changeColorOnFocus,
      textColor,
      backgroundColor,
      required = false,
      handleBlur,
      disabled,
      isLoading,
    }: Props<T>,
    ref: React.Ref<any>
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    return (
      <Autocomplete
        disabled={disabled}
        ref={ref}
        options={options}
        clearIcon={showClearIcon ? undefined : <span />}
        popupIcon={showPopupIcon ? undefined : <span />}
        renderOption={(props, option) => {
          const isSelected = multiple
            ? Array.isArray(value) && value.some((v) => v.id === option.id)
            : value && (value as { id: string | number }).id === option.id;

          return (
            <li
              {...props}
              className="text-xs md:text-sm px-2 py-1"
              style={{
                fontSize: desktopfontsize,
                textAlign: (textAlign !== undefined ? textAlign : "right") as
                  | "left"
                  | "center"
                  | "right",
                backgroundColor: isSelected ? colors.blue50 : undefined, // change background if selected
              }}
              key={option.id}
            >
              {option.title}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            placeholder={placeholder}
            label={showLabel ? label : undefined}
            onChange={(event) => {
              if (onInputChange) {
                onInputChange(event, event.target.value);
              } else if (setSearch) {
                setSearch(event.target.value);
              }
            }}
            sx={{
              fontSize: { xs: mobilefontsize, sm: desktopfontsize },
              fontWeight: showBold ? 700 : 400, // <-- root font weight
              "& .MuiInputBase-input": {
                fontSize: { xs: mobilefontsize, sm: desktopfontsize },
                color: textColor,
                fontWeight: showBold ? 700 : 400, // <-- input font weight
                ...(inputPadding && { padding: inputPadding }),
                textAlign: (textAlign as "left" | "center" | "right") ?? "left",
                whiteSpace: "normal", // allow input text to wrap
                overflowWrap: "break-word",
                wordBreak: "break-word",
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: mobilefontsize, sm: desktopfontsize },
                fontWeight: showBold ? 700 : 400, // <-- label font weight
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border:
                  showBorder || (showBorderFocused && isFocused)
                    ? undefined
                    : "none",
              },
              "& .MuiAutocomplete-popupIndicator": {
                display: showPopupIcon ? undefined : "none",
              },
              "& MuiOutlinedInput-notchedOutline": {
                textAlign: (textAlign as "left" | "center" | "right") ?? "left",
              },
              "& .MuiInputBase-root": {
                textAlign: (textAlign as "left" | "center" | "right") ?? "left",
              },
              "& .MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon.muirtl-1tlcqt-MuiAutocomplete-root .MuiOutlinedInput-root":
                {
                  paddingLeft:
                    textAlign === "center" 
                      ? "0 !important"
                      : outlinedInputPadding,
                  paddingRight:
                    textAlign === "center" 
                      ? "0 !important"
                      : outlinedInputPadding,
                },
              "& .muirtl-2jdxdn-MuiFormControl-root-MuiTextField-root .MuiOutlinedInput-root":
                {
                  paddingY: outlinedInputPadding,
                },
              ...(outlinedInputPadding && {
                "& .MuiOutlinedInput-root": {
                  paddingY: outlinedInputPadding,
                  paddingX:
                    textAlign === "center"
                      ? "0 !important"
                      : outlinedInputPadding,
                },
              }),
            }}
          />
        )}
        style={{
          backgroundColor:
            isFocused && changeColorOnFocus
              ? colors.gray50
              : backgroundColor
              ? backgroundColor
              : "inherit",
        }}
        value={value}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onChange={handleChange}
        getOptionLabel={(option) => normalizeInputForSearch(option.title) || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText={isLoading ? "در حال بارگذاری..." : options.length === 0 ? "نتیجه ای یافت نشد" : ""}
        size="small"
        multiple={multiple}
        className="w-full"
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          handleBlur?.();
        }}
      />
    );
  }
);

AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
