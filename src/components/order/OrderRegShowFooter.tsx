import Button from "../controls/Button";
import Input from "../controls/Input";
import ConfirmCard from "../layout/ConfirmCard";

type Props = {
  isLoadingOrderReg: boolean;
  dsc: string;
  setDsc: (dsc: string) => void;
  footerDescTxt: string;
  setFooterDescTxt: (footerDescTxt: string) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const OrderRegShowFooter = ({ isLoadingOrderReg, dsc, setDsc, footerDescTxt, setFooterDescTxt, handleSubmit }: Props) => {
  return (
    <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md">
      {
        <div className="flex w-full text-sm gap-2">
          <div className="flex w-2/3 flex-col justify-between items-center gap-2">
            <textarea
              className="p-1 text-sm border border-slate-300 rounded-md w-full"
              value={footerDescTxt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFooterDescTxt(e.target.value)
              }
            />
            <Input
              name="dsc"
              label="شرح:"
              value={dsc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDsc(e.target.value)
              }
              widthDiv="w-full"
              widthInput="w-full"
              variant="outlined"
            />
          </div>
          <div className="flex justify-end w-1/3 items-end">
            <Button
              text={isLoadingOrderReg ? "در حال ثبت اطلاعات..." : "ثبت اطلاعات"}
              backgroundColor="bg-green-500"
              color="text-white"
              backgroundColorHover="bg-green-600"
              colorHover="text-white"
              variant="shadow-lg w-48 h-10"
              onClick={handleSubmit}
            />
          </div>
        </div>
      }
    </ConfirmCard>
  );
};

export default OrderRegShowFooter;
