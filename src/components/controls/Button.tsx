import React from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  text: string;
}

export default function Button(props: CustomButtonProps) {
  const {
    text,
    size = "large",
    color = "primary",
    variant = "contained",
    onClick,
    ...other
  } = props;

  return (
    <MuiButton
      variant={variant}
      size={size}
      color={color}
      onClick={onClick}
      {...other}
      sx={{
        margin: 0.5, // Equivalent to theme.spacing(0.5)
        textTransform: "none", // Prevents uppercase transformation
      }}
    >
      {text}
    </MuiButton>
  );
}