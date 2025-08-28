import React, { useEffect, useState } from "react";
import Checkbox from "../controls/Checkbox";
import PersianDatePicker from "../controls/PersianDatePicker";
import AutoComplete from "../controls/AutoComplete";
import { useBrand } from "../../hooks/useBrands";
import { useGeneralContext } from "../../context/GeneralContext";
import ModalMessage from "../layout/ModalMessage";
import { DefaultOptionTypeStringId } from "../../types/general";

type ProviderProducerParamsProps = {
  brand: { id: string; title: string } | null;
  setBrand: (brand: { id: string; title: string } | null) => void;
  sanadKind: { id: string; title: string } | null;
  setSanadKind: (sanadKind: { id: string; title: string } | null) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  setSearch:  React.Dispatch<React.SetStateAction<string>>
};

const ProviderProducerParams = ({
  brand,
  setBrand,
  sanadKind,
  setSanadKind,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setSearch,
}: ProviderProducerParamsProps) => {
  const { brands } = useBrand();
  const [hasDate, setHasDate] = useState<boolean>(false);

  const type = [
    { id: "2", title: "فروش" },
    { id: "4", title: "برگشت از فروش" },
  ];

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

  return (
    <div className="w-full flex flex-col 2xl:flex-row justify-between items-center gap-2 mb-2">
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="w-full flex items-center gap-2">
          <Checkbox
            name="DateCheckbox"
            onChange={handleCheckboxChange}
            value={hasDate}
          />
          <label className="text-sm md:text-base w-10 text-left">تاریخ:</label>
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
          <label htmlFor="type" className="text-sm md:text-base w-24 text-left">
            نوع:
          </label>
          <AutoComplete
            options={type}
            value={sanadKind}
            handleChange={(_event, newValue) => {
              return setSanadKind(newValue as DefaultOptionTypeStringId);
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
              return setBrand(newValue as DefaultOptionTypeStringId);
            }}
            setSearch={setSearch}
            showLabel={false}
            inputPadding="0 !important"
          />
        </div>
      </div>
      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="تاریخ انتخابی باید بیشتر از تاریخ شروع باشد."
      />
    </div>
    
  );
};

export default ProviderProducerParams;
