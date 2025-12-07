import { Switch } from "@mui/material";
import Input from "../controls/Input";
import Card from "../controls/Card";
import PermissionsInfo from "./PermissionsInfo";
import { useUserStore } from "../../store/userStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { useEffect } from "react";

type Props = {
  permissions: any[];
  isLoading: boolean;
};
const UserAccessibilities = ({ permissions, isLoading }: Props) => {
  const {setField : setPermissionField}= useUserStore()
  const {systemId} = useGeneralContext()
  ////////////////////////////////////////////////////////
  useEffect(() => {
    setPermissionField("systemId", systemId)
    setPermissionField("destUsrId", 0)
  }, [systemId])
  ////////////////////////////////////////////////////////
  return (
    <div className="w-1/2 flex flex-col gap-3 p-3 text-sm text-gray-600 h-full">
      <div className="w-full flex justify-end">
        <Input
          label="جستجو:"
          placeholder="جستجو"
          widthDiv="w-full"
          widthInput="w-full"
        />
        <Switch
          checked={true}
          onChange={(e) => console.log(e.target.checked)}
          color="primary"
          size="small"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2 h-full">
        <Card border="none" padding="none" className="w-1/2 h-full">
          <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
            منوهای نرم افزار
          </div>
          <PermissionsInfo permissions={permissions} isLoading={isLoading} />
        </Card>
        <div className="w-1/2 flex flex-col gap-2 h-full">
          <Card border="none" padding="none" className="w-full h-1/4">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              سیستم
            </div>
            <p>---------</p>
          </Card>
          <Card border="none" padding="none" className="w-full h-1/2">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              چارت سازمانی
            </div>
            <p>gshagsh</p>
          </Card>
          <Card border="none" padding="none" className="w-full h-1/4">
          <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              قیمت فروش
            </div>
            <p>gshagsh</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserAccessibilities;
