import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { convertToFarsiDigits, normalizeInputForSearch } from "../../utilities/general";

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
  showBold?: boolean;
  placeholder?: string;
  multiple?: boolean;
  changeColorOnFocus?: boolean;
  textColor?: string;
  backgroundColor?: string;
  required?: boolean;
  handleBlur?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  setIsEntered?: (isEntered: boolean) => void;
  onIsOpenChange?: (isOpen: boolean) => void;
};

const AutoComplet = forwardRef(
  <T extends { id: string | number; title: string }>(
    {
      options,
      label,
      value,
      handleChange,
      setSearch,
      inputValue: controlledInputValue,
      onInputChange,
      mobilefontsize = "0.7rem",
      desktopfontsize = "0.875rem",
      showLabel = true,
      showBorder = true,
      showBorderFocused = false,
      showClearIcon = true,
      showPopupIcon = true,
      outlinedInputPadding = "10px",
      textAlign="right",
      inputPadding="0",
      showBold = false,
      placeholder = "",
      multiple = false,
      changeColorOnFocus,
      textColor,
      backgroundColor,
      required = false,
      handleBlur,
      disabled,
      isLoading,
      className,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      setIsEntered,
      onIsOpenChange,
    }: Props<T>,
    ref: React.Ref<any>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [internalInputValue, setInternalInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const { ref: intersectionRef, inView } = useInView({
      threshold: 0,
      rootMargin: '20px',
    });

    useEffect(() => {
      if (inView && hasNextPage && fetchNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, fetchNextPage]);
    // Use controlled inputValue if provided, otherwise use internal state
    // When focused/editing, prioritize internal state for immediate feedback
    const inputValue = (isFocused || isEditing) && controlledInputValue === undefined
      ? internalInputValue
      : (controlledInputValue !== undefined ? controlledInputValue : internalInputValue);

    // Get display value
    const getDisplayValue = () => {
      // When focused or editing, always show inputValue to allow typing
      // In multiple mode, always show inputValue when focused to allow continuous selection
      if (isFocused || isEditing) {
        return inputValue || "";
      }
      // When not focused and a value is selected, show the selected value
      if (value) {
        if (multiple && Array.isArray(value)) {
          // In multiple mode, don't show selected values in input when not focused
          // They will be shown as chips instead
          return "";
        }
        return (value as T).title;
      }
      // Otherwise show inputValue (for when user typed but hasn't selected)
      return inputValue || "";
    };

    // Show all options - no client-side filtering (filtering handled by server/API)
    const filteredOptions = React.useMemo(() => {
      return options;
    }, [options]);

    // Check if option is selected
    const isOptionSelected = (option: T): boolean => {
      if (multiple && Array.isArray(value)) {
        // Use strict comparison with type conversion to handle string/number ID mismatches
        return value.some(v => String(v.id) === String(option.id));
      }
      return value !== null && value !== undefined && String((value as T).id) === String(option.id);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = convertToFarsiDigits(e.target.value);
      const normalizedValue = normalizeInputForSearch(newValue);
      
      // User is actively editing
      setIsEditing(true);
      
      // If user starts typing and a value is selected, clear the selection
      if (value && !multiple) {
        handleChange(null, null);
      }
      
      // Always update internal state immediately for responsive UI
      // This ensures the input shows what the user is typing right away
      setInternalInputValue(newValue);
      
      // Also notify parent if callbacks are provided (send normalized value for search)
      if (onInputChange) {
        onInputChange(e, normalizedValue);
      } else if (setSearch) {
        console.log(normalizedValue, "normalizedValue in handleInputChange");
        setSearch(normalizedValue);
      }

      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    // Handle option selection
    const handleOptionSelect = (option: T) => {
      if (multiple) {
        const currentValue = Array.isArray(value) ? value : [];
        // Use strict comparison with type conversion to handle string/number ID mismatches
        // Also check both ID and title to be extra safe
        const isSelected = currentValue.some(v => 
          String(v.id) === String(option.id) || 
          (v.title && option.title && v.title === option.title)
        );
        // In multiple mode, prevent duplicate selections - do nothing if already selected
        if (isSelected) {
          // If already selected, do nothing (prevent duplicate selection)
          // Keep dropdown open and input focused for next selection
          setIsOpen(true);
          inputRef.current?.focus();
          return;
        }
        // If not selected, add it
        const newValue = [...currentValue, option];
        handleChange(null, newValue as T[]);
        // In multiple mode, keep input focused and clear it for next selection
        //setInternalInputValue("");
        /*if (onInputChange) {
          onInputChange(null, "");
        } else if (setSearch) {
          setSearch("");
        }*/
        // Keep dropdown open in multiple mode
        setIsOpen(true);
        inputRef.current?.focus();
      } else {
        handleChange(null, option);
        setIsOpen(false);
        setIsEditing(false);
        if (onInputChange) {
          onInputChange(null, "");
        } else if (setSearch) {
          setSearch("");
        } else {
          setInternalInputValue("");
        }
      }
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(false);
      if (onInputChange) {
        onInputChange(null, "");
      } else if (setSearch) {
        console.log("setSearch in handleClear");
        setSearch("");
      } else {
        setInternalInputValue("");
      }
      handleChange(null, null);
      inputRef.current?.focus();
    };

    // Handle removing a single selected item in multiple mode
    const handleRemoveChip = (e: React.MouseEvent, itemToRemove: T) => {
      e.stopPropagation();
      if (multiple && Array.isArray(value)) {
        const newValue = value.filter(v => v.id !== itemToRemove.id);
        handleChange(null, newValue.length > 0 ? newValue : null);
      }
      inputRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    };

    // Handle focus
    const handleFocus = () => {
      setIsFocused(true);
      setIsOpen(true);
      setIsEditing(true); // Always allow editing when focused
      
      // If a value is selected but inputValue is empty, initialize with selected value
      // This allows user to see and edit the selected value
      // Only do this if inputValue is truly empty (not just whitespace)
      if (value && !multiple && !inputValue?.trim()) {
        const selectedTitle = (value as T).title;
        if (controlledInputValue === undefined) {
          // Uncontrolled mode - update internal state
          setInternalInputValue(selectedTitle);
        }
        // Also notify parent if callbacks are provided
        if (onInputChange) {
          onInputChange(null, selectedTitle);
        } //else if (setSearch) {
          //console.log(selectedTitle, "selectedTitle in handleFocus");
          //setSearch(selectedTitle);
        //}
      }
    };

    // Handle blur
    const handleBlurEvent = () => {
      // Delay to allow option click to register
      setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          setIsFocused(false);
          setIsOpen(false);
          setHighlightedIndex(-1);
          // Only exit editing mode if no value is selected and input is empty
          // Otherwise keep editing mode so selected value is shown
          if (!value && !inputValue) {
            setIsEditing(false);
          }
          handleBlur?.();
        }
      }, 200);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Notify parent when isOpen changes
    useEffect(() => {
      onIsOpenChange?.(isOpen);
    }, [isOpen, onIsOpenChange]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex]);

    // Update input value when controlled value changes
    useEffect(() => {
      if (controlledInputValue !== undefined) {
        // Controlled mode - don't update internal state
      } else if (!value) {
        // If value is cleared, clear input
        setInternalInputValue("");
        setIsEditing(false);
      }
    }, [controlledInputValue, value]);

    // Expose ref to parent
    React.useImperativeHandle(ref, () => inputRef.current);

    const displayValue = getDisplayValue();
    const hasValue = value !== null && value !== undefined && (multiple ? (Array.isArray(value) && value.length > 0) : true);
    const showClear = showClearIcon && hasValue && !disabled;
    const showDropdown = isOpen && !disabled;
    const selectedItems = multiple && Array.isArray(value) ? value : [];

    // Dynamic styles that can't be easily converted to Tailwind
    const dynamicInputStyle: React.CSSProperties = {
      fontSize: window.innerWidth < 768 ? mobilefontsize : desktopfontsize,
      color: textColor || undefined,
      padding: inputPadding || "0",
      paddingRight: "8px",
    };

    const dynamicLabelStyle: React.CSSProperties = {
      fontSize: window.innerWidth < 768 ? mobilefontsize : desktopfontsize,
    };

    const dynamicOptionStyle: React.CSSProperties = {
      fontSize: window.innerWidth < 768 ? mobilefontsize : desktopfontsize,
    };

    const dynamicWrapperStyle: React.CSSProperties = {
      paddingTop: "1px",
      paddingBottom: "1px",
      paddingLeft: textAlign === "center" ? "0" : outlinedInputPadding,
      paddingRight: textAlign === "center" ? "0" : outlinedInputPadding,
    };

    // Container classes
    const containerClasses = `relative w-full rounded-md ${
      isFocused && changeColorOnFocus
        ? "bg-gray-50"
        : backgroundColor
        ? ""
        : "bg-inherit"
    }`;

    // Input wrapper classes
    const inputWrapperClasses = `flex items-center rounded ${
      showBorder || (showBorderFocused && isFocused)
        ? "border border-gray-300"
        : "border-none"
    } ${disabled ? "bg-gray-100" : "bg-transparent"} ${
      multiple && selectedItems.length > 0 ? "flex-wrap" : ""
    }`;

    // Input classes
    const inputClasses = `${multiple && selectedItems.length > 0 ? "flex-1 min-w-[120px]" : "w-full"} border-none outline-none bg-transparent whitespace-normal break-words ${
      showBold ? "font-bold" : "font-normal"
    } ${
      textAlign === "center"
        ? "text-center"
        : textAlign === "right"
        ? "text-right"
        : "text-left"
    }`;

    // List classes
    const listClasses = "absolute top-full left-0 right-0 z-[1000] max-h-[300px] overflow-y-auto bg-white border border-t-0 border-gray-300 rounded-b-md m-0 p-0 list-none shadow-lg";

    return (
      <div 
        ref={containerRef} 
        className={`${containerClasses} ${className || ""}`}
        style={backgroundColor && !(isFocused && changeColorOnFocus) ? { backgroundColor } : undefined}
      >
        {showLabel && label && (
          <label
            className={`block mb-1 ${showBold ? "font-bold" : "font-normal"}`}
            style={dynamicLabelStyle}
          >
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <div className={inputWrapperClasses} style={dynamicWrapperStyle}>
          {/* Show selected chips in multiple mode */}
          {multiple && selectedItems.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center flex-shrink-0 py-1 px-1">
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs flex-shrink-0"
                >
                  <span className="truncate max-w-[150px]">{item.title}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveChip(e, item)}
                      className="ml-1 text-gray-600 hover:text-gray-800 focus:outline-none font-bold"
                      tabIndex={-1}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlurEvent}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            style={dynamicInputStyle}
            autoComplete="off"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsEntered?.(true);
            }}
          />
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-transparent border-none cursor-pointer p-1 flex items-center ml-1"
              tabIndex={-1}
            >
              <span className="text-base text-gray-600">×</span>
            </button>
          )}
          {showPopupIcon && (
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`bg-transparent border-none ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              } p-1 flex items-center ml-1 transition-all duration-300 ease-in-out ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              tabIndex={-1}
            >
              <span className="text-xs text-gray-500 transition-transform duration-300 ease-in-out">▼</span>
            </button>
          )}
        </div>
        {showDropdown && (
          <ul ref={listRef} className={listClasses}>
            {isLoading ? (
              <li className="p-3 text-center text-gray-600">
                در حال بارگذاری...
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="p-3 text-center text-gray-600">
                نتیجه ای یافت نشد
              </li>
            ) : (
              <>
                {filteredOptions.map((option, index) => {
                  const isHighlighted = highlightedIndex === index;
                  const isSelected = isOptionSelected(option);
                  const isLastItem = index === filteredOptions.length - 1;
                  return (
                    <li
                      key={option.id}
                      ref={isLastItem && hasNextPage ? intersectionRef : null}
                      className={`py-2 px-3 cursor-pointer flex items-center justify-between ${
                        isHighlighted || isSelected
                          ? "bg-blue-50"
                          : "bg-transparent"
                      } ${
                        index < filteredOptions.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } ${
                        textAlign === "center"
                          ? "text-center"
                          : textAlign === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                      style={dynamicOptionStyle}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <span className="flex-1">{option.title}</span>
                      {multiple && isSelected && (
                        <span className="ml-2 text-blue-600 text-sm">✓</span>
                      )}
                    </li>
                  );
                })}
                {isFetchingNextPage && (
                  <li className="p-3 text-center text-gray-600">
                    در حال بارگذاری نتایج بیشتر...
                  </li>
                )}
              </>
            )}
          </ul>
        )}
      </div>
    );
  }
);

AutoComplet.displayName = "AutoComplet";

export default AutoComplet;
