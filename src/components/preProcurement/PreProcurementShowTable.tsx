import  { useEffect, useState } from "react";
import { Column } from "../../types/general";
import {
  DtlPreProcurementTable,
  PreProcurementResponse,
} from "../../types/preProcurement";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { convertToFarsiDigits, formatNumberWithCommas } from "../../utilities/general";

type Props = {
  preProcurementResponse: PreProcurementResponse;
  isLoadingPreProcurement: boolean;
  canEditForm: boolean;
};

const PreProcurementShowTable = ({
  preProcurementResponse,
  isLoadingPreProcurement,
  canEditForm,
}: Props) => {
  const columns: Column[] = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "کالا",
      accessor: "product",
      width: "35%",
    },
    {
      Header: "تعداد",
      accessor: "cntStr",
      width: "10%",
    },
    {
      Header: "آفر",
      accessor: "cntT",
      width: "10%",
    },
    {
      Header: "قیمت",
      accessor: "costStr",
      width: "10%",
    },
    {
      Header: "ارزش افزوده",
      accessor: "taxStr",
      width: "10%",
    },
    {
      Header: "تخفیف",
      accessor: "dcrmntStr",
      width: "10%",
    },
    {
      Header: "جمع",
      accessor: "totalStr",
      width: "10%",
    },
  ];
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [data, setData] = useState<DtlPreProcurementTable[]>([]);

  useEffect(() => {
    setData(
      preProcurementResponse.data.result.dtls.map((dtl, index) => ({
        ...dtl,
        product:
          convertToFarsiDigits(dtl.product) +
          "\n" +
          "-".repeat(dtl.product.length) +
          "\n" +
          convertToFarsiDigits(dtl.productExp),
        cntStr: convertToFarsiDigits(Number(dtl.cnt)),
        cntT: convertToFarsiDigits(Number(dtl.cntT)),
        costStr: convertToFarsiDigits(formatNumberWithCommas(Number(dtl.cost))),
        taxStr: convertToFarsiDigits(formatNumberWithCommas(Number(dtl.tax))),
        dcrmntStr: convertToFarsiDigits(formatNumberWithCommas(Number(dtl.dcrmnt))),
        totalStr: convertToFarsiDigits(formatNumberWithCommas(Number(dtl.total))),
        index: index + 1,
      }))
    );
  }, [preProcurementResponse.data.result.dtls]);

  return (
    <>
      {isLoadingPreProcurement ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <>
          <TTable
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            data={data}
            //fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            canEditForm={canEditForm}
          />
        </>
      )}
    </>
  );
};

export default PreProcurementShowTable;
