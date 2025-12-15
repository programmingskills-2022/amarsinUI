import { useEffect, useMemo, useState } from "react";
import UserTree from "./UserInfoTree";
import Input from "../../controls/Input";
import { RadioGroup } from "../../controls/RadioGroup";
import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import { convertToFarsiDigits } from "../../../utilities/general";
import { CgCompressV } from "react-icons/cg";
import { RiExpandHeightFill } from "react-icons/ri";
import { useUserStore } from "../../../store/userStore";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";
import { DisableEnableResponse } from "../../../types/user";
import ModalMessage from "../../layout/ModalMessage";

type Props = {
  users: any[];
  isLoading: boolean;
  setSelectedUser: (user: any) => void;
  onUserActiveChange?: (
    userId: number,
    setCurrentUserId: React.Dispatch<React.SetStateAction<number>>
  ) => void;
  isLoadingDisableEnable: boolean;
  disableEnableResponse: DisableEnableResponse;
  isDisableEnableModalOpen: boolean;
  setIsDisableEnableModalOpen: (isModalOpen: boolean) => void;
  isShowSelectUserForm: boolean;
  //setIsShowSelectUserForm: (isShowSelectUserForm: boolean) => void;
  //setIsCloseSelectUserModal: (isCloseSelectUserModal: boolean) => void;
};
const UserInfo = ({
  users,
  isLoading,
  setSelectedUser,
  onUserActiveChange,
  isLoadingDisableEnable,
  disableEnableResponse,
  isDisableEnableModalOpen,
  setIsDisableEnableModalOpen,
  isShowSelectUserForm,
  //setIsShowSelectUserForm,
  //setIsCloseSelectUserModal,//to control not sending systemId and destUsrId when close select user modal
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchUserName, setSearchUserName] = useState("");
  const [active, setActive] = useState(-1);
  const [isOnline, setIsOnline] = useState(-1);
  const { setField: setUserField } = useUserStore();
  const [currentUserId, setCurrentUserId] = useState(0);
  ////////////////////////////////////////////////////////
  // api/User/userList?ParentId=104&Active=-1&IsOnline=-1
  useEffect(() => {
    setUserField("active", active);
    setUserField("isOnline", isOnline);
  }, [active, isOnline]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isDisableEnableModalOpen) {
      timeoutId = setTimeout(() => {
        setIsDisableEnableModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDisableEnableModalOpen]);
  ////////////////////////////////////////////////////////
  // for user list tree
  const data = useMemo(() => {
    return users
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
          // for isActive checkbox
          isActiveInput:
            isLoadingDisableEnable && item.id === currentUserId ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <input
                type="checkbox"
                className="flex items-center justify-center"
                checked={item.active}
                onChange={() => {
                  if (onUserActiveChange && !isShowSelectUserForm) {
                    onUserActiveChange(item.id, setCurrentUserId);
                  }
                }}
              />
            ),
          isOnlineImg:
            item.isOnline === true ? (
              <FaCheck color="green" />
            ) : (
              <FaTimes color="red" />
            ),
        };
      });
  }, [users, searchUserName, onUserActiveChange, isLoadingDisableEnable]);
  ////////////////////////////////////////////////////////
  const { width } = useCalculateTableHeight();
  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-start md:justify-between md:items-center gap-2 py-2 text-gray-600`}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2">
        <Input
          label="جستجو:"
          placeholder="جستجو..."
          widthDiv={
            isShowSelectUserForm ? "w-full" : width > 640 ? "w-1/4" : "w-full"
          }
          widthInput="w-full"
          value={searchUserName}
          onChange={(e) => setSearchUserName(e.target.value)}
          variant="outlined"
        />
        <div className="w-full md:w-3/4 flex flex-row items-center justify-between gap-2">
          {!isShowSelectUserForm && (
            <>
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
                className="w-1/3 flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
              />
              <RadioGroup
                options={[
                  { label: "آفلاین", value: "offLine" },
                  { label: "آنلاین", value: "online" },
                  { label: "همه", value: "all" },
                ]}
                name="online"
                selectedValue={
                  isOnline === -1
                    ? "all"
                    : isOnline === 0
                    ? "offLine"
                    : "online"
                }
                onChange={(value) => {
                  setIsOnline(
                    value === "all" ? -1 : value === "online" ? 1 : 0
                  );
                }}
                className="w-1/3 flex flex-row rounded-md border border-gray-300 p-2 justify-evenly"
              />
            </>
          )}
          <div className="w-1/3 flex flex-row justify-end gap-2">
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
      </div>
      <UserTree
        data={data}
        isExpanded={isExpanded}
        isLoading={isLoading}
        setSelectedUser={setSelectedUser}
        isSelectUserModalOpen={isShowSelectUserForm}
      />
      {!isLoadingDisableEnable && (
        <ModalMessage
          isOpen={isDisableEnableModalOpen}
          backgroundColor={
            disableEnableResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            disableEnableResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            disableEnableResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsDisableEnableModalOpen(false)}
          message={disableEnableResponse.meta.message ?? ""}
          visibleButton={false}
        />
      )}
    </div>
  );
};

export default UserInfo;
