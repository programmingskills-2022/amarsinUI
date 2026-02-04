import { DisableEnableResponse } from "../../../types/user";
import ConfirmCancel from "../../controls/ConfirmCancel";
import UserInfo from "../userMainForm/UserInfo";
import { UserFormData } from "./UserReg";
import { DefaultOptionType } from "../../../types/general";

type Props = {
  users: any[];
  isLoadingUserList: boolean;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  handleUserActiveChange: (
    userId: number,
    setCurrentUserId: React.Dispatch<React.SetStateAction<number>>
  ) => void;
  isLoadingDisableEnable: boolean;
  disableEnableResponse: DisableEnableResponse;
  isDisableEnableModalOpen: boolean;
  setIsDisableEnableModalOpen: (isModalOpen: boolean) => void;
  isShowSelectUserForm: boolean;
  setIsShowSelectUserForm: (isShowSelectUserForm: boolean) => void;
  setIsCloseSelectUserModal: (isCloseSelectUserModal: boolean) => void;
  setUser: React.Dispatch<React.SetStateAction<UserFormData>>
};

const UserRegSelectUser = ({
  users,
  isLoadingUserList,
  selectedUser,
  setSelectedUser,
  handleUserActiveChange,
  isLoadingDisableEnable,
  disableEnableResponse,
  isDisableEnableModalOpen,
  setIsDisableEnableModalOpen,
  isShowSelectUserForm,
  setIsShowSelectUserForm,
  setIsCloseSelectUserModal, //to control not sending systemId and destUsrId when close select user modal
  setUser,
}: Props) => {
  
  return (
    <div
      className={`w-full ${
        isShowSelectUserForm ? "h-[300px]" : "h-full"
      } flex flex-col items-start justify-start md:justify-between md:items-center  gap-2 py-2 text-gray-600`}
    >
      <UserInfo
        users={users}
        isLoading={isLoadingUserList}
        setSelectedUser={setSelectedUser}
        onUserActiveChange={handleUserActiveChange}
        isLoadingDisableEnable={isLoadingDisableEnable}
        disableEnableResponse={disableEnableResponse}
        isDisableEnableModalOpen={isDisableEnableModalOpen}
        setIsDisableEnableModalOpen={setIsDisableEnableModalOpen}
        isShowSelectUserForm={isShowSelectUserForm}
        //setIsShowSelectUserForm={setIsShowSelectUserForm}
        //setIsCloseSelectUserModal={setIsCloseSelectUserModal} //to control not sending systemId and destUsrId when close select user modal
      />
      {isShowSelectUserForm && (
        <div className="w-full flex justify-end gap-2 text-sm">
          <ConfirmCancel
            onConfirm={() => {
              if (selectedUser) {
                setUser((prev) => ({
                  ...prev,
                  user: { id: selectedUser.id, title: selectedUser.nam } as DefaultOptionType,
                }));
                setIsShowSelectUserForm(false);
                setIsCloseSelectUserModal(true); //to control not sending systemId and destUsrId when close select user modal
              }
            }}
            onCancel={() => {
              setIsShowSelectUserForm(false);
              setIsCloseSelectUserModal(true); //to control not sending systemId and destUsrId when close select user modal
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserRegSelectUser;
