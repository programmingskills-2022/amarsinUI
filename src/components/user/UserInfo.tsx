import { useEffect, useState } from "react";
import UserTree from "./UserTree";
import Input from "../controls/Input";
import { RadioGroup } from "../controls/RadioGroup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { convertToFarsiDigits } from "../../utilities/general";

type Props = {
  users: any[];
};
const UserInfo = ({ users }: Props) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const tempData = users.map((item) => {
      return {
        ...item,
        idString:convertToFarsiDigits(item.id),
        userName:convertToFarsiDigits(item.userName),
        nam:convertToFarsiDigits(item.nam),
        chartFullName:convertToFarsiDigits(item.chartFullName),
        isActiveImg:
          item.active === true ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          ),
        isOnlineImg:
          item.isOnline === true ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          ),
      };
    });
    setData(tempData);
  }, [users]);
  return (
    <div className="w-1/2 flex flex-col gap-2 p-2 text-sm text-gray-600">
      <div className="w-full flex justify-end gap-2">
        <Input
          label="جستجو:"
          placeholder="جستجو"
          widthDiv="w-full"
          widthInput="w-full"
        />
        <RadioGroup
          options={[
            { label: "غیرفعال", value: "inactive" },
            { label: "فعال", value: "active" },
            { label: "همه", value: "all" },
          ]}
          name="status"
          selectedValue="all"
          onChange={(value) => {
            console.log(value);
          }}
          className="w-full flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
        />
        <RadioGroup
          options={[
            { label: "آفلاین", value: "offLine" },
            { label: "آنلاین", value: "online" },
            { label: "همه", value: "all" },
          ]}
          name="online"
          selectedValue="all"
          onChange={(value) => {
            console.log(value);
          }}
          className="w-full flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
        />
      </div>
      <UserTree data={data} />
    </div>
  );
};

export default UserInfo;
