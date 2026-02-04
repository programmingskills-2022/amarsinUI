import {
  ChangeEvent,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAttachments } from "../../hooks/useAttachments";
import { useAttachmentStore } from "../../store/attachmentStore";
import Add32 from "../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import { convertToFarsiDigits } from "../../utilities/general";
import { TableColumns } from "../../types/general";
import { AttachmentResult, Result } from "../../types/attachment";
import { useAuthStore } from "../../store/authStore";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import { colors } from "../../utilities/color";
import { useGeneralContext } from "../../context/GeneralContext";
import AttachmentShowTable from "../attachment/AttachmentShowTable";

type Props = {
  formId: number;
  prefix:string;
  setCnt: Dispatch<SetStateAction<number>>;
  guid: string;
};

const PayRequestAttachment = ({
  formId,
  prefix,
  setCnt,
  guid,
}: Props) => {
  const {
    isLoading,
    isFetching,
    attachments,
    refetch,
    deleteAttachment,
    restoreAttachment,
    saveAttachment,
    //attachmentSaveResponse : attachmentSaveResponseHook,
  } = useAttachments();
  const { setField, attachmentSaveResponse, deleteRestoreResponse, formId: formIdStore } =
    useAttachmentStore();
  const [data, setData] = useState<AttachmentResult[]>([]);
  const { authApiResponse } = useAuthStore();
  const token = authApiResponse?.data.result.login.token ?? "";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { systemId, yearId } = useGeneralContext();
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in payRequestAttachment table

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
    setSelectedRowIndex(attachments.data.result.length-1);
  }, [attachments.data.result.length]);
  /////////////////////////////////////////////////////////////////
  //for setting the params for api/Attachment/list in useAttachmentStore
  useEffect(() => {
    setField("systemId", systemId);
    setField("yearId", yearId);
    if (formId !== formIdStore) {
      setField("formId", formId);
    }
    setField("prefix", prefix);
    setField("GUID", guid);
  }, [formId,systemId,yearId,guid,prefix]);

  useEffect(() => {
    let tempData: AttachmentResult[] = [];
    if (attachments) {
      tempData = attachments.data.result.map((item: Result, index: number) => ({
        ...item,
        index: index + 1,
        isDeleted: false,
      }));
      setData(tempData);
    }
    //console.log(attachments, "attachments");
    setSelectedId(tempData[tempData.length-1]?.id);
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
      console.log(file, "file in handleFileChange");
      // Upload logic
      const formData = new FormData();
      formData.append("img", file); // Keep file in FormData

      // Generate query parameters
      const params = new URLSearchParams({
        prefix: prefix,
        formId: formId.toString(),
        systemId: systemId.toString(),
        yearId: yearId.toString(),
        guid: guid,
      });

      setField("GUID", guid);
      console.log("Request params:", params.toString());
      saveAttachment({ formData, params});
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
      <AttachmentShowTable
        columns={columns}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        data={data}
        setSelectedId={setSelectedId}
        imageUrl={imageUrl ?? ""}
        token={token}
        handleCellColorChange={handleCellColorChange}
        isLoading={isFetching || isLoading }
      />
    </div>
  );
};

export default PayRequestAttachment;
