import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import { convertToFarsiDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import { TableColumns } from "../../types/general";
import Accept from "../../assets/images/GrayThem/img24_3.png";
import { ProductGraceDtlHistory } from "../../types/productGrace";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtlHistoryLoading: boolean;
  productGraceDtlHistory: ProductGraceDtlHistory[];
  columnsHistory: TableColumns;
};

const ProductGraceFormListHistory = ({
  showHistory,
  setShowHistory,
  isDtlHistoryLoading,
  productGraceDtlHistory,
  columnsHistory,
}: Props) => {
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق فرجه-پورسانت"
      width="1/2"
      isCloseable={true}
    >
      {isDtlHistoryLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <div className="mt-2 overflow-y-auto">
          <TTable
            fontSize="14px"
            columns={columnsHistory}
            data={productGraceDtlHistory?.map((item, index) => ({
              ...item,
              index: convertToFarsiDigits(index + 1),
              id: convertToFarsiDigits(item.id),
              date: convertToFarsiDigits(item.date),
              accepted: item.accepted ? (
                <img src={Accept} alt="تایید شده" />
              ) : null,
              //np: item.np ? <img src={Accept} alt="نیاز به مجوز" /> : null,
              dtlDsc: convertToFarsiDigits(item.dtlDsc),
            }))}
          />
        </div>
      )}
    </ModalForm>
  );
};

export default ProductGraceFormListHistory;
