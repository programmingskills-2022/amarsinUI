import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface SelectProps {
  name: string;
  label: string;
  value: string | number;
  error?: string | null;
  onChange: (event: { target: { name: string; value: string | number } }) => void
  options: { id: string | number; title: string }[];
}

export default function Select(props: SelectProps) {
  const {  label, value, error = null, onChange, options } = props;


  return (
    <FormControl
      variant="outlined"
      fullWidth
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        value={value}
        onChange={onChange} // Use the custom handler
      >
        <MenuItem value="">None</MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}