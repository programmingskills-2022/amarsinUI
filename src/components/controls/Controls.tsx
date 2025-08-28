import Input from "./Input";
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./PersianDatePicker";
import Button from "./Button";

const Controls: {
  Input: typeof Input;
  RadioGroup: typeof RadioGroup;
  Select: typeof Select;
  Checkbox: typeof Checkbox;
  DatePicker: typeof DatePicker;
  Button: typeof Button;
} = {
  Input,
  RadioGroup,
  Select,
  Checkbox,
  DatePicker,
  Button,
};

export default Controls;