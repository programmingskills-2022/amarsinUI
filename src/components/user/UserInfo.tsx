import { useEffect, useState } from "react";
import UserTree from "./UserInfoTree";
import Input from "../controls/Input";
import { RadioGroup } from "../controls/RadioGroup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { convertToFarsiDigits } from "../../utilities/general";
import { CgCompressV } from "react-icons/cg";
import { RiExpandHeightFill } from "react-icons/ri";
import { useUserStore } from "../../store/userStore";

type Props = {
  users: any[];
  isLoading: boolean;
  setSelectedUser: (user: any) => void;
};
const UserInfo = ({ users, isLoading, setSelectedUser }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchUserName, setSearchUserName] = useState("");
  const [active, setActive] = useState(-1);
  const [isOnline, setIsOnline] = useState(-1);
  const { setField: setUserField } = useUserStore();
  ////////////////////////////////////////////////////////
  // api/User/userList?ParentId=104&Active=-1&IsOnline=-1
  useEffect(() => {
    setUserField("active", active);
    setUserField("isOnline", isOnline);
  }, [active, isOnline]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const tempData = users
      .filter((item) =>
        item.userName.toLowerCase().includes(searchUserName.toLowerCase())
      )
      .map((item) => {
        return {
          ...item,
          idString: convertToFarsiDigits(item.id),
          userName: convertToFarsiDigits(item.userName),
          nam: convertToFarsiDigits(item.nam),
          chartFullName: convertToFarsiDigits(item.chartFullName),
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
  }, [users, searchUserName]);

  return (
    <div className="w-full md:w-1/2 md:h-full flex flex-col items-start justify-start md:justify-between md:items-center  gap-2 py-2 text-sm text-gray-600">
      <div className="w-full flex items-center justify-between gap-2">
        <Input
          label="جستجو:"
          placeholder="جستجو..."
          widthDiv="w-1/4"
          widthInput="w-full"
          value={searchUserName}
          onChange={(e) => setSearchUserName(e.target.value)}
        />
        <RadioGroup
          options={[
            { label: "غیرفعال", value: "inactive" },
            { label: "فعال", value: "active" },
            { label: "همه", value: "all" },
          ]}
          name="status"
          selectedValue={
            active === -1 ? "all" : active === 1 ? "active" : "inactive"
          }
          onChange={(value) => {
            setActive(value === "all" ? -1 : value === "active" ? 1 : 0);
          }}
          className="w-1/4 flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
        />
        <RadioGroup
          options={[
            { label: "آفلاین", value: "offLine" },
            { label: "آنلاین", value: "online" },
            { label: "همه", value: "all" },
          ]}
          name="online"
          selectedValue={
            isOnline === -1 ? "all" : isOnline === 0 ? "offLine" : "online"
          }
          onChange={(value) => {
            setIsOnline(value === "all" ? -1 : value === "online" ? 1 : 0);
          }}
          className="w-1/4 flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
        />
        <div className="w-1/4 flex flex-row justify-end gap-2">
          <RiExpandHeightFill
            className="text-xl cursor-pointer hover:text-blue-500"
            onClick={() => setIsExpanded(true)}
          />
          <CgCompressV
            className="text-xl cursor-pointer hover:text-blue-500"
            onClick={() => setIsExpanded(false)}
          />
        </div>
      </div>
      <UserTree
        data={data}
        isExpanded={isExpanded}
        isLoading={isLoading}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default UserInfo;
