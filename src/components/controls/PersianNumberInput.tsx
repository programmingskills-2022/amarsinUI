import { useState } from "react";
import { convertToLatinDigits } from "../../utilities/general";

type Props = {
    value: string;
    onChange: (value: string) => void;
    [key: string]: any;
}

export default function PersianNumberInput({ value, onChange, ...props }: Props) {
    const [inputValue, setInputValue] = useState(value);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const latinValue = convertToLatinDigits(rawValue);
      setInputValue(latinValue);
      onChange(latinValue);
    };
  
    return (
      <input
        {...props}
        value={inputValue}
        onChange={handleChange}
        inputMode="decimal"
        pattern="[0-9]*"
      />
    );
  };