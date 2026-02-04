//گزارش بچ ها
import PageTitle from "../../../components/layout/PageTitle";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import ExcelIcon from "../../../assets/images/GrayThem/excel24.png";
import Survey24 from "../../../assets/images/GrayThem/survey24.png";
import CupboardsReportShow from "../../../components/cupboardsReport/CupboardsReportShow";
import { useEffect, useState } from "react";
import { TableColumns } from "../../../types/general";
import { useCupboardReport } from "../../../hooks/useCupboardsReport";
import { WarehouseTemporaryReceiptIndentDtl } from "../../../types/warehouse";
import { convertToFarsiDigits } from "../../../utilities/general";
import { FaCheck } from "react-icons/fa";
import Flow16 from "../../../assets/images/GrayThem/flow16.png";
import EditIcon from "../../../assets/images/GrayThem/edit_gray16.png";
import { DefinitionInvironment } from "../../../types/definitionInvironment";
type Props = {
  definitionInvironment: DefinitionInvironment;
}
const CupboardsReport = ({ definitionInvironment }: Props) => {
  const {
    cupboardsReportResponse,
    isLoadingCupboardsReport,
    isFetchingCupboardsReport,
    refetchCupboardsReport,
    refetchDownloadExcel,
    isLoadingDownloadExcel,
    downloadExcelResponse,
  } = useCupboardReport();

  const [data, setData] = useState<any[]>([]);
  // for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(35);
  const [selectedProduct, setSelectedProduct] =
    useState<WarehouseTemporaryReceiptIndentDtl | null>(null);
  const [statusClicked, setStatusClicked] = useState(false);
  const [checkSeekingInfo, setCheckSeekingInfo] = useState(false); // to control clicking on seeking info icon
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false); // set true if user clicked on  استعلام
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [uid, setUid] = useState<string | undefined>(undefined);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
    },
    {
      Header: "کد کالا",
      accessor: "fullCode",
      width: "5%",
    },
    {
      Header: "نام کالا",
      accessor: "fullName",
      width: "30%",
    },
    {
      Header: "تولید",
      accessor: "prodDate",
      width: "5%",
    },
    {
      Header: "انقضاء",
      accessor: "expDate",
      width: "5%",
    },
    {
      Header: "GTIN",
      accessor: "gtin",
      width: "9%",
    },
    {
      Header: "تیتاک",
      accessor: "ttac",
      width: "2%",
    },
    {
      Header: "بچ",
      accessor: "code",
      width: "7%",
    },
    {
      Header: "IRC",
      accessor: "irc",
      width: "9%",
    },
    {
      Header: "UID",
      accessor: "uid",
      width: "9%",
    },
    {
      Header: "موقت",
      accessor: "tmp",
      width: "3%",
    },
    {
      Header: "ورودی",
      accessor: "inc",
      width: "3%",
    },
    {
      Header: "خروجی",
      accessor: "outc",
      width: "3%",
    },
    {
      Header: "موجودی",
      accessor: "stck",
      width: "3%",
    },
    {
      Header: "وضعیت",
      accessor: "status",
      width: "3%",
    },
    {
      Header: " ",
      accessor: "statusImages",
      width: "5%",
    },
  ];
  useEffect(() => {
    if (downloadExcelResponse && isDownloadingExcel) {
      console.log("downloadExcelResponse", downloadExcelResponse);
      handleDownloadExcel(downloadExcelResponse);
      setIsDownloadingExcel(false)
    }
  }, [downloadExcelResponse, isDownloadingExcel]);

  const handleDownloadExcel = async (data: any) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Check if the browser supports the File System Access API
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: "CupboardsReport.xlsx",
          types: [
            {
              description: "Excel Files",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (err: any) {
        // User cancelled or error occurred
        if (err.name !== "AbortError") {
          console.error("Error saving file:", err);
          // Fallback to traditional download
          fallbackDownload(blob);
        }
      }
    } else {
      // Fallback for browsers that don't support File System Access API
      fallbackDownload(blob);
    }
  };

  const fallbackDownload = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CupboardsReport.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  // for initializing data
  useEffect(() => {
    const tempData = cupboardsReportResponse.data.result.map((c, index) => {
      const dtl: WarehouseTemporaryReceiptIndentDtl = {
        id: 0,
        iocId: 0,
        produce: c.prodDate,
        expire: c.expDate,
        uId: "", // for product catalog request
        status: 0,
        cId: c.id, // for product catalog request
        code: c.code,
        gtin: c.gtin,
        irc: c.irc, // for product catalog request
        pCode: "",
        pName: c.fullName,
        cnt: 0,
        stock: 0,
        pOffer: 0,
        indents: [],
        rCnt: 0,
        rOffer: 0,
      };
      return {
        ...c,
        fullCode: convertToFarsiDigits(c.fullCode),
        fullName: convertToFarsiDigits(c.fullName),
        prodDate: convertToFarsiDigits(c.prodDate),
        expDate: convertToFarsiDigits(c.expDate),
        gtin: convertToFarsiDigits(c.gtin),
        ttac: c.ttac ? <FaCheck /> : null,
        code: convertToFarsiDigits(c.code), // for batch
        irc: convertToFarsiDigits(c.irc),
        uid: convertToFarsiDigits(c.uid),
        tmp: convertToFarsiDigits(c.tmp),
        inc: convertToFarsiDigits(c.inc),
        outc: convertToFarsiDigits(c.outc),
        stck: convertToFarsiDigits(c.stck),
        status: convertToFarsiDigits(c.status),
        index: convertToFarsiDigits((pageNumber - 1) * pageSize + index + 1),
        statusImages: (
          <div className="flex justify-evenly items-center w-full">
            <input
              type="checkbox"
              checked={dtl.status === 0 ? false : true}
              readOnly
              onClick={() => handleStatusClick(dtl)}
            />
            <img src={Flow16} alt="Flow16" className="w-4 h-4" />
            <img src={EditIcon} alt="EditIcon" className="w-4 h-4" />
          </div>
        ),
      };
    });
    console.log(tempData);
    setData(tempData);
  }, [cupboardsReportResponse.data.result]);

  ///////////////////////////////////////////////////////////////////
  const handleStatusClick = (dtl: any) => {
    console.log(dtl, "dtl");
    setSelectedProduct(dtl);
    setStatusClicked(true);
    setUid(undefined);
  };
  ////////////////////////////////////////////////////////////////////////
  const seekInfo = () => {
    console.log("enter seekInfo");
    setCheckSeekingInfo(true);
    console.log(data[selectedRowIndex]);
    setSelectedProduct((prev) => ({
      ...(prev || ({} as WarehouseTemporaryReceiptIndentDtl)),
      cId: data[selectedRowIndex].id,
      code: data[selectedRowIndex].code,
      pName: data[selectedRowIndex].fullName,
      produce: data[selectedRowIndex].prodDate,
      expire: data[selectedRowIndex].expDate,
      gtin: data[selectedRowIndex].gtin,
      irc: data[selectedRowIndex].irc,
    }));
    setUid("");
    setStatusClicked(true);
  };
  ////////////////////////////////////////////////////////////////////
  const handleRefetchCupboardsReport = () => {
    refetchCupboardsReport();
  };
  ////////////////////////////////////////////////////////////////////////
  const downloadExcel = () => {
    refetchDownloadExcel();
    setIsDownloadingExcel(true)
  };
  ////////////////////////////////////////////////////////////////////////
  return (
    <div className="flex flex-col bg-gray-200 pt-2">
      <header className="flex flex-col gap-2 md:flex-row items-center justify-between border-gray-300 border-b pb-2">
        <PageTitle definitionInvironment={definitionInvironment} />
        <div className="flex px-4 items-center gap-4">
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={seekInfo}
          >
            <img src={Survey24} alt="Add32" className="w-6 h-6" />
            <p className="text-xs">استعلام</p>
          </div>
          <button
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={downloadExcel}
            disabled={isLoadingDownloadExcel}
          >
            <img src={ExcelIcon} alt="ExcelIcon" className="w-6 h-6" />
            <p className="text-xs">اکسل</p>
          </button>
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={handleRefetchCupboardsReport}
          >
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
        </div>
      </header>
      <CupboardsReportShow
        cupboardsReportResponse={cupboardsReportResponse}
        isLoadingCupboardsReport={
          isLoadingCupboardsReport || isFetchingCupboardsReport
        }
        data={data}
        columns={columns}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        statusClicked={statusClicked}
        setStatusClicked={setStatusClicked}
        checkSeekingInfo={checkSeekingInfo}
        setCheckSeekingInfo={setCheckSeekingInfo}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        uid={uid}
        setUid={setUid}
      />
    </div>
  );
};

export default CupboardsReport;
