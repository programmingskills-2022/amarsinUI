import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { useBrandStore } from "../../store/brandStore";
import { useBrand } from "../../hooks/useBrands";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../controls/AutoComplete";
import { Table } from "../controls/Table";
import { useGeneralContext } from "../../context/GeneralContext";
import PersianDatePicker from "../controls/PersianDatePicker";
import Checkbox from "../controls/Checkbox";
import { HeadCell, HeaderGroup } from "../../hooks/useTable";
import Modal from "../layout/Modal";
import { useProviderList } from "../../hooks/useProviderList";
import { ProviderItem } from "../../types/provider";
import { useProviderStore } from "../../store/providerStore";
import { convertPersianDate } from "../../utilities/general";
import ReportIcon from "../../assets/images/GrayThem/report16.png";

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

export const headCells: HeadCell<ProviderItem>[] = [
  {
    id: "index",
    label: "ردیف",
    disableSorting: true,
  },
  { id: "name", label: "نام کالا" },
  { id: "cnt", label: "تعداد", isNumber: true },
  { id: "total", label: "مبلغ", isNumber: true, isCurrency: true },
  { id: "offerCnt", label: "تعداد", isNumber: true },
  { id: "id", label: "...", icon: ReportIcon, hasDetails: true },
];

const headerGroups: HeaderGroup[] = [
  { label: "", colSpan: 1 },
  { label: "", colSpan: 1 },
  { label: "ریالی", colSpan: 2 },
  { label: "آفر", colSpan: 1 },
  { label: "", colSpan: 1 },
];

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
  const { providerList, error, isLoading } = useProviderList();

  const { systemId, yearId } = useGeneralContext();

  const [search, setSearch] = useState<string>("");

  const [hasDate, setHasDate] = useState<boolean>(false);

  const { setField: setBrandField } = useBrandStore();
  const { setField } = useProviderStore();
  //if error occurred then navigate to login page
  const navigate = useNavigate();

  const { isModalOpen, setIsModalOpen } = useGeneralContext();
  useEffect(() => {
    let timeoutId: number;
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

  const handleDateChange = (event: {
    target: { name: string; value: Date | null };
  }) => {
    if (event.target.name === "startDate") {
      setStartDate(event.target.value);
    } else {
      if (event.target.value && startDate && event.target.value < startDate) {
        setIsModalOpen(true);
        return;
      }
      setEndDate(event.target.value);
    }
  };

  const handleCheckboxChange = (event: {
    target: { name: string; value: boolean };
  }) => {
    if (event.target.value === true) {
      setStartDate(new Date());
      setEndDate(new Date());
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setHasDate(event.target.value);
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/login");
    }
  }, [error, navigate]);

  useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", search);
  }, [search, systemId]);
  const { brands } = useBrand();

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

  const type = [
    { id: "1", title: "فروش" },
    { id: "2", title: "برگشت از فروش" },
  ];

  // Custom cell click handler for Table
  const handleCellClick = (
    cell: HeadCell<ProviderItem>,
    item: ProviderItem
  ) => {
    if (cell.hasDetails && cell.id === "id" && onShowDetails) {
      onShowDetails(item.id.toString());
    } else if (cell.path) {
      navigate(`${cell.path}/${item[cell.id as keyof ProviderItem]}`);
    }
  };

  return (
    <Paper className="p-2 m-2 w-full h-full">
      <div className="w-full flex flex-col 2xl:flex-row justify-between items-center gap-2">
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <div className="w-full flex items-center gap-2  ">
            <Checkbox
              name="DateCheckbox"
              onChange={handleCheckboxChange}
              value={hasDate}
            />
            <label className="text-sm md:text-base w-10 text-left">
              تاریخ:
            </label>
            <PersianDatePicker
              name="startDate"
              label="از:"
              value={startDate}
              onChange={handleDateChange}
              disabled={!hasDate}
            />
          </div>
          <div className="w-full flex items-center gap-2">
            <label className="text-sm md:text-base w-24 text-left">تا:</label>
            <PersianDatePicker
              name="endDate"
              label="تا:"
              value={endDate}
              onChange={handleDateChange}
              disabled={!hasDate}
            />
          </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <div className="w-full flex items-center gap-2">
            <label
              htmlFor="type"
              className="text-sm md:text-base w-24 text-left"
            >
              نوع:
            </label>
            <AutoComplete
              options={type}
              value={sanadKind}
              handleChange={(_event, newValue) => {
                return setSanadKind(newValue);
              }}
              setSearch={setSearch}
              showLabel={false}
              inputPadding="0 !important"
            />
          </div>
          <div className="w-full flex items-center gap-2">
            <label
              htmlFor="brand"
              className="text-sm md:text-base w-24 text-left"
            >
              برند:
            </label>
            <AutoComplete
              options={brands.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={brand}
              handleChange={(_event, newValue) => {
                return setBrand(newValue);
              }}
              setSearch={setSearch}
              showLabel={false}
              inputPadding="0 !important"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : providerList.rpProviders.length > 0 ? (
        <div className="h-screen-minus-350 lg:h-screen-minus-200 overflow-y-auto">
          <Table
            data={providerList.rpProviders}
            headCells={headCells}
            resetPageSignal={brand?.id}
            headerGroups={headerGroups}
            // Pass custom cell click handler
            cellClickHandler={handleCellClick}
          />
        </div>
      ) : (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          هیچ کالایی یافت نشد.
        </p>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="تاریخ انتخابی باید بیشتر از تاریخ شروع باشد."
      />
    </Paper>
  );
}
