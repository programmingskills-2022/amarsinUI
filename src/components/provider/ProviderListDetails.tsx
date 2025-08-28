import React, { useEffect, useState } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { useProviderDetailList } from "../../hooks/useProviderList";
import {
  convertPersianDate,
  convertToFarsiDigits,
} from "../../utilities/general";
import { useProviderDetailStore } from "../../store/providerStore";
import { Paper } from "@mui/material";
import Skeleton from "../layout/Skeleton";
import {  ProviderDetailTbl } from "../../types/provider";
import { TableColumns } from "../../types/general";
import TTable from "../controls/TTable";

type ProviderListDetailsProps = {
  productId: string;
  brand: { id: string; title: string } | null;
  sanadKind: { id: string; title: string } | null;
  startDate: Date | null;
  endDate: Date | null;
};

export default function ProviderListDetails({
  productId,
  brand,
  sanadKind,
  startDate,
  endDate,
}: ProviderListDetailsProps) {
  const columns: TableColumns = React.useMemo(
    () => [
      {
        Header: "ردیف",
        accessor: "index",
        width: "5%",
      },
      {
        Header: "نوع",
        accessor: "kind",
        width: "5%",
      },
      {
        Header: "شماره فاکتور",
        accessor: "factorNo",
        width: "5%",
      },
      {
        Header: "تاریخ",
        accessor: "dat",
        width: "5%",
      },
      {
        Header: "شماره. مشتری",
        accessor: "customerId",
        width: "5%",
      },
      {
        Header: "کد/شناسه ملی",
        accessor: "nId",
        width: "5%",
      },
      {
        Header: "نام مشتری",
        accessor: "srName",
        width: "20%",
      },
      {
        Header: "بچ |انقضاء",
        accessor: "cupInfoes",
        width: "10%",
      },
      {
        Header: "تعداد",
        accessor: "cnt",
        width: "5%",
      },
      {
        Header: "آفر",
        accessor: "offerCnt",
        width: "5%",
      },
      {
        Header: "قیمت فروش",
        accessor: "cost",
        width: "5%",
      },
      {
        Header: "تخفیف",
        accessor: "dcrmnt",
        width: "5%",
      },
      {
        Header: "مالیات",
        accessor: "valueTax",
        width: "5%",
      },
      {
        Header: "مبلغ",
        accessor: "total",
        width: "5%",
      },
      {
        Header: "ش. برگه مسیر",
        accessor: "shRId",
        width: "5%",
      },
      {
        Header: "ت. برگه مسیر",
        accessor: "shRDate",
        width: "5%",
      },
    ],
    []
  );
  const { providerDetailList, error, isLoading } = useProviderDetailList();

  const { systemId, yearId } = useGeneralContext();
  const { setField } = useProviderDetailStore();

  useEffect(() => {
    setField("productId", productId);
    setField("accSystem", systemId);
    setField("accYear", yearId);
    setField("brandId", brand === null || !brand ? 0 : brand.id);
    setField("sanadKind", sanadKind?.id);
    setField(
      "fDate",
      startDate === null || !startDate
        ? ""
        : convertPersianDate(startDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "tDate",
      endDate === null || !endDate
        ? ""
        : convertPersianDate(endDate.toLocaleDateString("fa-IR"))
    );
  }, [systemId, yearId, brand?.id, sanadKind?.id, startDate, endDate]);
  if (error) return <div>Error: {error.message} </div>;

  const [data, setData] = useState<ProviderDetailTbl[]>([]);

  //console.log(data, "data");
  const [skipPageReset, setSkipPageReset] = useState(false);

  useEffect(() => {
    setData(
      providerDetailList.rpProviderDetails.map((item, idx) => ({
        index: convertToFarsiDigits(idx + 1),
        bName: convertToFarsiDigits(item.bName),
        cnt: convertToFarsiDigits(item.cnt),
        cost: convertToFarsiDigits(item.cost),
        customerId: convertToFarsiDigits(item.customerId),
        dat: convertToFarsiDigits(item.dat),
        dcrmnt: convertToFarsiDigits(item.dcrmnt),
        factorNo: convertToFarsiDigits(item.factorNo),
        kind: convertToFarsiDigits(item.kind),
        nId: convertToFarsiDigits(item.nId),
        offerCnt: convertToFarsiDigits(item.offerCnt),
        productId: convertToFarsiDigits(item.productId),
        id: convertToFarsiDigits(item.id),
        srName: convertToFarsiDigits(item.srName),
        valueTax: convertToFarsiDigits(item.valueTax),
        total: convertToFarsiDigits(item.total),
        shRId: convertToFarsiDigits(item.shRId),
        shRDate: convertToFarsiDigits(item.shRDate),
        cupInfoes: item.cupInfoes
          .map((cupInfo) => {
            return (
              convertToFarsiDigits(cupInfo.code) +
              " | " +
              convertToFarsiDigits(cupInfo.expDate)
            );
          })
          .join("\n"),
      }))
    );
  }, [providerDetailList.rpProviderDetails]);

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  console.log(data);

  return (
    <Paper className="p-2 m-2 w-full md:h-full overflow-y-auto">
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <div className="h-screen-minus-200">
          <TTable
            columns={columns}
            data={data}
            //updateMyData={updateMyData}
            skipPageReset={skipPageReset}
            //fontSize="10px"
            wordWrap={true}
            hasSumRow={true}
          />
        </div>
      )}
    </Paper>
  );
}
