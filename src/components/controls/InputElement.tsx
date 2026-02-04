import { colors } from "../../utilities/color";
import { convertToFarsiDigits } from "../../utilities/general";

export const InputElement = (
    value: string,
    disabled: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
    backgroundColor?:string,
  ) => {
    return (
      <div className="flex w-full">
        <input
          type="text"
          value={convertToFarsiDigits(value)}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          style={{
            backgroundColor: disabled ? colors.gray50 : backgroundColor ?? "inherit", 
            color: disabled ? colors.gray600 : "inherit",
          }}
        />
      </div>
    );
  };