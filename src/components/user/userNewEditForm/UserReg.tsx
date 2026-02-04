import { useEffect, useState } from "react";
import { DefaultOptionType } from "../../../types/general";
import AutoCompleteSearch from "../../controls/AutoCompleteSearch";
import Input from "../../controls/Input";
import { RadioGroup } from "../../controls/RadioGroup";
import PersianDatePicker from "../../controls/PersianDatePicker";
import ConfirmCancel from "../../controls/ConfirmCancel";
import { FaSearch } from "react-icons/fa";
import ModalForm from "../../layout/ModalForm";
import UserRegSelectUser from "./UserRegSelectUser";
import { DisableEnableResponse } from "../../../types/user";

type Props = {
  isNewUser: number; // 1 for new, 0 for edit, -1 for close
  setIsNewUser: (isNewUser: number) => void;
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
  isSelectUserModalOpen: boolean;
  setIsSelectUserModalOpen: (isSelectUserModalOpen: boolean) => void;
  setIsCloseSelectUserModal: (isCloseSelectUserModal: boolean) => void;
};
export type UserFormData = {
  id: number;
  user: DefaultOptionType | null;
  username: string;
  password: string;
  title: string;
  orgUnit: string;
  image: string;
  fromDate: Date | null;
  toDate: Date | null;
};
const UserReg = ({
  isNewUser,
  setIsNewUser,
  users,
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
  setIsCloseSelectUserModal,//to control not sending systemId and destUsrId when close select user modal
}: Props) => {
  console.log(isNewUser);
  const [isUserEntered, setIsUserEntered] = useState(false);
  const [reportRangeChecked, setReportRangeChecked] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [user, setUser] = useState<UserFormData>({
    id: 0,
    user: null,
    username: "",
    password: "",
    title: "",
    orgUnit: "",
    image: "",
    fromDate: null,
    toDate: null,
  });

  const personalInfo = (
    <div className="w-full flex flex-col gap-2 text-sm">
      <AutoCompleteSearch
        label="پرسنل"
        labelWidth="w-24"
        setField={() => {}}
        fieldValues={[]}
        fieldSearch="title"
        selectedOption={null as unknown as DefaultOptionType}
        setSelectedOption={() => {}}
        options={[]}
        isEntered={false}
        setIsEntered={() => {}}
      />
      <div className="w-full flex flex-row gap-2 items-start justify-start">
        <div className="w-1/2 flex flex-col gap-2 items-start justify-center">
          <AutoCompleteSearch
            label="نوع پروفایل"
            labelWidth="w-24"
            setField={() => {}}
            fieldValues={[]}
            fieldSearch="username"
            selectedOption={null as unknown as DefaultOptionType}
            setSelectedOption={() => {}}
            options={users.map((user) => ({
              id: user.id,
              text: user.username,
            }))}
            isEntered={isUserEntered}
            setIsEntered={setIsUserEntered}
          />
          <Input
            label="شناسه:"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            textColor="text-gray-500"
            variant="outlined"
            placeholder="شناسه"
            required={true}
          />
          <Input
            label="مرکز:"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            textColor="text-gray-500"
            variant="outlined"
            placeholder="مرکز"
            required={true}
          />
          <Input
            label="نام:"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            textColor="text-gray-500"
            variant="outlined"
            placeholder="نام: "
            required={true}
          />
          <Input
            label="نام خانوادگی:"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            textColor="text-gray-500"
            variant="outlined"
            placeholder="نام: "
            required={true}
          />
          <Input
            label="کد ملی:"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            textColor="text-gray-500"
            variant="outlined"
            placeholder="نام: "
            required={true}
          />
        </div>
        <div className="w-1/2 flex flex-row gap-2 items-start justify-center">
          <div className="w-1/2 flex flex-col gap-2 items-start justify-start">
            <label>تصویر کاربر: </label>
            <Input
              type="file"
              value={user.image}
              onChange={(e) => setUser({ ...user, image: e.target.value })}
              widthDiv="w-full"
              widthLabel="w-32"
              widthInput="w-full"
              textColor="text-gray-500"
              variant="outlined"
              placeholder="تصویر کاربر"
              required={true}
            />
            <img
              src={user.image}
              alt="تصویر کاربر"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2 items-start justify-start">
            <label>امضاء کاربر: </label>
            <Input
              type="file"
              value={user.image}
              onChange={(e) => setUser({ ...user, image: e.target.value })}
              widthDiv="w-full"
              widthLabel="w-32"
              widthInput="w-full"
              textColor="text-gray-500"
              variant="outlined"
              placeholder="امضاء کاربر"
              required={true}
            />
            <img
              src={user.image}
              alt="امضاء کاربر"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex gap-2 items-start justify-start">
        <Input
          label="موبایل:"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          widthDiv="w-full"
          widthLabel="w-32"
          widthInput="w-full"
          textColor="text-gray-500"
          variant="outlined"
          placeholder="نام: "
          required={true}
        />
        <RadioGroup
          label="عنوان"
          labelWidth="w-40"
          options={[
            { label: "آقا", value: "male" },
            { label: "خانم", value: "female" },
            { label: "هیچکدام", value: "none" },
          ]}
          name="title"
          selectedValue="none"
          onChange={(value) => {
            console.log(value);
          }}
          className="w-full flex flex-row rounded-md border border-gray-300 p-1 justify-evenly"
        />
      </div>
    </div>
  );

  useEffect(() => {
    console.log(users);
  }, [users]);

  const handleClose = () => {
    setIsSelectUserModalOpen(false); // for close
  };

  return (
    <div className="w-full flex flex-col gap-2 text-sm">
      <div className="w-full flex flex-row gap-2 items-center justify-between">
        <AutoCompleteSearch
          label="کاربر اصلی"
          labelWidth="w-24"
          setField={() => {}}
          fieldValues={[]}
          fieldSearch="nam"
          selectedOption={user.user as DefaultOptionType}
          setSelectedOption={(option: any) => setUser({ ...user, user: option as DefaultOptionType })}
          options={users.map((user) => ({
            id: user.id,
            text: user.nam,
          }))}
          isEntered={isUserEntered}
          setIsEntered={setIsUserEntered}
        />
        <div
          className="flex flex-row gap-2 items-center justify-between border border-gray-300 rounded-md p-1 cursor-pointer"
          onClick={() => {
            setIsSelectUserModalOpen(true); // for open
          }}
        >
          <FaSearch className="text-xl text-gray-500 hover:text-blue-500" />
        </div>
      </div>
      <div className="w-full flex flex-row gap-2 items-center justify-between">
        <Input
          label="نام کاربر: "
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          widthDiv="w-1/2"
          widthLabel="w-32"
          widthInput="w-full"
          textColor="text-gray-500"
          variant="outlined"
          placeholder="نام کاربر"
          required={true}
        />
        <div className="w-1/2 flex flex-row gap-2 items-center justify-between">
          <div className="w-1/4 flex flex-row gap-2 items-center justify-between">
            <input
              type="checkbox"
              checked={isPasswordChanged}
              onChange={() => setIsPasswordChanged(!isPasswordChanged)}
            />
            <label>تغییر کلمه عبور</label>
          </div>
          <div className="w-3/4 flex flex-col gap-2 items-center justify-between">
            <Input
              type="password"
              label="کلمه عبور: "
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              widthDiv="w-full"
              widthLabel="w-32"
              widthInput="w-full"
              textColor="text-gray-500"
              variant="outlined"
              placeholder="کلمه عبور"
              required={true}
              disabled={!isPasswordChanged}
            />
            <Input
              type="password"
              label="تایید کلمه عبور: "
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              widthDiv="w-full"
              widthLabel="w-32"
              widthInput="w-full"
              textColor="text-gray-500"
              variant="outlined"
              placeholder="کلمه عبور"
              required={true}
              disabled={!isPasswordChanged}
            />
          </div>
        </div>
      </div>
      <AutoCompleteSearch
        label="سمت اصلی"
        labelWidth="w-24"
        setField={() => {}}
        fieldValues={[]}
        fieldSearch="title"
        selectedOption={null as unknown as DefaultOptionType}
        setSelectedOption={() => {}}
        options={[]}
        isEntered={false}
        setIsEntered={() => {}}
      />
      <AutoCompleteSearch
        label="سمت های فرعی"
        labelWidth="w-24"
        setField={() => {}}
        fieldValues={[]}
        fieldSearch="title"
        selectedOption={null as unknown as DefaultOptionType}
        setSelectedOption={() => {}}
        options={[]}
        isEntered={false}
        setIsEntered={() => {}}
      />
      <div className="flex items-center w-full justify-between gap-2">
        <p className="w-28 font-bold">مشخصات فردی</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      {/* مشخصات فردی */}
      {personalInfo}
      <div className="w-full flex flex-col items-center gap-2 text-sm">
        <div className="w-full flex flex-row gap-2 items-center justify-start">
          <input
            type="checkbox"
            checked={reportRangeChecked}
            onChange={() => setReportRangeChecked(!reportRangeChecked)}
          />
          <label>محدوده گزارش گیری:</label>
        </div>
        <div className="w-full flex flex-row items-center gap-2">
          <div className="w-1/2 flex items-center gap-2">
            <label className="w-32 text-left">از تاریخ:</label>
            <PersianDatePicker
              name="fromDate"
              label="از تاریخ"
              value={user.fromDate}
              fontSize="text-sm"
              onChange={(event) =>
                setUser({
                  ...user,
                  fromDate: event.target.value as Date | null,
                })
              }
              disabled={!reportRangeChecked}
            />
          </div>
          <div className="w-1/2 flex items-center gap-2">
            <label className="w-20 text-left">تا تاریخ:</label>
            <PersianDatePicker
              name="toDate"
              label="تا تاریخ"
              value={user.toDate}
              fontSize="text-sm"
              onChange={(event) =>
                setUser({ ...user, toDate: event.target.value as Date | null })
              }
              disabled={!reportRangeChecked}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end gap-2 text-sm">
        <ConfirmCancel
          onConfirm={() => {}}
          onCancel={() => {
            setIsNewUser(-1);
          }}
        />
      </div>
      <ModalForm
        isOpen={isSelectUserModalOpen}
        onClose={handleClose}
        title="انتخاب کاربر"
        width="1"
        height="50%"
      >
        <UserRegSelectUser
          users={users}
          isLoadingUserList={isLoadingUserList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleUserActiveChange={handleUserActiveChange}
          isLoadingDisableEnable={isLoadingDisableEnable}
          disableEnableResponse={disableEnableResponse}
          isDisableEnableModalOpen={isDisableEnableModalOpen}
          setIsDisableEnableModalOpen={setIsDisableEnableModalOpen}
          isShowSelectUserForm={isSelectUserModalOpen}
          setIsShowSelectUserForm={setIsSelectUserModalOpen}
          setIsCloseSelectUserModal={setIsCloseSelectUserModal}//to control not sending systemId and destUsrId when close select user modal
          setUser={setUser}//to set user in parent component
        />
      </ModalForm>
    </div>
  );
};

export default UserReg;
