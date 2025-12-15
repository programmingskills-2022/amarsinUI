import Add32 from "../../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import Edit24 from "../../../assets/images/GrayThem/edit24.png";
import { FaRegCopy } from "react-icons/fa";
import UserReg from "../userNewEditForm/UserReg";
import ModalForm from "../../layout/ModalForm";
import { DisableEnableResponse } from "../../../types/user";

type Props = {
  isNewUser: number;
  setIsNewUser: (isNewUser: number) => void;
  users: any[];
  refetchUserList: () => void;
  refetchUserPerms: () => void;
  isLoadingUserList: boolean;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  handleUserActiveChange: (userId: number, setCurrentUserId: React.Dispatch<React.SetStateAction<number>>) => void;
  isLoadingDisableEnable: boolean;
  disableEnableResponse: DisableEnableResponse;
  isDisableEnableModalOpen: boolean;
  setIsDisableEnableModalOpen: (isModalOpen: boolean) => void;
  isSelectUserModalOpen: boolean;
  setIsSelectUserModalOpen: (isSelectUserModalOpen: boolean) => void;
  setIsCloseSelectUserModal: (isCloseSelectUserModal: boolean) => void;//to control not sending systemId and destUsrId when close select user modal
};
const UserHeader = ({
  isNewUser,
  setIsNewUser,
  users,
  refetchUserList,
  refetchUserPerms,
  isLoadingUserList,
  selectedUser,
  setSelectedUser,
  handleUserActiveChange,
  isLoadingDisableEnable,
  disableEnableResponse,
  isDisableEnableModalOpen,
  setIsDisableEnableModalOpen,
  isSelectUserModalOpen,
  setIsSelectUserModalOpen,
  setIsCloseSelectUserModal,
}: Props) => {
  const handleNew = () => {
    setIsNewUser(1); // for new
  };
  const handleEdit = () => {
    setIsNewUser(0); // for edit
    console.log("edit");
  };
  const handleConfirm = () => {
    console.log("confirm");
  };
  const handleClose = () => {
    setIsNewUser(-1); // for close
  };
  const handleRefresh = () => {
    refetchUserList();
    refetchUserPerms();
  };
  ////////////////////////////////////////////////////////
  return (
    <div className="flex px-4 items-center gap-4">
      <div
        className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
        onClick={handleNew} // for new
      >
        <img src={Add32} alt="Add32" className="w-6 h-6" />
        <p className="text-xs">جدید</p>
      </div>
      <div
        className="flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 cursor-pointer"
        onClick={handleEdit} // for edit
      >
        <img
          src={
            //selectedProductOffer === null || selectedProductOffer.flwId !== 0
            //? Edit24Disabled
            //: Edit24
            Edit24
          }
          alt="Edit24"
          className="w-6 h-6"
        />
        <p className="text-xs">ویرایش</p>
      </div>
      <div
        className="flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 cursor-pointer"
        onClick={handleConfirm}
      >
        <FaRegCopy className="w-6 h-6" color="gray" />
        <p className="text-xs">کپی دسترسی از...</p>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
        onClick={handleRefresh}
      >
        <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
        <p className="text-xs">بازخوانی</p>
      </div>
      <ModalForm
        isOpen={isNewUser === 1 || isNewUser === 0}
        onClose={handleClose}
        title="تعریف کاربر"
        width="1/2"
      >
        <UserReg
          isNewUser={isNewUser}
          setIsNewUser={setIsNewUser}
          users={users}
          isLoadingUserList={isLoadingUserList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleUserActiveChange={handleUserActiveChange}
          isLoadingDisableEnable={isLoadingDisableEnable}
          disableEnableResponse={disableEnableResponse}
          isDisableEnableModalOpen={isDisableEnableModalOpen}
          setIsDisableEnableModalOpen={setIsDisableEnableModalOpen}
          isSelectUserModalOpen={isSelectUserModalOpen}
          setIsSelectUserModalOpen={setIsSelectUserModalOpen}
          setIsCloseSelectUserModal={setIsCloseSelectUserModal}//to control not sending systemId and destUsrId when close select user modal
        />
      </ModalForm>
    </div>
  );
};

export default UserHeader;
