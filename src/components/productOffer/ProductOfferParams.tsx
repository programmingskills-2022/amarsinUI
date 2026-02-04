import Checkbox from "../controls/Checkbox";
import PersianDatePicker from "../controls/PersianDatePicker";
import { useEffect, useState } from "react";
import ModalMessage from "../layout/ModalMessage";

type Props = {
  regFDate: Date | null;
  setRegFDate: (date: Date | null) => void;
  regTDate: Date | null;
  setRegTDate: (date: Date | null) => void;
  fDate: Date | null;
  setFDate: (date: Date | null) => void;
  tDate: Date | null;
  setTDate: (date: Date | null) => void;
  setState: (state: number) => void;
};

const ProductOfferParams = ({
  regFDate,
  setRegFDate,
  regTDate,
  setRegTDate,
  fDate,
  setFDate,
  tDate,
  setTDate,
  setState,
}: Props) => {
  const [hasRegDate, setHasRegDate] = useState<boolean>(true);
  const [hasFDate, setHasFDate] = useState<boolean>(false);

  useEffect(() => {
    handleCheckboxChange(
      { target: { name: "DateCheckbox", value: true } },
      setRegFDate,
      setRegTDate,
      setHasRegDate
    );
  }, []);

  const handleCheckboxChange = (
    event: {
      target: { name: string; value: boolean };
    },
    setDate1: (date: Date | null) => void,
    setDate2: (date: Date | null) => void,
    setHasDate: (value: boolean) => void
  ) => {
    if (event.target.value === true) {
      setDate1(new Date());
      setDate2(new Date());
    } else {
      setDate1(null);
      setDate2(null);
    }
    setHasDate(event.target.value);
  };

  const handleDateChange = (
    event: {
      target: { name: string; value: Date | null };
    },
    setDate1: (date: Date | null) => void,
    setDate2: (date: Date | null) => void,
    date1: Date | null
  ) => {
    if (event.target.name === "startDate") {
      setDate1(event.target.value);
    } else {
      if (event.target.value && date1 && event.target.value < date1) {
        setIsModalOpen(true);
        return;
      }
      setDate2(event.target.value);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);
  return (
    <div className="w-full flex flex-col items-center gap-2 mb-2 border-gray-300 border-2 rounded-md p-2 h-full text-sm">
      {/* reg */}
      <div className="w-full flex">
        <div className="w-full flex items-center gap-2">
          <Checkbox
            name="DateCheckbox"
            onChange={(event) =>
              handleCheckboxChange(
                event,
                setRegFDate,
                setRegTDate,
                setHasRegDate
              )
            }
            value={hasRegDate}
          />
          <label className="w-8 text-left">ثبت:</label>
          <PersianDatePicker
            name="startDate"
            label="از:"
            value={regFDate}
            fontSize="text-sm"
            onChange={(event) =>
              handleDateChange(event, setRegFDate, setRegTDate, regFDate)
            }
            disabled={!hasRegDate}
          />
        </div>
        <div className="w-full flex items-center gap-2">
          <label className="w-8 text-left">تا:</label>
          <PersianDatePicker
            name="endDate"
            label="تا:"
            value={regTDate}
            fontSize="text-sm"
            onChange={(event) =>
              handleDateChange(event, setRegFDate, setRegTDate, regFDate)
            }
            disabled={!hasRegDate}
          />
        </div>
      </div>
      {/* form */}
      <div className="w-full flex">
        <div className="w-full flex items-center gap-2">
          <Checkbox
            name="DateCheckbox"
            onChange={(event) =>
              handleCheckboxChange(event, setFDate, setTDate, setHasFDate)
            }
            value={hasFDate}
          />
          <label className="w-8 text-left">فرم:</label>
          <PersianDatePicker
            name="startDate"
            label="از:"
            value={fDate}
            fontSize="text-sm"
            onChange={(event) =>
              handleDateChange(event, setFDate, setTDate, fDate)
            }
            disabled={!hasFDate}
          />
        </div>
        <div className="w-full flex items-center gap-2">
          <label className="w-8 text-left">تا:</label>
          <PersianDatePicker
            name="endDate"
            label="تا:"
            value={tDate}
            fontSize="text-sm"
            onChange={(event) =>
              handleDateChange(event, setFDate, setTDate, fDate)
            }
            disabled={!hasFDate}
          />
        </div>
      </div>
      {/* send status */}
      <div className="w-full flex gap-2">
        <input
          type="radio"
          name="sendStatus"
          id="sendStatus"
          onChange={() => setState(-1)}
          defaultChecked={true}
        />
        <label htmlFor="sendStatus">ارسال نشده</label>
        <input
          type="radio"
          name="sendStatus"
          id="sendStatus"
          onChange={() => setState(1)}
        />
        <label htmlFor="sendStatus">ارسال شده</label>
        <input
          type="radio"
          name="sendStatus"
          id="sendStatus"
          onChange={() => setState(0)}
        />
        <label htmlFor="sendStatus">همه</label>
      </div>
      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="تاریخ انتخابی باید بیشتر از تاریخ شروع باشد."
        visibleButton={false}
        backgroundColor="bg-red-200"
        color="text-white"
      />
    </div>
  );
};

export default ProductOfferParams;
