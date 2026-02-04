//خسابداری->حسابداری بازرگانی->گزارشات-> گزارش غذا و دارو
import PageTitle from "../../../components/layout/PageTitle";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import Okform from "../../../assets/images/GrayThem/okform24.png";
import Checklist from "../../../assets/images/GrayThem/checklist32.png";
import { useEffect, useState } from "react";
import { TableColumns } from "../../../types/general";
import { convertToFarsiDigits } from "../../../utilities/general";
import Flow16 from "../../../assets/images/GrayThem/flow16.png";
import EditIcon from "../../../assets/images/GrayThem/edit_gray16.png";
import { useTtac } from "../../../hooks/useTtac";
import GetInventoryBalanceShow from "../../../components/ttac/GetInventoryBalanceShow";
import ModalForm from "../../../components/layout/ModalForm";
import FlowProductsSendAll from "../../../components/ttac/FlowProductsSendAll";
import { DefinitionInvironment } from "../../../types/definitionInvironment";

type Props = {
  definitionInvironment: DefinitionInvironment;
};
const GetInventoryBalance = ({ definitionInvironment }: Props) => {
  const {
    getInventoryBalanceResponse,
    isLoadingGetInventoryBalance,
    isFetchingGetInventoryBalance,
    refetchGetInventoryBalance,
    refetchFlowProductsSendAll,
    flowProductsSendAllResponse,
    isLoadingFlowProductsSendAll,
    isFetchingFlowProductsSendAll,
    cupboardCaptureResponse,
    isLoadingCupboardCapture,
    importTTacStatusResponse,
    isLoadingImportTTacStatus,
  } = useTtac();

  const [data, setData] = useState<any[]>([]);
  // for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(35);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [isFlowProductsSendAll, setIsFlowProductsSendAll] =
    useState<boolean>(false);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "id",
      width: "5%",
    },
    {
      Header: "IRC",
      accessor: "irc",
      width: "20%",
    },
    {
      Header: "LotNumber",
      accessor: "lotNumber",
      width: "20%",
    },
    {
      Header: "موجودی",
      accessor: "cnt",
      width: "15%",
    },
    {
      Header: "موجودی انبار",
      accessor: "wStock",
      width: "15%",
    },
    {
      Header: "ارسال نشده",
      accessor: "notSent",
      width: "10%",
    },
    {
      Header: "تیتاک",
      accessor: "tCnt",
      width: "10%",
    },
    {
      Header: " ",
      accessor: "statusImages",
      width: "5%",
    },
  ];
  // for initializing data
  useEffect(() => {
    if (getInventoryBalanceResponse.data.result.length === 0) return;
    const tempData = getInventoryBalanceResponse.data.result.map((c) => {
      return {
        ...c,
        id: convertToFarsiDigits(c.id),
        irc: convertToFarsiDigits(c.irc),
        lotNumber: convertToFarsiDigits(c.lotNumber),
        cnt: convertToFarsiDigits(c.cnt),
        wStock: convertToFarsiDigits(c.wStock),
        notSent: convertToFarsiDigits(c.notSent),
        tCnt: convertToFarsiDigits(c.tCnt),
        //index: convertToFarsiDigits((pageNumber - 1) * pageSize + index + 1),
        statusImages: (
          <div className="flex justify-evenly items-center w-full">
            <input
              type="checkbox"
              checked={false}
              readOnly
              //onClick={() => handleStatusClick(dtl)}
            />
            <img src={Flow16} alt="Flow16" className="w-4 h-4" />
            <img src={EditIcon} alt="EditIcon" className="w-4 h-4" />
          </div>
        ),
      };
    });
    console.log(tempData);
    setData(tempData);
  }, [getInventoryBalanceResponse.data.result]);

  ///////////////////////////////////////////////////////////////////
  const handleStatusClick = (dtl: any) => {
    console.log(dtl, "dtl");
    /*setSelectedProduct(dtl);
    setStatusClicked(true);
    setUid(undefined);*/
  };

  const handleRefetchCupboardsReport = () => {
    refetchGetInventoryBalance();
  };
  ///////////////////////////////////////////////////
  const handleFlowProductsSendAll = () => {
    setIsFlowProductsSendAll(true);
  };
  ///////////////////////////////////////////////////
  return (
    <div className="flex flex-col bg-gray-200 pt-2">
      <header className="flex flex-col gap-2 md:flex-row items-center justify-between border-gray-300 border-b pb-2">
        <PageTitle definitionInvironment={definitionInvironment} />
        <div className="flex px-4 items-center gap-4">
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={handleFlowProductsSendAll}
          >
            <img
              src={Okform}
              alt="Okform"
              className="w-6 h-6"
              onClick={handleStatusClick}
            />
            <p className="text-xs">ارسال</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={Okform} alt="Okform" className="w-6 h-6" />
            <p className="text-xs">موجودی</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={Okform} alt="Okform" className="w-6 h-6" />
            <p className="text-xs">انبارگردانی</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={Checklist} alt="Checklist" className="w-6 h-6" />
            <p className="text-xs">وقایع</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={Okform} alt="Okform" className="w-6 h-6" />
            <p className="text-xs">حذف</p>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={handleRefetchCupboardsReport}
          >
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
        </div>
      </header>
      <GetInventoryBalanceShow
        getInventoryBalanceResponse={getInventoryBalanceResponse}
        isLoading={
          isLoadingGetInventoryBalance || isFetchingGetInventoryBalance
        }
        data={data}
        columns={columns}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
      />
      {/*open FlowProductsSendAll if ارسال is clicked*/}
      <ModalForm
        isOpen={isFlowProductsSendAll}
        onClose={() => setIsFlowProductsSendAll(false)}
        title="لیست ارسال"
        width="1"
        //height={height.toString()}
      >
        <FlowProductsSendAll
          refetchFlowProductsSendAll={refetchFlowProductsSendAll}
          flowProductsSendAllResponse={flowProductsSendAllResponse}
          isLoadingFlowProductsSendAll={isLoadingFlowProductsSendAll}
          isFetchingFlowProductsSendAll={isFetchingFlowProductsSendAll}
          cupboardCaptureResponse={cupboardCaptureResponse}
          isLoadingCupboardCapture={isLoadingCupboardCapture}
          importTTacStatusResponse={importTTacStatusResponse}
          isLoadingImportTTacStatus={isLoadingImportTTacStatus}
        />
      </ModalForm>
    </div>
  );
};

export default GetInventoryBalance;
