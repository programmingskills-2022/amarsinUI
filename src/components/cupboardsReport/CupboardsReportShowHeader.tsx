import { convertToFarsiDigits } from "../../utilities/general";

type Props = {
  errId: number;
  setErrId: React.Dispatch<React.SetStateAction<number>>;
  err: boolean;
  setErr: React.Dispatch<React.SetStateAction<boolean>>;
  existsCupboards: boolean;
  setExistsCupboards: React.Dispatch<React.SetStateAction<boolean>>;
};
const CupboardsReportShowHeader = ({
  errId,
  setErrId,
  err,
  setErr,
  existsCupboards,
  setExistsCupboards,
}: Props) => {
  const options = [
    { num: 0, value: "همه" },
    { num: 1, value: "1- یو آی دی اشتباه است" },
    { num: 2, value: "2- فراورده مورد نظر پیدا نشد" },
    { num: 3, value: "3- یو آی دی پیدا نشد" },
    { num: 4, value: "4- این فراورده در سامانه صدور پروانه پیدا نشد" },
    {
      num: 10,
      value: "10- مسئول فنی، اجازه توزیع و فروش این فراورده را صادر نکرده است.",
    },
    {
      num: 11,
      value:
        "11- این فراورده ریکال شده است. از توزیع، فروش یا مصرف آن خودداری شود.",
    },
    {
      num: 12,
      value:
        "12- این فراورده منقضی شده است. از توزیع، فروش یا مصرف آن خودداری شود.",
    },
    { num: 120, value: "120- وضعیت آی آر سی نامشخص." },
  ];

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrId(Number(e.target.value));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr(e.target.checked);
  };

  const handleExistsCupboardsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExistsCupboards(e.target.checked);
  };

  return (
    <div className="w-full flex justify-start items-center gap-2 text-sm p-2">
      <div className="w-40 flex items-center justify-end gap-2">
        <input type="checkbox" onChange={handleCheckboxChange} checked={err} />
        <label>نمایش خطادارها</label>
      </div>
      <select
        className="w-full rounded-md p-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        onChange={handleDropdownChange}
        value={errId}
        disabled={!err}
      >
        {options.map((option, index) => (
          <option key={index} value={option.num}>
            {convertToFarsiDigits(option.value)}
          </option>
        ))}
      </select>
      <div className="w-40 flex items-center gap-2">
        <input
          type="checkbox"
          onChange={handleExistsCupboardsChange}
          checked={existsCupboards}
        />
        <label>قفسه های موجود</label>
      </div>
    </div>
  );
};

export default CupboardsReportShowHeader;
