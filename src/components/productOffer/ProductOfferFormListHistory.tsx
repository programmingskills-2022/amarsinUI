import TTable from "../controls/TTable";
import ModalForm from "../layout/ModalForm";
import { convertToFarsiDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import { ProductOfferDtlHistory } from "../../types/productOffer";
import { TableColumns } from "../../types/general";
import Accept from "../../assets/images/GrayThem/img24_3.png";

type Props = {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  isDtlHistoryLoading: boolean;
  productOfferDtlHistory: ProductOfferDtlHistory[];
};

const ProductOfferFormListHistory = ({
  showHistory,
  setShowHistory,
  isDtlHistoryLoading,
  productOfferDtlHistory,
}: Props) => {
  const columnsHistory: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "تغییر",
      accessor: "date",
      width: "10%",
    },
    {
      Header: "تایید",
      accessor: "accepted",
      width: "5%",
    },
    {
      Header: "پ 1",
      accessor: "s1O",
      width: "10%",
    },
    {
      Header: "پ 2",
      accessor: "s2O",
      width: "10%",
    },
    {
      Header: "پ 3",
      accessor: "s3O",
      width: "10%",
    },
    {
      Header: "پ 4",
      accessor: "s4O",
      width: "10%",
    },
    {
      Header: "پ 5",
      accessor: "s5O",
      width: "10%",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "25%",
    },
    {
      Header: "بدون آفر",
      accessor: "no",
      width: "5%",
    },
  ];  
  return (
    <ModalForm
      isOpen={showHistory}
      onClose={() => setShowHistory(false)}
      title="سوابق آفر"
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
            data={productOfferDtlHistory?.map((item, index) => ({
              ...item,
              index: convertToFarsiDigits(index + 1),
              id: convertToFarsiDigits(item.id),
              date: convertToFarsiDigits(item.date),
              accepted: item.accepted ? (
                <img src={Accept} alt="تایید شده" />
              ) : null,
              s1O:
                item.s1DO + item.s1NO > 0
                  ? convertToFarsiDigits(
                      item.s1DO.toString() + "+" + item.s1NO.toString()
                    )
                  : null,
              s2O:
                item.s2DO + item.s2NO > 0
                  ? convertToFarsiDigits(
                      item.s2DO.toString() + "+" + item.s2NO.toString()
                    )
                  : null,
              s3O:
                item.s3DO + item.s3NO > 0
                  ? convertToFarsiDigits(
                      item.s3DO.toString() + "+" + item.s3NO.toString()
                    )
                  : null,
              s4O:
                item.s4DO + item.s4NO > 0
                  ? convertToFarsiDigits(
                      item.s4DO.toString() + "+" + item.s4NO.toString()
                    )
                  : null,
              s5O:
                item.s5DO + item.s5NO > 0
                  ? convertToFarsiDigits(
                      item.s5DO.toString() + "+" + item.s5NO.toString()
                    )
                  : null,
              no: item.no ? <img src={Accept} alt="بدون آفر" /> : null,
              dtlDsc: convertToFarsiDigits(item.dtlDsc),
            }))}
          />
        </div>
      )}
    </ModalForm>
  );
};

export default ProductOfferFormListHistory;
