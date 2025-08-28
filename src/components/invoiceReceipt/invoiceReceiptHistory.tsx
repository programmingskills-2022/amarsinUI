import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { IndentDtlHistoryResponse } from "../../types/product";
import Skeleton from "../layout/Skeleton";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtHistoryLoading: boolean;
  indentDtlHistoryResponse: IndentDtlHistoryResponse;
  columnsHistory: any[];
};

const invoiceReceiptHistory = ({
  showHistory,
  setShowHistory,
  isDtHistoryLoading,
  indentDtlHistoryResponse,
  columnsHistory,
}: Props) => {
  const { height, width } = useCalculateTableHeight();
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق درخواست خرید"
      width="2/3"
    >
      {isDtHistoryLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <div
          className="mt-2 overflow-y-auto"
          style={width > 640 ? { height: height } : { height: "fit" }}
        >
          <TTable
            columns={columnsHistory}
            data={indentDtlHistoryResponse.data.result.indentDtlHistories.map(
              (item, index) => ({
                ...item,
                index: convertToFarsiDigits(index + 1),
                id: convertToFarsiDigits(item.id),
                dat: convertToFarsiDigits(item.dat),
                cnt: convertToFarsiDigits(formatNumberWithCommas(item.cnt)),
                offer: convertToFarsiDigits(item.offer),
                taxValue: convertToFarsiDigits(
                  formatNumberWithCommas(item.taxValue)
                ),
                dcrmnt: convertToFarsiDigits(
                  formatNumberWithCommas(item.dcrmnt)
                ),
                total: convertToFarsiDigits(formatNumberWithCommas(item.total)),
                dtlDsc: convertToFarsiDigits(item.dtlDsc),
                fmName: convertToFarsiDigits(item.fmName),
                fDsc: convertToFarsiDigits(item.fDsc),
              })
            )}
          />
        </div>
      )}
    </ModalForm>
  );
};

export default invoiceReceiptHistory;
