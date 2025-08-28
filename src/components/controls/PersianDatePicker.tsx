import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";


interface DatePickerProps {
  name: string;
  label: string;
  value: Date | null;
  disabled?: boolean;
  fontSize?: string;
  onChange: (event: { target: { name: string; value: Date | null } }) => void;
}

export default function PersianDatePicker({ name, value, onChange, disabled, fontSize = "text-base" }: DatePickerProps) {
  return (
    <DatePicker
      value={value}
      onChange={date => onChange({ target: { name, value: date ? date.toDate() : null } })}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder="اینجا کلیک کنید..."
      inputClass={`w-full p-1 border-2 border-gray-300 rounded-md ${fontSize} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      style={{ width: "100%" }} 
      disabled={disabled}
    />
  );
}