import React from "react";

// Define the props for the RadioGroup component
interface RadioGroupProps {
  label?: string;
  labelWidth?: string;
  options: { label: string; value: string }[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

// RadioGroup component
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  labelWidth,
  options,
  name,
  selectedValue,
  onChange,
  className,
}) => {
  return (
    <div
      className={
        className ??
        "w-full flex md:flex-row flex-col gap-2 items-center justify-between"
      }
    >
      {label && (
        <label
          htmlFor={label}
          className={labelWidth ? labelWidth + " text-right" : "w-24 text-right"}
        >
          {label}:
        </label>
      )}
      {options.map((option) => (
        <div key={option.value}>
          <input
            type="radio"
            id={option.value}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};
