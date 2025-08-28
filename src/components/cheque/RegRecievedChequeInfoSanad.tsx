import Input from "../controls/Input";

type Props = {
  sanadNum: string;
  setSanadNum: (sanadNo: string) => void;
  sanadDate: string;
  setSanadDate: (sanadDate: string) => void;
  //payKind: number;
  //canEditForm: boolean;
  updateCheque: (fieldName: string, value: string) => void;
  showValidationError: (fieldName: string) => React.ReactNode;
};

const RegRecievedChequeInfoSanad = ({
  sanadNum,
  setSanadNum,
  sanadDate,
  setSanadDate,
  //payKind,
  //canEditForm,
  updateCheque,
  showValidationError,
}: Props) => {
  return (
    <div className="flex flex-col w-full mt-2 gap-2">
      <div className="flex items-center justify-center w-full">
        <p className="text-sm text-gray-600 w-32">سند حسابداری</p>
        <div className="border-b-2 border-gray-300 rounded-md w-full"></div>
      </div>
      <div className="flex items-center justify-center w-full">
        <Input
          label="شماره سند:"
          widthDiv="w-full"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          name="sanadNo"
          value={sanadNum}
          onChange={(e) => setSanadNum(e.target.value)}
          variant="outlined"
          disabled={true}
        />
        <div className="flex w-full justify-center items-center gap-2">
          <Input
            label="تاریخ سند:"
            name="sanadDate"
            value={sanadDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSanadDate(e.target.value)
            }
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateCheque("sanadDate", e.target.value)
            }
            widthDiv="w-full"
            widthLabel="w-24"
            widthInput="w-full-minus-24"
            variant="outlined"
            //placeholder="اینجا را کلیک کنید..."
            disabled={true}
          />
          {showValidationError("sanadDate")}
        </div>
      </div>
    </div>
  );
};

export default RegRecievedChequeInfoSanad;
