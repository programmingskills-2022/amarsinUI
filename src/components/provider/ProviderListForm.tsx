import React, { useEffect, useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
import { useGeneralContext } from "../../context/GeneralContext";
import { useProviderList } from "../../hooks/useProviderList";
import {  ProviderItemTbl } from "../../types/provider";
import { useProviderStore } from "../../store/providerStore";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import ReportIcon from "../../assets/images/GrayThem/report16.png";
import ProviderProducerParams from "./ProviderProducerParams";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import TTable from "../controls/TTable";
import { TableColumns } from "../../types/general";

type ProviderListFormProps = {
  brand: { id: string; title: string } | null;
  setBrand: (brand: { id: string; title: string } | null) => void;
  sanadKind: { id: string; title: string } | null;
  setSanadKind: (sanadKind: { id: string; title: string } | null) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  onShowDetails: (providerId: string) => void;
};

export const headCells:TableColumns = 
[
  {
    Header: " ",
    width: "65%",
    columns: [
      {
        Header: "ردیف",
        accessor: "index",
        width: "5%",
      },
      {
        Header: "نام کالا",
        accessor: "name",
        width: "60%",
      },
    ],
  },
  {
    Header: "ریالی",
    width: "22%",
    columns: [
      {
        Header: "تعداد",
        accessor: "cnt",
        width: "10%",
      },
      {
        Header: "مبلغ",
        accessor: "total",
        width: "12%",
      },
    ],
  },
  {
    Header: "آفر",
    width: "13%",
    columns: [
      {
        Header: "آفر",
        accessor: "offerCnt",
        width: "10%",
      },
      {
        Header: " ",
        accessor: "id",
        width: "3%",
        Cell: ({value}:any) => (
          //<div className="flex gap-2">
          <img
            src={ReportIcon}
            onClick={() => console.log(value)}
            className="cursor-pointer w-6 h-6"
            alt="report"
          />
          // <img
          //   src={ReportIcon}
          //onClick={() => handleDelete(row.original)}
          //   className="cursor-pointer w-6 h-6"
          //   alt="rep"
          //  />
          //</div>
        ),
      },
    ],
  },
] 

export default function ProviderListForm({
  brand,
  setBrand,
  sanadKind,
  setSanadKind,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onShowDetails,
}: ProviderListFormProps) {
  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        width: "65%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "5%",
          },
          {
            Header: "نام کالا",
            accessor: "name",
            width: "60%",
          },
        ],
      },
      {
        Header: "ریالی",
        width: "22%",
        columns: [
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "10%",
          },
          {
            Header: "مبلغ",
            accessor: "total",
            width: "12%",
          },
        ],
      },
      {
        Header: "آفر",
        width: "13%",
        columns: [
          {
            Header: "آفر",
            accessor: "offerCnt",
            width: "10%",
          },
          {
            Header: " ",
            accessor: "id",
            width: "3%",
            Cell: ({value}:any) => (
              //<div className="flex gap-2">
              <img
                src={ReportIcon}
                onClick={() => handleCellClick(value)}
                className="cursor-pointer w-6 h-6"
                alt="report"
              />
              // <img
              //   src={ReportIcon}
              //onClick={() => handleDelete(row.original)}
              //   className="cursor-pointer w-6 h-6"
              //   alt="rep"
              //  />
              //</div>
            ),
          },
        ],
      },
    ],
    []
  );

  const { providerList, error, isLoading } = useProviderList();

  const { systemId, yearId } = useGeneralContext();

  const { setField: setBrandField } = useBrandStore();
  const { setField } = useProviderStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (error) {
      console.log(error,search);
      navigate("/login");
    }
  }, [error, navigate]);

  useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", search);
  }, [search, systemId]);

  useEffect(() => {
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

  const [data, setData] = useState<ProviderItemTbl[]>([]);

  //console.log(data, "data");
  const [skipPageReset, setSkipPageReset] = useState(false);

  // Custom cell click handler for Table
  const handleCellClick = (value:any) => {
    if ( onShowDetails) {
      onShowDetails(convertToLatinDigits(value));
    } 
  };

  useEffect(() => {
    setData(
      providerList.rpProviders.map((item, idx) => ({
        index: convertToFarsiDigits(idx + 1),
        name: item.name,
        cnt: convertToFarsiDigits(item.cnt),
        total: convertToFarsiDigits(formatNumberWithCommas(item.total)),
        offerCnt: convertToFarsiDigits(item.offerCnt),
        id: convertToFarsiDigits(item.id),
      }))
    );
  }, [providerList.rpProviders]);

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const { height, width } = useCalculateTableHeight();

  return (
    <div className="p-2 m-2 w-full md:h-full bg-white rounded-md">
      <ProviderProducerParams
        brand={brand}
        setBrand={setBrand}
        sanadKind={sanadKind}
        setSanadKind={setSanadKind}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setSearch={setSearch}
      />

      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : providerList.err !== 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {providerList.msg}
        </p>
      ) : (
        <div
          className="mt-2 overflow-y-auto"
          style={width > 640 ? { height: height } : { height: "fit" }}
        >
          <TTable
            columns={columns}
            data={data}
            //updateMyData={updateMyData}
            skipPageReset={skipPageReset}
            //fontSize="14px"
            hasSumRow={true}
          />
        </div>
      )}
    </div>
  );
}
