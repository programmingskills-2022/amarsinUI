import React, { useState } from "react";
import { Box } from "@mui/material";

interface UseFormProps<T> {
  initialFValues: T;
  validateOnChange?: boolean;
  validate?: (fieldValues: Partial<T>) => void;
}

export function useForm<T>({
  initialFValues,
  validateOnChange = false,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialFValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (validateOnChange && validate) {
      validate({ [name]: value } as Partial<T>);
    }
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Form({ children, onSubmit, ...other }: FormProps) {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiFormControl-root": {
          width: "80%",
          margin: 1, // Equivalent to theme.spacing(1)
        },
      }}
      autoComplete="off"
      onSubmit={onSubmit}
      {...other}
    >
      {children}
    </Box>
  );
}