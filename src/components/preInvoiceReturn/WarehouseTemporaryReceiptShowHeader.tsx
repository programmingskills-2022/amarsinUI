import { convertToFarsiDigits } from "../../utilities/general";
import { ResultWarehouseTemporaryReceiptShow } from "../../types/preInvoiceReturn";

type Props = {
  warehouseTemporaryReceiptShowResponse: ResultWarehouseTemporaryReceiptShow
};

const InvoiceWarehouseTemporaryReceiptShowHeader = ({
  warehouseTemporaryReceiptShowResponse
}: Props) => {

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-full flex">
          <label className="p-1 w-20 text-left">خریدار:</label>
          <input
            type="text"
            value={
              warehouseTemporaryReceiptShowResponse.preInvoiceReturn.srName
            }
            disabled
            className="text-xs md:text-sm w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex">
          <label className="p-1 w-20 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              warehouseTemporaryReceiptShowResponse.preInvoiceReturn.dat
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex">
        <label className="p-1 w-20 text-left">توضیحات:</label>
        <input
          type="text"
          value={convertToFarsiDigits(
            warehouseTemporaryReceiptShowResponse.preInvoiceReturn.exp
          )}
          disabled
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default InvoiceWarehouseTemporaryReceiptShowHeader;
