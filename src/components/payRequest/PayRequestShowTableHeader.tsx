import { colors } from "../../utilities/color";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";

type Props = {
  //for tab 0
  totalRem: number;
  sumRem: number;
  //for tab 1
  remSumTab1: number;
  sumStatus: string;
  //for tab 2
  amountTab2: number;
  activeTab: number;
  setActiveTab: (tab: number) => void;
};

const PayRequestShowTableHeader = ({
  totalRem,
  sumRem,
  remSumTab1,
  sumStatus,
  amountTab2,
  activeTab,
  setActiveTab,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex w-full mt-2 text-sm items-center justify-center text-gray-500">
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 0 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 0 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 0 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(0)}
        >
          <div className="flex items-center justify-center">
            <p>فاکتورهای باز:</p>
            <p className="mx-2">
              {convertToFarsiDigits(formatNumberWithCommas(sumRem))}
            </p>
            <p>{"/"}</p>
            <p className="mx-2">
              {convertToFarsiDigits(formatNumberWithCommas(totalRem))}
            </p>
          </div>
        </div>
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 1 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 1 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 1 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(1)}
        >
          <div className="flex items-center justify-center">
            <p>مانده حساب:</p>
            <p className="mx-2">
              {convertToFarsiDigits(formatNumberWithCommas(remSumTab1))}
            </p>
            <p className="mx-2">({sumStatus})</p>
          </div>
        </div>
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 2 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 2 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 2 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(2)}
        >
          <div className="flex items-center justify-center">
            <p>لیست چکها:</p>
            <p className="mx-2">
              {convertToFarsiDigits(formatNumberWithCommas(amountTab2))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayRequestShowTableHeader;
