import Add32 from "../../assets/images/GrayThem/add32.png";
//import Add24Disabled from "../../assets/images/GrayThem/add24_disabled.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import Del24 from "../../assets/images/GrayThem/del24.png";
import Edit24 from "../../assets/images/GrayThem/edit24.png";
import Accept24 from "../../assets/images/GrayThem/accept24.png";
import { FaRegCopy } from "react-icons/fa";
import UserReg from "./UserReg";
import ModalForm from "../layout/ModalForm";

type Props = {
  isNewUser: number;
  setIsNewUser: (isNewUser: number) => void;
  users: any[];
};
const UserHeader = ({ isNewUser, setIsNewUser, users }: Props) => {
  const handleNew = () => {
    setIsNewUser(1); // for new
  };
  const handleDelete = () => {
    console.log("delete");
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
        className="flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 
          cursor-pointer
      "
        onClick={handleDelete}
      >
        <img
          src={
            //selectedProductOffer === null || selectedProductOffer.flwId !== 0
            //? Del24Disabled
            //: Del24
            Del24
          }
          alt="Del24"
          className="w-6 h-6"
        />
        <p className="text-xs">غیرفعال</p>
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
        onClick={() => {
          console.log("confirm");
        }}
      >
        <img
          src={
            //selectedProductOffer === null || selectedProductOffer.flwId !== 0
            //? Accept24Disabled
            //: Accept24
            Accept24
          }
          alt="Accept24"
          className="w-6 h-6"
        />
        <p className="text-xs">ذخیره</p>
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
        onClick={() => {
          console.log("refresh");
        }}
      >
        <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
        <p className="text-xs">بازخوانی</p>
      </div>
      <ModalForm
        isOpen={isNewUser===1 || isNewUser===0}
        onClose={handleClose}
        title="تعریف کاربر"
        width="1/2"
      >
        <UserReg isNewUser={isNewUser} users={users} />
      </ModalForm>
    </div>
  );
};

export default UserHeader;
