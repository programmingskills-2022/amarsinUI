import React from "react";

type InputProps = {
  name?: string;
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "outlined" | "filled" | "standard";
  widthDiv?: string;
  widthLabel?: string;
  widthInput?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const {
    name,
    label,
    value,
    onChange,
    variant,
    widthDiv,
    widthLabel,
    widthInput,
    ...other
  } = props;

  const classNameDiv = `flex justify-between items-center gap-1 ${widthDiv}`;
  const classNameLabel = `text-left ${widthLabel}`;
  const classNameInput = `rounded-md p-1 ${widthInput} ${
    variant === "outlined" ? "border-2 border-gray-300" : variant === "filled" ? "bg-gray-100" : "bg-white"
  }`;
  return (
    <div className= {classNameDiv}>
      {label && <label className={classNameLabel}>{label}</label>}
      <input
        className={classNameInput}
        type="text"
        value={value}
        onChange={onChange}
        {...other}
      />
    </div>
  );
}
