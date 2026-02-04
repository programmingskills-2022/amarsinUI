type Props = {
  hasErr: boolean;
  setHasErr: React.Dispatch<React.SetStateAction<boolean>>;
};
const GetInventoryBalanceShowHeader = ({
  hasErr,
  setHasErr,
}: Props) => {


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasErr(e.target.checked);
  };

  return (
    <div className="w-fullflex justify-center items-center gap-2 text-sm p-2">
      <div className="flex items-center justify-center gap-2">
        <input type="checkbox" onChange={handleCheckboxChange} checked={hasErr} />
        <label>نمایش خطادارها</label>
      </div>
    </div>
  );
};

export default GetInventoryBalanceShowHeader;
