import PageTitle from "../../components/layout/PageTitle";
import { useBrandStore } from "../../store/brandStore";
import React, { useEffect, useState } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import ReportIcon from "../../assets/images/GrayThem/report16.png";
import { useParams } from "react-router-dom";
import { useProducerList } from "../../hooks/useProducerList";
import ProducerListForm from "../../components/producer/ProducerListForm";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import ExcelExport from "../../utilities/ExcelExport";

export const columns = [
  {
    Header: "   ",
    width: "5%",
    columns: [
      {
        Header: "ردیف",
        accessor: "index",
        width: "5%",
      },
    ],
  },
  {
    Header: "  ",
    width: "17%",
    columns: [
      {
        Header: "نام کالا",
        accessor: "name",
        width: "17%",
      },
    ],
  },
  {
    Header: "ریالی",
    width: "20%",
    columns: [
      {
        Header: "تعداد",
        accessor: "cnt",
        width: "10%",
      },
      {
        Header: "مبلغ",
        accessor: "total",
        width: "10%",
      },
    ],
  },
  {
    Header: "آفر",
    width: "5%",
    columns: [
      {
        Header: "تعداد",
        accessor: "offerCnt",
        width: "5%",
      },
    ],
  },
];

export default function ProducerList() {
  const { producerList } = useProducerList();

  const dynamicColumns = React.useMemo(
    () => [
      {
        Header: "تامین",
        backgroundColor: "#e3f2fd",
        width:
          (
            Math.round(50 / producerList.producers.length) *
            producerList.producers.length
          ).toString() + "%",
        columns: producerList.producers.map((producer) => ({
          Header: producer.name,
          accessor: producer.id.toString(),
          width:
            Math.round(50 / producerList.producers.length).toString() + "%",
          backgroundColor: "#e3f2fd",
        })),
      },
    ],
    [producerList.producers]
  );

  const rotation = React.useMemo(
    () => [
      {
        Header: " ",
        width: "3%",
        columns: [
          {
            Header: " ",
            accessor: "id",
            width: "3%",
            Cell: ({ value }: any) => (
              <img
                src={ReportIcon}
                onClick={() => console.log(value)} //handleCellClick(value)}
                className="cursor-pointer w-6 h-6"
                alt="report"
              />
            ),
          },
        ],
      },
    ],
    []
  );
  //union all columns
  const allColumns = React.useMemo(
    () => [...columns, ...dynamicColumns, ...rotation],
    [dynamicColumns, rotation]
  );
  const { setField } = useBrandStore();
  const { systemId } = useGeneralContext();
  const { id } = useParams();

  const [brand, setBrand] = useState<{ id: string; title: string } | null>({
    id: "0",
    title: "",
  });
  const [sanadKind, setSanadKind] = useState<{
    id: string;
    title: string;
  } | null>({
    id: "2",
    title: "فروش",
  });

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setData(
      producerList.rpProducts.map((product, i) => {
        // Create an object with dynamic keys for each producer's amnt
        const dynamicAmnts: Record<string, string> = {};
        product.rpProducers.forEach((producer) => {
          dynamicAmnts[producer.id.toString()] = convertToFarsiDigits(
            producer.amnt || 0
          );
        });
        return {
          ...product,
          ...dynamicAmnts, // Spread dynamic amnt fields
          index: convertToFarsiDigits(i + 1),
          id: convertToFarsiDigits(product.id),
          cnt: convertToFarsiDigits(product.cnt),
          name: product.name,
          offerCnt: convertToFarsiDigits(product.offerCnt),
          total: convertToFarsiDigits(formatNumberWithCommas(product.total)),
        };
      })
    );
  }, [producerList.rpProducts]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    setField("accSystem", systemId);
  }, []);

  return (
    <div className={`sm:h-[calc(100vh-72px)] flex flex-col bg-gray-200 pt-2`}>
      {/* Top header */}
      {!id ? (
        <header className="flex items-center justify-between border-gray-300">
          <PageTitle />
          <ExcelExport data={data} headCells={allColumns} />
        </header>
      ) : null}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <ProducerListForm
          data={data} //{rpProducts}
          headCells={allColumns}
          brand={brand}
          setBrand={setBrand}
          sanadKind={sanadKind}
          setSanadKind={setSanadKind}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          //onShowDetails={handleShowDetails}
        />
      </main>
      {/*
      {hasDetails && (
        <ModalForm isOpen={detailsOpen} onClose={handleCloseDetails} title="جزئیات گردش">
          {selectedProductId && (
            <ProviderListDetails
              productId={selectedProductId}
              brand={brand}
              sanadKind={sanadKind}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </ModalForm>
      )}*/}

      {/* Footer */}
    </div>
  );
}
