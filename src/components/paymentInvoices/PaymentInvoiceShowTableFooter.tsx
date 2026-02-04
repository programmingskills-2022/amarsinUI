import { convertToFarsiDigits, formatNumberWithCommas } from "../../utilities/general";
import Button from "../controls/Button";

type Props = {
  isLoadingPaymentInvoicesSave: boolean;
  handleSubmitSave: () => void;
  monthlyAvg: number;
  maxDueDate: string;
  canEditForm: boolean;
};

const PaymentInvoiceShowTableFooter = ({
  isLoadingPaymentInvoicesSave,
  handleSubmitSave,
  monthlyAvg,
  maxDueDate,
  canEditForm,
}: Props) => {
  return (
    <div className="flex gap-2 w-full">
      <div className="flex w-1/2 items-center justify-between">
        <p>میانگین ماهانه: {monthlyAvg===0 ? "-" : convertToFarsiDigits(formatNumberWithCommas(monthlyAvg))}</p>
        <p>حداکثر تاریخ سررسید مجاز: {maxDueDate==="" ? "-" : convertToFarsiDigits(maxDueDate)}</p>
      </div>
      {canEditForm && (
        <div className="flex w-1/2 justify-end">
          <Button
            text={
              isLoadingPaymentInvoicesSave
                ? "در حال ثبت اطلاعات..."
                : "ثبت اطلاعات"
            }
            backgroundColor="bg-green-500"
            color="text-white"
            backgroundColorHover="bg-green-600"
            colorHover="text-white"
            variant="shadow-lg w-48"
            onClick={handleSubmitSave}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentInvoiceShowTableFooter;
