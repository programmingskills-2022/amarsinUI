import { useEffect, useState } from "react";
import UserTree from "./UserTree";
import Input from "../controls/Input";
import { RadioGroup } from "../controls/RadioGroup";
import { FaCheck, FaTimes } from "react-icons/fa";

type Props = {
  testData: any[];
};
const UserInfo = ({ testData }: Props) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const tempData = testData.map((item) => {
      return {
        ...item,
        status:
          item.status === 1 ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          ),
        online:
          item.online === 1 ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          ),
      };
    });
    setData(tempData);
  }, []);
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
