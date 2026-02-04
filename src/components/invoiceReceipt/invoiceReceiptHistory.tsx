import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { IndentDtlHistory } from "../../types/purchaseRequest";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtHistoryLoading: boolean;
  indentDtlHistoryResponse: IndentDtlHistory[];
  columnsHistory: any[];
};
const InvoiceReceiptHistory = ({
  showHistory,
  setShowHistory,
  isDtHistoryLoading,
  indentDtlHistoryResponse,
  columnsHistory,
}: Props) => {
  const { height, width } = useCalculateTableHeight();
  //console.log(indentDtlHistoryResponse.data.result.indentDtlHistories)
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق درخواست خرید"
      width="2/3"
      isCloseable={true}
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
            data={indentDtlHistoryResponse.map(
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

export default InvoiceReceiptHistory;
