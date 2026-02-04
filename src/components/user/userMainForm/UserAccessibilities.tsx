import { Switch } from "@mui/material";
import Input from "../../controls/Input";
import Card from "../../controls/Card";

const UserAccessibilities = () => {
  return (
    <div className="w-1/2 flex flex-col gap-3 p-3 text-sm text-gray-600 h-[calc(100vh-150px)]">
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
          <p>--------------------------------</p>
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
