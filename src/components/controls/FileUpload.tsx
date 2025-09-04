import React, { useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

interface FileUploadProps {
  name: string;
  label: string;
  onChange: (event: { target: { name: string; value: File | null } }) => void;
  error?: string | null;
  accept?: string;
  multiple?: boolean;
}

export default function FileUpload(props: FileUploadProps) {
  const { name, label, onChange, error = null, accept, multiple = false } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange({
      target: {
        name,
        value: file,
      },
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
      />
      <Button
        variant="outlined"
        component="span"
        onClick={handleButtonClick}
        startIcon={<CloudUploadIcon />}
        fullWidth
        sx={{
          height: "56px",
          borderColor: error ? "error.main" : "primary.main",
          "&:hover": {
            borderColor: error ? "error.dark" : "primary.dark",
          },
        }}
      >
        {label}
      </Button>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
} 