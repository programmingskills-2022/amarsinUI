import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import PermissionsTree from "./PermissionsTree";
import { FaCheck, FaTimes } from "react-icons/fa";

type Props = {
  permissions: any[];
  isLoading: boolean;
};
const PermissionsInfo = ({ permissions, isLoading }: Props) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const tempData = permissions.map((item) => {
      return {
        ...item,
        idString: convertToFarsiDigits(item.id),
        nam: convertToFarsiDigits(item.nam),
        hasAccessImg:
          item.checked === true ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          ),
        checkedInput: (
          <input
            type="checkbox"
            className="flex items-center justify-center"
            checked={item.checked}
            onChange={() => {
              console.log("Checkbox changed:", item.checked);
            }}
          />
        ),
      };
    });
    setData(tempData);
  }, [permissions]);
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 h-full">
      <PermissionsTree data={data} isLoading={isLoading} />
    </div>
  );
};

export default PermissionsInfo;
