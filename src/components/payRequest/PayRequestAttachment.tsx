import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, SetStateAction, Dispatch, useEffect, useRef, useState } from "react";
import { useAttachments } from "../../hooks/useAttachments";
import { useAttachmentStore } from "../../store/attachmentStore";
import Add32 from "../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import { convertToFarsiDigits } from "../../utilities/general";
import { TableColumns } from "../../types/general";
import TTable from "../controls/TTable";
import { AttachmentResult, Result } from "../../types/attachment";
import AttachmentImageLoader from "../../utilities/AttachmentImageLoader";
import { useAuthStore } from "../../store/authStore";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import { colors } from "../../utilities/color";
import { useGeneralContext } from "../../context/GeneralContext";

type Props = { formId: number; setCnt: Dispatch<SetStateAction<number>> };

const PayRequestAttachment = ({ formId, setCnt }: Props) => {
  const {
    attachments,
    refetch,
    deleteAttachment,
    restoreAttachment,
    saveAttachment,
  } = useAttachments();
  const { setField, attachmentSaveResponse, deleteRestoreResponse } =
    useAttachmentStore();
  const [data, setData] = useState<AttachmentResult[]>([]);
  const { authApiResponse } = useAuthStore();
  const token = authApiResponse?.data.result.login.token ?? "";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { systemId, yearId } = useGeneralContext();
  const [attachmentId, setAttachmentId] = useState<number>(0);

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
        <img
          src={row.original.isDeleted ? RestoreIcon : TrashIcon}
          onClick={() => updateToDeleted(row)}
          className="cursor-pointer"
          alt="TrashIcon"
        />
      ),
    },
  ];
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    setField("systemId", systemId);
    setField("yearId", yearId);
    setField("formId", formId);
    setField("prefix", "payrequest");
    setField("GUID", "");
  }, [formId]);

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
    setSelectedId(tempData[0]?.id);
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
        prefixDeleteRestore: "payrequest",
      });
    } else {
      //if deleted, restore the attachment
      //setAttachmentId(row.original.id);
      console.log("restoreAttachment", attachmentId);
      restoreAttachment({
        idDeleteRestore: attachmentId,
        formIdDeleteRestore: formId,
        prefixDeleteRestore: "payrequest",
      });
    }
  };
  ////////////////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
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
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type. Please select an image.");
        return;
      }

      // Create preview (optional)
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("Preview URL:", event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload logic
      const guid = uuidv4();
      const formData = new FormData();
      formData.append("img", file); // Keep file in FormData

      // Generate query parameters
      const params = new URLSearchParams({
        prefix: "payrequest",
        formId: formId.toString(),
        systemId: systemId.toString(),
        yearId: yearId.toString(),
        guid: guid,
      });

      console.log("Request params:", params.toString());
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
          className="flex flex-col items-center cursor-pointer border-2 hover:border-gray-300 rounded-md py-1 px-2"
        >
          <img src={Add32} alt="Add32" className="w-6 h-6" />
          <p className="text-xs">جدید</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
        <div
          className="flex flex-col items-center cursor-pointer border-2 hover:border-gray-300 rounded-md p-1"
          onClick={() => refetch()}
        >
          {/*onClick={()=>getWorkTable()}>*/}
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-1/2">
          <TTable
            columns={columns}
            data={data}
            changeRowSelectColor={true}
            fontSize="14px"
            setSelectedId={setSelectedId}
            CellColorChange={handleCellColorChange}
          />
        </div>
        <div className="w-1/2 h-full">
          {imageUrl && (
            <div className="flex w-full h-full justify-center items-center overflow-y-auto">
              <AttachmentImageLoader
                authToken={token}
                imageUrl={imageUrl}
                options={{
                  className:
                    "attachment-image transition-transform duration-300 ease-in-out",
                  alt: "Attachment Image",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayRequestAttachment;
