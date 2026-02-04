import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import { convertToFarsiDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import { TableColumns } from "../../types/general";
import Accept from "../../assets/images/GrayThem/img24_3.png";
import { ProductPriceDtlHistory } from "../../types/productPrice";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtlHistoryLoading: boolean;
  productPriceDtlHistory: ProductPriceDtlHistory[];
  columnsHistory: TableColumns;
};

const ProductPriceFormListHistory = ({
  showHistory,
  setShowHistory,
  isDtlHistoryLoading,
  productPriceDtlHistory,
  columnsHistory,
}: Props) => {
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق قیمت"
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
            data={productPriceDtlHistory?.map((item, index) => ({
              ...item,
              index: convertToFarsiDigits(index + 1),
              id: convertToFarsiDigits(item.id),
              date: convertToFarsiDigits(item.date),
              p1: convertToFarsiDigits(item.p1),
              p2: convertToFarsiDigits(item.p2),
              p3: convertToFarsiDigits(item.p3),
              p4: convertToFarsiDigits(item.p4),
              p5: convertToFarsiDigits(item.p5),
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

export default ProductPriceFormListHistory;
