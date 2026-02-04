import Button from "../controls/Button";
import ConfirmCard from "../layout/ConfirmCard";

type Props = {
  isLoadingWarehouseTemporaryReceiptPurchaseReg: boolean;
  handleSubmit: () => void;
};

const ReceiptPurchaseShowFooter = ({ isLoadingWarehouseTemporaryReceiptPurchaseReg, handleSubmit }: Props) => {
  return (
    <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md">
      {
        <div className="flex w-full text-sm gap-2">
          <div className="flex justify-end w-full items-end">
            <Button
              text={isLoadingWarehouseTemporaryReceiptPurchaseReg ? "در حال ثبت اطلاعات..." : "ثبت اطلاعات"}
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

export default ReceiptPurchaseShowFooter;
