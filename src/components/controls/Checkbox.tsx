import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from "@mui/material";

interface CheckboxProps {
  name: string;
  label?: string;
  value: boolean;
  onChange: (event: { target: { name: string; value: boolean } }) => void;
}

export default function Checkbox(props: CheckboxProps) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (name: string, value: boolean) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <FormControl>
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            color="primary"
            checked={value}
            onChange={(e) => onChange(convertToDefEventPara(name, e.target.checked))}
          />
        }
        label={label ?? ""}
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: { xs: "0.8rem", md: "1rem" },
          },
        }}
      />
    </FormControl>
  );
}