import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import { convertToFarsiDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import { TableColumns } from "../../types/general";
import Accept from "../../assets/images/GrayThem/img24_3.png";
import { ProductPermDtlHistory } from "../../types/productPerm";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtlHistoryLoading: boolean;
  productPermDtlHistory: ProductPermDtlHistory[];
  columnsHistory: TableColumns;
};

const ProductPermFormListHistory = ({
  showHistory,
  setShowHistory,
  isDtlHistoryLoading,
  productPermDtlHistory,
  columnsHistory,
}: Props) => {
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق آفر"
      width="1/2"
    >
      {isDtlHistoryLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <div className="mt-2 overflow-y-auto">
          <TTable
            fontSize="14px"
            columns={columnsHistory}
            data={productPermDtlHistory?.map((item, index) => ({
              ...item,
              index: convertToFarsiDigits(index + 1),
              id: convertToFarsiDigits(item.id),
              date: convertToFarsiDigits(item.date),
              accepted: item.accepted ? (
                <img src={Accept} alt="تایید شده" />
              ) : null,
              np: item.np ? <img src={Accept} alt="نیاز به مجوز" /> : null,
              dtlDsc: convertToFarsiDigits(item.dtlDsc),
            }))}
          />
        </div>
      )}
    </ModalForm>
  );
};

export default ProductPermFormListHistory;
