import { useEffect, useState } from "react";
import { DeliveryShowResponse,  } from "../../types/delivery";
import { TableColumns } from "../../types/general";
import { convertToFarsiDigits, formatNumberWithCommas } from "../../utilities/general";
import { Paper } from "@mui/material";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import InvoiceShowTableHeader from "../invoice/InvoiceShowTableHeader";
import { FaCheck } from "react-icons/fa";

type Props = {
  deliveryShowResponse: DeliveryShowResponse;
  isLoading: boolean;
  canEditForm: boolean;
};

const DeliveryShowTable = ({
  deliveryShowResponse,
  canEditForm,
  isLoading,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "کد",
      accessor: "pCode",
      width: "10%",
    },
    {
      Header: "کالا",
      accessor: "pName",
      width: "25%",
    },
    {
      Header: "تعداد",
      accessor: "cnt",
      width: "5%",
    },
    {
      Header: "مبلغ",
      accessor: "cost",
      width: "10%",
    },
    {
      Header: "تیتک",
      accessor: "hasUIDImage",
      width: "5%",
    },
    {
      Header: "UID",
      accessor: "uid",
      width: "15%",
    },
    {
      Header: "وضعیت",
      accessor: "statusCode",
      width: "5%",
    },
    {
      Header: "بچ",
      accessor: "code",
      width: "10%",
    },
    {
      Header: "انقضاء",
      accessor: "expire",
      width: "10%",
    },
  ];

  useEffect(() => {
    setData(
      deliveryShowResponse.data.result.deliveryDtls.map((item, index) => ({
        ...item,
        pCode: convertToFarsiDigits(item.pCode),
        pName: convertToFarsiDigits(item.pName),
        cnt: convertToFarsiDigits(item.cnt),
        cost: convertToFarsiDigits(formatNumberWithCommas(item.cost)),
        hasUIDImage: item.hasUID ? <FaCheck /> : null,
        uid: convertToFarsiDigits(item.uid),
        statusCode: convertToFarsiDigits(item.statusCode),
        code: convertToFarsiDigits(item.code),
        expire: convertToFarsiDigits(item.expire),
        index: convertToFarsiDigits(index + 1),
      }))
    );
  }, [deliveryShowResponse]);
  const { width } = useCalculateTableHeight();
  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : deliveryShowResponse.meta.errorCode >0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {deliveryShowResponse.meta.message}
          </p>
        ) : (
          <div className="w-full mt-2">
            {width > 768 && <InvoiceShowTableHeader caption={"اطلاعات رسید"} />}
            <TTable
              columns={columns}
              data={data}
              //updateMyData={updateMyData}
              fontSize="0.75rem"
              maxVisibleColumns={6}
              canEditForm={canEditForm}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              changeRowSelectColor={true}
              collapsedColumnWidth={30}
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default DeliveryShowTable;
