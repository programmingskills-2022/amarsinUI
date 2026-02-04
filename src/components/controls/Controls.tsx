import Input from "./Input";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./PersianDatePicker";
import Button from "./Button";

const Controls: {
  Input: typeof Input;
  Select: typeof Select;
  Checkbox: typeof Checkbox;
  DatePicker: typeof DatePicker;
  Button: typeof Button;
} = {
  Input,
  Select,
  Checkbox,
  DatePicker,
  Button,
};

export default Controls;