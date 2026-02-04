import {
  ChangeEvent,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import Add32 from "../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import { convertToFarsiDigits } from "../../utilities/general";
import { TableColumns } from "../../types/general";
import { AttachmentResult } from "../../types/attachment";
import { useAuthStore } from "../../store/authStore";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import { colors } from "../../utilities/color";
import { useGeneralContext } from "../../context/GeneralContext";
import AttachmentShowTable from "../attachment/AttachmentShowTable";
import AttachmentShowTableTabs from "../attachment/AttachmentShowTableTabs";
import ModalMessage from "../layout/ModalMessage";
import { useAttachmentStore } from "../../store/attachmentStore";
import { useAttachments } from "../../hooks/useAttachments";

type Props = {
  formId: number;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  prefix: string;
  setPrefix: Dispatch<SetStateAction<string>>;
  setCnt: Dispatch<SetStateAction<number>>;
  guid: string;
};

const InvoiceReturnRequestAttachments = ({
  formId,
  activeTab,
  setActiveTab,
  prefix,
  setPrefix,
  setCnt,
  guid,
}: Props) => {
  const {
    attachments,
    refetch,
    isFetching,
    isLoading,
    deleteAttachment,
    restoreAttachment,
    saveAttachment,
    attachmentSaveResponse: saveResponse,
  } = useAttachments();
  const {
    setField: setAttachmentField,
    deleteRestoreResponse,
    attachmentSaveResponse,
  } = useAttachmentStore();
  const [data, setData] = useState<AttachmentResult[]>([]);
  const { authApiResponse } = useAuthStore();
  const token = authApiResponse?.data.result.login.token ?? "";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { systemId, yearId } = useGeneralContext();
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in payRequestAttachment table
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      //define for selectedId
      Header: "شناسه",
      accessor: "id",
      width: "5%",
      visible: false,
    },
    {
      Header: "شرح",
      accessor: "dsc",
      width: "80%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "..",
      accessor: "del",
      width: "10%",
      Cell: ({ row }: any) => (
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            updateToDeleted(row);
          }}
        >
          <img
            src={row.original.isDeleted ? RestoreIcon : TrashIcon}
            style={{ width: "16px", height: "16px" }}
            alt="TrashIcon"
          />
        </button>
      ),
    },
  ];

  useEffect(() => {
    //calculate attachment counts
    setSelectedRowIndex(attachments.data.result.length - 1);
  }, [attachments.data.result.length]);
  /////////////////////////////////////////////////////////////////
  //for api/ProcurementAttachment/attachments request
  useEffect(() => {
    setAttachmentField("systemId", systemId);
    setAttachmentField("yearId", yearId);
    setAttachmentField("prefix", prefix);
    setAttachmentField("formId", formId);
    setAttachmentField("GUID", guid);
  }, [formId, systemId, yearId, prefix, guid]);
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    switch (activeTab) {
      case 0:
        setPrefix("InvoiceReturnRequest");
        break;
      case 1:
        setPrefix("tab2");
        break;
      case 2:
        setPrefix("tab3");
        break;
      case 3:
        setPrefix("tab4");
        break;
      case 4:
        setPrefix("tab5");
        break;
      default:
        break;
    }
  }, [activeTab]);
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    let tempData: any[] = [];
    if (attachments) {
      tempData = attachments.data.result.map((item, index: number) => ({
        ...item,
        index: index + 1,
        isDeleted: false,
      }));
      setData(tempData);
    }
    //console.log(attachments, "attachments");
    setSelectedId(tempData[tempData.length - 1]?.id);
    //console.log(tempData);
  }, [attachments]);
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    setCnt(attachmentSaveResponse.data.result.cnt ?? 0);
  }, [attachmentSaveResponse]);
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    setCnt(deleteRestoreResponse.data.result.cnt ?? 0);
  }, [deleteRestoreResponse]);
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    setCnt(attachments.data.result.length ?? 0);
  }, [attachments]);
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);
  /////////////////////////////////////////////////////////////
  const updateToDeleted = (row: any) => {
    console.log("updateToDeleted", row.original.id);
    setData((old) =>
      old.map((origRow) => {
        if (origRow.id === row.original.id) {
          return { ...origRow, isDeleted: !origRow.isDeleted };
        }
        return origRow;
      })
    );
    //if not deleted, delete the attachment
    if (!row.original.isDeleted) {
      setAttachmentId(row.original.id);
      console.log("deleteAttachment", row.original.id);
      deleteAttachment({
        idDeleteRestore: row.original.id,
        formIdDeleteRestore: formId,
        prefixDeleteRestore: prefix,
      });
    } else {
      //if deleted, restore the attachment
      //setAttachmentId(row.original.id);
      console.log("restoreAttachment", attachmentId);
      restoreAttachment({
        idDeleteRestore: attachmentId,
        formIdDeleteRestore: formId,
        prefixDeleteRestore: prefix,
      });
    }
  };
  ////////////////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    //    console.log("handleCellColorChange", row.original);
    if (row.original.isDeleted) {
      return colors.red100;
    }
    return null;
  };

  ///////////////////////////////////////////////////////////////////
  const onButtonClick = () => {
    // Debug: Check if the ref is properly linked
    console.log("fileInputRef.current:", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Explicitly trigger the click
    } else {
      console.error("fileInputRef is not linked to the input element");
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Upload logic
      const formData = new FormData();
      formData.append("img", file); // Keep file in FormData

      const newGuid = uuidv4();
      // Generate query parameters
      const params = new URLSearchParams({
        prefix: prefix,
        formId: formId.toString(),
        systemId: systemId.toString(),
        yearId: yearId.toString(),
        guid: newGuid,
      });

      setAttachmentField("GUID", guid);
      console.log("Request params:", params.toString());
      setIsModalOpen(true);
      saveAttachment({ formData, params });
    });

    if (e.target) {
      e.target.value = "";
    }
  };
  const imageUrl = data.find((item) => item.id === selectedId)?.path;

  return (
    <div className="flex flex-col gap-1 w-full h-auto">
      <div className="flex px-4 items-center justify-end w-full bg-gray-200 rounded-md">
        <div
          onClick={onButtonClick}
          className="flex flex-col items-center cursor-pointer border-2 hover:font-bold hover:bg-gray-300 rounded-md p-1"
        >
          <img src={Add32} alt="Add32" className="w-6 h-6" />
          <p className="text-xs">جدید</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div
          className="flex flex-col items-center cursor-pointer border-2 hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => refetch()}
        >
          {/*onClick={()=>getWorkTable()}>*/}
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </div>
      <AttachmentShowTableTabs
        tab0Title={`درخواست مرجوعی`}
        tab1Title={`پیش فاکتور مرجوعی`}
        tab2Title={`رسید موقت`}
        tab3Title={`فاکتور مرجوعی`}
        tab4Title={`حواله مرجوعی`}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <AttachmentShowTable
        columns={columns}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        data={data}
        setSelectedId={setSelectedId}
        imageUrl={imageUrl ?? ""}
        token={token}
        handleCellColorChange={handleCellColorChange}
        isLoading={isFetching || isLoading}
      />
      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backgroundColor={
          saveResponse?.meta.errorCode <= 0 ? "bg-green-200" : "bg-red-200"
        }
        bgColorButton={
          saveResponse?.meta.errorCode <= 0 ? "bg-green-500" : "bg-red-500"
        }
        color="text-white"
        message={saveResponse?.meta.message || ""}
        visibleButton={false}
      />
    </div>
  );
};

export default InvoiceReturnRequestAttachments;
