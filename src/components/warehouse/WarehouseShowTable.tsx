import { Paper } from "@mui/material";
import Skeleton from "../layout/Skeleton";
import {
  IndentRequest,
  RegRequest,
  WarehouseTemporaryReceiptIndentDtl,
  WarehouseShowIdResponse,
} from "../../types/warehouse";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import EditIcon from "../../assets/images/GrayThem/edit_gray16.png";
import { grey, red } from "@mui/material/colors";
import { convertToFarsiDigits } from "../../utilities/general";
import { useWarehouseStore } from "../../store/warehouseStore";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { useAuthStore } from "../../store/authStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useWarehouse } from "../../hooks/useWarehouse";
import React from "react";
import TTable from "../controls/TTable";
import { colors } from "../../utilities/color";

type Props = {
  setEditClicked: (editClicked: boolean) => void;
  setStatusClicked: (statusClicked: boolean) => void;
  setSelectedProduct: (dtl: WarehouseTemporaryReceiptIndentDtl) => void;
  setIocId: (iocId: number) => void;
  setIsModalOpenReg: (isModalOpenReg: boolean) => void;
  setConfirmHasError: (isModalOpenReg: boolean) => void;
  customerId: number;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  warehouseShowIdResponse: WarehouseShowIdResponse;
  isLoadingWarehouseShowId: boolean;
};

