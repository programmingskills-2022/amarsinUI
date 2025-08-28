import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";

interface DatePickerProps {
  name: string;
  label: string;
  value: Date | null;
  onChange: (event: { target: { name: string; value: Date | null } }) => void;
}

export default function DatePickerMiladi(props: DatePickerProps) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (name: string, value: Date | null) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        label={label}
        value={value}
        onChange={(date) => onChange(convertToDefEventPara(name, date))}
        slots={{
          textField: TextField, // Use the TextField component as the input
        }}
        slotProps={{
          textField: {
            fullWidth: true, // Pass additional props to the TextField
          },
        }}
      />
    </LocalizationProvider>
  );
}