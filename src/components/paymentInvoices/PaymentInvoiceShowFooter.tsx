import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { InvoiceOutstandingWithIndex } from "../../types/paymentInvoice";

type Props = { data: InvoiceOutstandingWithIndex[]; isEqualSum: boolean };

const PaymentInvoiceShowFooter = ({ data, isEqualSum }: Props) => {
  return (
    <div
      className="w-full h-6 flex justify-center md:justify-end items-center text-gray-800"
      style={{
        fontSize: "12px",
        border: "1px solid lightgray",
      }}
    >
      <div className="md:w-[7%] md:h-full border border-x-gray-300 bg-gray-200">
        <p>
           {convertToFarsiDigits(
            formatNumberWithCommas(
              data.reduce((acc: number, row: any) => acc + row.rem, 0)
            )
          )}
        </p>
      </div>
      <div className="md:w-[7%] md:h-full border border-x-gray-300 bg-gray-200">
        <p className={isEqualSum ? "bg-green-50" : "inherit"}>
           {convertToFarsiDigits(
            formatNumberWithCommas(
              data.reduce((acc: number, row: any) => acc + row.amnt, 0)
            )
          )}
        </p>
      </div>
      <div className="md:w-[2%] md:h-full border border-x-gray-300 bg-gray-200">
      </div>
    </div>
  );
};

export default PaymentInvoiceShowFooter;