const WarehouseShowTable = ({
  setEditClicked,
  setStatusClicked,
  setSelectedProduct,
  setIocId,
  setIsModalOpenReg,
  setConfirmHasError,
  customerId,
  workFlowRowSelectResponse,
  warehouseShowIdResponse,
  isLoadingWarehouseShowId,
}: Props) => {
  const { reg } = useWarehouse();
  const { authApiResponse } = useAuthStore();
  const { setField } = useWarehouseStore();

  const columns = React.useMemo(
    () => [
      {
        Header: "اطلاعات رسید موقت",
        width: "56%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "3%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(value);
            },
          },
          {
            Header: "انقضاء",
            accessor: "expire",
            width: "5%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "لیست درخواستها",
            accessor: "iocId",
            width: "5%",
            visible: false,
          },
          {
            Header: "UID",
            accessor: "uId",
            width: "10%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "وضعیت",
            accessor: "status",
            width: "5%",
          },
          {
            Header: "وضعیت",
            accessor: "statusOriginal",
            width: "5%",
            visible: false,
          },
          {
            Header: "بچ",
            accessor: "code",
            width: "5%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "کد",
            accessor: "pCode",
            width: "5%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "کالا",
            accessor: "pName",
            width: "18%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "5%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
        ],
      },
      {
        Header: "درخواست های مرتبط",
        width: "32%",
        backgroundColor: colors.green50,
        columns: [
          {
            Header: "شماره",
            accessor: "indentCode",
            width: "5%",
            backgroundColor: colors.green50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "تعداد",
            accessor: "indentCnt",
            width: "5%",
            backgroundColor: colors.green50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "آفر",
            accessor: "indentOffer",
            width: "5%",
            backgroundColor: colors.green50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "شرح",
            accessor: "indentDsc",
            width: "15%",
            backgroundColor: colors.green50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: " ",
            accessor: "editIcon",
            width: "2%",
            backgroundColor: colors.green50,
            Cell: ({ row }: any) => (
              <img
                src={EditIcon}
                onClick={() => handleEditClick(row)}
                className="cursor-pointer"
                alt="report"
              />
            ),
          },
        ],
      },
      {
        Header: "اطلاعات ثبت",
        width: "12%",
        backgroundColor: colors.indigo50,
        columns: [
          {
            Header: "تعداد",
            accessor: "rCnt",
            width: "5%",
            backgroundColor: colors.indigo50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "آفر",
            accessor: "rOffer",
            width: "5%",
            backgroundColor: colors.indigo50,
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: " ",
            accessor: "historyIcon",
            width: "2%",
            backgroundColor: colors.indigo50,
            Cell: ({ value }: any) => (
              <img
                src={HistoryIcon}
                onClick={() => console.log(value)}
                className="cursor-pointer"
                alt="report"
              />
            ),
          },
        ],
      },
    ],
    []
  );

  // Custom cell click handler for Table
  const handleCellColorChange = (row: any) => {
    if (row.original.statusOriginal > 0) {
      return red[100];
    }
    return grey[50];
  };

  const handleStatusClick = (dtl: WarehouseTemporaryReceiptIndentDtl) => {
    setSelectedProduct(dtl);
    setStatusClicked(true);
  };

  const handleEditClick = (dtl: any) => {
    setField("iocId", dtl.original.iocId);
    setIocId(dtl.original.iocId);
    console.log(dtl, "dtl");
    setEditClicked(true);
  };

  const data =
    warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptIndentDtls.map(
      (dtl, i) => {
        return {
          index: i + 1,
          id: dtl.id,
          iocId: dtl.iocId,
          expire: dtl.expire,
          uId: dtl.uId,
          status: (
            <div className="flex justify-evenly items-center w-full">
              {convertToFarsiDigits(dtl.status)}
              <input
                type="checkbox"
                checked={dtl.status === 0 ? true : false}
                readOnly
                onClick={() => handleStatusClick(dtl)}
              />
            </div>
          ),
          editIcon: <img src={EditIcon} onClick={() => handleEditClick(dtl)} />,
          statusOriginal: dtl.status,
          cId: dtl.cId,
          code: dtl?.code,
          pCode: dtl.pCode,
          pName: dtl.pName,
          cnt: dtl.cnt,
          indentId:
            dtl.indents.length > 0
              ? dtl.indents.map((indent) => indent.id).join(" ")
              : "",
          indentCode:
            dtl.indents.length > 0
              ? dtl.indents.map((indent) => indent.code).join("\n")
              : "",
          indentCnt:
            dtl.indents.length > 0
              ? dtl.indents.map((indent) => indent.cnt).join("\n")
              : "",
          indentOffer:
            dtl.indents.length > 0
              ? dtl.indents.map((indent) => indent.offer).join("\n")
              : "",
          indentDsc:
            dtl.indents.length > 0
              ? dtl.indents.map((indent) => indent.dsc).join(" ")
              : "",
          rCnt: dtl.rCnt,
          rOffer: dtl.rOffer,
          historyIcon: <img src={HistoryIcon} />,
        };
      }
    );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let request: RegRequest;
    let indents: IndentRequest[] = [];

    let dataReg =
      warehouseShowIdResponse.data.result.response
        .warehouseTemporaryReceiptIndentDtls;

    dataReg.map((item) => {
      return indents.push({
        id: item.iocId,
        cnt: Number(item.rCnt),
        offer: Number(item.rOffer),
      });
    });

    request = {
      usrId: authApiResponse?.data.result.login.usrId ?? 0,
      id: workFlowRowSelectResponse.workTableRow.formId,
      customerId: customerId,
      dtls: indents,
    };
    //console.log(request, "request");
    try {
      const response = await reg(request);
      if (response.meta.errorCode === 1) setConfirmHasError(true);
      else setConfirmHasError(false);
      setIsModalOpenReg(true);
    } catch (error) {
      console.error("Error editing indents:", error);
    }
  };

  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        {isLoadingWarehouseShowId ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : warehouseShowIdResponse.meta.errorCode !== -1 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {warehouseShowIdResponse.meta.message}
          </p>
        ) : (
          <div className="w-full mt-2">
            <TTable
              columns={columns}
              data={data}
              //updateMyData={updateMyData}
              //skipPageReset={skipPageReset}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              CellColorChange={handleCellColorChange}
            />
          </div>
        )}
        {data.length > 0 && (
          <ConfirmCard variant="rounded-md justify-end">
            <Button
              text="تایید"
              backgroundColor="bg-green-500"
              backgroundColorHover="bg-green-600"
              onClick={handleSubmit}
            />
          </ConfirmCard>
        )}
      </Paper>
    </>
  );
};

export default WarehouseShowTable;
