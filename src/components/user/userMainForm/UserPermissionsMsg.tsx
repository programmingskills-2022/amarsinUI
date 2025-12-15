import { AddRemovePermissionResponse } from "../../../types/user";
import ModalMessage from "../../layout/ModalMessage";

type Props = {
  isOpen: boolean;
  response: AddRemovePermissionResponse;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserPermissionsMsg = ({ isOpen, response, setIsOpen }: Props) => {
  return (
    <ModalMessage
      isOpen={isOpen}
      backgroundColor={
        response.meta.errorCode <= 0 ? "bg-green-200" : "bg-red-200"
      }
      bgColorButton={
        response.meta.errorCode <= 0 ? "bg-green-500" : "bg-red-500"
      }
      bgColorButtonHover={
        response.meta.errorCode <= 0 ? "bg-green-600" : "bg-red-600"
      }
      color="text-white"
      onClose={() => setIsOpen(false)}
      message={response.meta.message ?? ""}
      visibleButton={false}
    />
  );
};

export default UserPermissionsMsg;
