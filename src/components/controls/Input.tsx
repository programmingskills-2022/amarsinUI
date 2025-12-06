import React from "react";

type InputProps = {
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | "file"
    | "hidden"
    | "checkbox"
    | "radio"
    | "submit"
    | "reset"
    | "button"
    | "image"
    | "range"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | "file"
    | "hidden"
    | "checkbox"
    | "radio"
    | "submit"
    | "reset"
    | "button"
    | "image"
    | "range";
  name?: string;
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "outlined" | "filled" | "standard";
  widthDiv?: string;
  widthLabel?: string;
  widthInput?: string;
  textColor?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const {
    type,
    name,
    label,
    value,
    onChange,
    variant,
    widthDiv,
    widthLabel,
    widthInput,
    textColor = "",
    ...other
  } = props;

  const classNameDiv = `flex justify-between items-center gap-1 ${widthDiv}`;
  const classNameLabel = `text-left ${widthLabel}`;
  const classNameInput = `rounded-md p-1 ${textColor} ${widthInput} ${
    variant === "outlined"
      ? "border-2 border-gray-300"
      : variant === "filled"
      ? "bg-gray-100"
      : "bg-white"
  }`;
  return (
    <div className={classNameDiv}>
      {label && <label className={classNameLabel}>{label}</label>}
      <input
        className={classNameInput}
        type={type || "text"}
        value={value}
        onChange={onChange}
        {...other}
      />
    </div>
  );
}
