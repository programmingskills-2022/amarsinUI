import Input from "./Input";
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Button from "./Button";
import FileUpload from "./FileUpload";

const Controls: {
  Input: typeof Input;
  RadioGroup: typeof RadioGroup;
  Select: typeof Select;
  Checkbox: typeof Checkbox;
  DatePicker: typeof DatePicker;
  Button: typeof Button;
  FileUpload: typeof FileUpload;
} = {
  Input,
  RadioGroup,
  Select,
  Checkbox,
  DatePicker,
  Button,
  FileUpload,
};

export default Controls;