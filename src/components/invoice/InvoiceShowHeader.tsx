import { convertToFarsiDigits } from "../../utilities/general";
import { InvoiceShowIdResponse } from "../../types/invoice";

type Props = {
  invoiceShowIdResponse: InvoiceShowIdResponse;
};

const InvoiceShowHeader = ({ invoiceShowIdResponse }: Props) => {

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-full flex">
          <label className="p-1 w-20 text-left">خریدار:</label>
          <input
            type="text"
            value={invoiceShowIdResponse.data.result.invoice.srName}
            disabled
            className="text-xs md:text-sm w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex">
          <label className="p-1 w-20 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              invoiceShowIdResponse.data.result.invoice.dat
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
            invoiceShowIdResponse.data.result.invoice.exp
          )}
          disabled
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      
    </div>
  );
};

export default InvoiceShowHeader;
