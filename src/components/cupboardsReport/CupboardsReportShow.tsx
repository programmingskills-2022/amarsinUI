//گزارش بچ ها 
import {  useState, useEffect } from "react";
import CupboardsReportShowHeader from "./CupboardsReportShowHeader";
import { useCupboardsReportStore } from "../../store/cupboardsReportStore";
import { useGeneralContext } from "../../context/GeneralContext";
import CupboardsReportShowTable from "./CupboardsReportShowTable";
import { TableColumns } from "../../types/general";
import { WarehouseTemporaryReceiptIndentDtl } from "../../types/warehouse";
import { CupboardsReportResponse } from "../../types/cupboardsReport";

type Props = {
  cupboardsReportResponse: CupboardsReportResponse;
  isLoadingCupboardsReport: boolean;
  data: any;
  columns: TableColumns;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  statusClicked:boolean;
  setStatusClicked: (value: React.SetStateAction<boolean>) => void
  checkSeekingInfo:boolean
  setCheckSeekingInfo: (checkSeekingInfo: boolean) => void
  selectedProduct:WarehouseTemporaryReceiptIndentDtl | null
  setSelectedProduct: (selectedProduct: WarehouseTemporaryReceiptIndentDtl | null) => void
  selectedRowIndex:number
  setSelectedRowIndex: (selectedRowIndex: number) => void
  uid:string | undefined
  setUid: (uid: string | undefined) => void
};

const CupboardsReportShow = ({
  cupboardsReportResponse,
  isLoadingCupboardsReport,
  data,
  columns,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  statusClicked,
  setStatusClicked,
  checkSeekingInfo,
  setCheckSeekingInfo,
  selectedProduct,
  setSelectedProduct,
  selectedRowIndex,
  setSelectedRowIndex,
  uid,
  setUid
}: Props) => {
  const { setField: setCupboardsReportField } = useCupboardsReportStore();
  const { systemId, yearId } = useGeneralContext();
  const [errId, setErrId] = useState<number>(0);
  const [err, setErr] = useState<boolean>(true);
  const [existsCupboards, setExistsCupboards] = useState<boolean>(true);

 //////////////////////////////////////////////////////////////
  useEffect(() => {
    setCupboardsReportField("errId", errId);
    setCupboardsReportField("err", err);
    setCupboardsReportField("existsCupboards", existsCupboards);
    setCupboardsReportField("systemId", systemId);
    setCupboardsReportField("yearId", yearId);
    setCupboardsReportField("pageNumber", pageNumber);
  }, [errId, err, existsCupboards, systemId, yearId, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [yearId, systemId, errId, err, existsCupboards]);

  return (
    <div>
      <CupboardsReportShowHeader
        errId={errId}
        setErrId={setErrId}
        err={err}
        setErr={setErr}
        existsCupboards={existsCupboards}
        setExistsCupboards={setExistsCupboards}
      />
      <CupboardsReportShowTable
        isLoading={isLoadingCupboardsReport}
        columns={columns}
        data={data}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={cupboardsReportResponse.data.total_count ?? 0}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        statusClicked={statusClicked}
        setStatusClicked={setStatusClicked}
        checkSeekingInfo={checkSeekingInfo}
        setCheckSeekingInfo={setCheckSeekingInfo}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        uid={uid}
        setUid={setUid}
      />
    </div>
  );
};

export default CupboardsReportShow;
