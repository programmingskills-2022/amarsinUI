import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputProps = TextFieldProps & {
  name: string;
  label: string;
  value: string | number;
  errorText?: string | null | undefined; // ✅ renamed
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: InputProps) {
  const { name, label, value,  errorText = null, onChange, ...other } = props;

  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!errorText} // ✅ boolean for TextField
      helperText={errorText || ""} // ✅ string for helperText
      {...other}
    />
  );
}