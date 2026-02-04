import PersianDatePicker from "../controls/PersianDatePicker";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";

type Props = {
  sendDate: Date | null;
  setSendDate: React.Dispatch<React.SetStateAction<Date | null>>;
  sendTtacSent: boolean;
  setSendTtacSent: React.Dispatch<React.SetStateAction<boolean>>;
  refetchFlowProductsSendAll: () => void;
};

const FlowProductsSendAllHeader = ({
  sendDate,
  setSendDate,
  sendTtacSent,
  setSendTtacSent,
  refetchFlowProductsSendAll,
}: Props) => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="w-full flex justify-center items-center gap-2">
        <label>تاریخ روز:</label>
        <div>
          <PersianDatePicker
            name="date"
            label="تاریخ روز:"
            value={sendDate}
            onChange={(event) => setSendDate(event.target.value as Date | null)}
          />
        </div>
        <input
          type="checkbox"
          onChange={(e) => setSendTtacSent(e.target.checked)}
          checked={sendTtacSent}
        />
        <label>ارسال شده</label>
      </div>
      <div
        className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
        onClick={refetchFlowProductsSendAll}
      >
        <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
        <p className="text-xs">بازخوانی</p>
      </div>
    </div>
  );
};

export default FlowProductsSendAllHeader;
