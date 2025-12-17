import { useEffect, useState } from "react";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { useGeneralContext } from "../../context/GeneralContext";
import { useCustomerStore } from "../../store/customerStore";
import { useBrand } from "../../hooks/useBrands";
import { useBrandStore } from "../../store/brandStore";
import { Fields } from "./InvoiceReceiptShow";
import { useProductStore } from "../../store/productStore";
import {
  DefaultOptionType,
  DefaultOptionTypeStringId,
  SearchItem,
} from "../../types/general";
import PersianDatePicker from "../controls/PersianDatePicker";
import ModalMessage from "../layout/ModalMessage";
import AutoCompleteSearch from "../workflow/workflowMap/AutoCompleteSearch";

type Props = {
  // canEditForm1Mst1: boolean;
  canEditForm: boolean;
  fields: Fields;
  setFields: React.Dispatch<React.SetStateAction<Fields>>;
  salesPricesSearchResponse: SearchItem[];
};
const InvoiceReceipShowHeader = ({
  //canEditForm1Mst1,
  canEditForm,
  fields,
  setFields,
  salesPricesSearchResponse,
}: Props) => {
  const { customers } = useCustomers();
  //const [cusomerSearch, setCusomerSearch] = useState<string>("");
  const [isCustomerEntered, setIsCustomerEntered] = useState<boolean>(false);
  const [cusomerSearchCondition, setCusomerSearchCondition] =
    useState<string>("");
  const [brandsearch, setBrandSearch] = useState<string>("");
  const [salesPricesearch, setSalesPriceSearch] = useState<string>("");
  const { systemId, yearId } = useGeneralContext();
  const { setField: setCusomerField } = useCustomerStore();
  const { setField: setBrandField } = useBrandStore();
  const { setField: setSalesPriceField } = useProductStore();

  useEffect(() => {
    setCusomerField("systemIdCustomerSearch", systemId);
    setCusomerField("yearIdCustomerSearch", yearId);
    setCusomerField("search", cusomerSearchCondition);
  }, [cusomerSearchCondition, systemId, yearId]);
  //for api/Customer/search?search=search&page=1&lastId=0
  /*useEffect(() => {
    setCusomerField("systemIdCustomerSearch", systemId);
    setCusomerField("yearIdCustomerSearch", yearId);
    setCusomerField("search", cusomerSearch);
  }, [cusomerSearch, systemId,yearId]);*/

  useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandsearch);
  }, [brandsearch, systemId]);
  const { brands } = useBrand();
  //for api/Product/salesPricesSearch req
  useEffect(() => {
    setSalesPriceField("salesPricesSearchSearch", salesPricesearch);
    setSalesPriceField("salesPricesSearchPage", 1);
    setSalesPriceField("salesPricesSearchLastId", 0);
  }, [salesPricesearch]);

  //const { salesPricesSearchResponse } = useProducts();

  const { isModalOpen, setIsModalOpen } = useGeneralContext();
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

  const body1 = (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <AutoCompleteSearch
          label="تامین کننده"
          labelWidth="w-20"
          setField={setCusomerField}
          fieldValues={[
            { field: "systemIdCustomerSearch", value: systemId },
            { field: "yearIdCustomerSearch", value: yearId },
            { field: "page", value: 1 },
            { field: "lastId", value: 0 },
            { field: "centerType", value: 0 },
          ]}
          fieldSearch="search"
          selectedOption={
            {
              id: fields.customer?.id ?? 0,
              title: fields.customer?.title ?? "",
            } as DefaultOptionType
          }
          setSelectedOption={(newValue: any) => {
            if (newValue) {
              setFields((prev: Fields) => ({
                ...prev,
                customer: {
                  id: String(newValue.id),
                  title: newValue.title,
                },
              }));
            } else {
              setFields((prev: Fields) => ({
                ...prev,
                customer: null,
              }));
            }
          }}
          options={customers.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isCustomerEntered}
          setIsEntered={setIsCustomerEntered}
        />
        {/*<div className="w-full flex">
          <label className="p-1 w-24 text-left">تامین کننده:</label>
          <div className="bg-slate-50 flex w-full">
            <AutoComplete
              disabled={!canEditForm}
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={fields.customer}
              handleChange={(_event, newValue) => {
                return setFields((prev: Fields) => {
                  return {
                    ...prev,
                    customer: newValue as DefaultOptionTypeStringId,
                  };
                });
              }}
              backgroundColor={!canEditForm ? "inherit" : "white"}
              setSearch={setCusomerSearch}
              showLabel={false}
              inputPadding="0 !important"
              showClearIcon={false}
              outlinedInputPadding="5px"
            />
          </div>
        </div>*/}
        <div className="flex">
          <label className="p-1 w-24 text-left">سررسید:</label>
          <input
            disabled={!canEditForm}
            value={convertToFarsiDigits(fields.payDuration.toString())}
            onChange={(e) =>
              setFields((prev: Fields) => ({
                ...prev,
                payDuration: Number(convertToLatinDigits(e.target.value)),
              }))
            }
            className="text-sm text-gray-800 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex">
          <label className="p-1 w-24 text-left">تاریخ:</label>
          <input
            type="text"
            value={fields.dat}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex">
          <label className="p-1 w-24 text-left  ">ساعت:</label>
          <input
            type="text"
            value={fields.tim}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex">
        <label className="p-1 w-24 text-left">توضیحات:</label>
        <input
          disabled={!canEditForm}
          type="text"
          value={convertToFarsiDigits(fields.dsc)}
          onChange={(e) =>
            setFields((prev: Fields) => ({
              ...prev,
              dsc: e.target.value,
            }))
          }
          className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const handleDateChange = (event: {
    target: { name: string; value: Date | null };
  }) => {
    if (event.target.name === "fDate") {
      setFields((prev: Fields) => ({
        ...prev,
        fdate: event.target.value,
      }));
    } else {
      console.log(event.target.value);
      console.log(fields.fdate);
      if (
        event.target.value &&
        fields.fdate &&
        event.target.value < fields.fdate
      ) {
        console.log(event.target.value, "2if");
        console.log(fields.fdate, "2if");
        setIsModalOpen(true);
        return;
      }
      setFields((prev: Fields) => ({
        ...prev,
        tdate: event.target.value,
      }));
    }
  };

  const body2 = (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      {canEditForm && (
        <div className="flex items-center justify-between gap-2">
          <div className="w-full flex items-center">
            <label className="p-1 w-32 md:w-24 text-left">تامین کننده:</label>
            <div className="bg-slate-50 flex w-full">
              <AutoComplete
                options={customers.map((b) => ({
                  id: b.id,
                  title: b.text,
                }))}
                value={fields.customerCondition as DefaultOptionTypeStringId[]}
                handleChange={(_event, newValue) => {
                  return setFields((prev: Fields) => {
                    return {
                      ...prev,
                      customerCondition:
                        newValue as DefaultOptionTypeStringId[],
                    };
                  });
                }}
                multiple={true}
                setSearch={setCusomerSearchCondition}
                showLabel={false}
                showClearIcon={false}
                outlinedInputPadding="10px"
                placeholder={
                  Array.isArray(fields.customerCondition) &&
                  fields.customerCondition.length > 0
                    ? undefined
                    : "تامین کننده را انتخاب کنید..."
                }
              />
            </div>
          </div>
        </div>
      )}
      {canEditForm && (
        <div className="w-full flex items-center">
          <label htmlFor="year" className="p-1 w-32 md:w-24 text-left">
            برند:
          </label>
          <div className="bg-slate-50 flex w-full">
            <AutoComplete
              options={brands.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={fields.brand}
              handleChange={(_event, newValue) => {
                return setFields((prev: Fields) => {
                  return {
                    ...prev,
                    brand: newValue as DefaultOptionTypeStringId[],
                  };
                });
              }}
              multiple={true}
              setSearch={setBrandSearch}
              showLabel={false}
              outlinedInputPadding="10px"
              placeholder={
                Array.isArray(fields.brand) && fields.brand.length > 0
                  ? undefined
                  : "برند را انتخاب کنید..."
              }
            />
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row w-full md:justify-center md:items-center">
        <div className="md:w-1/3 flex items-center">
          <label className="p-1 w-32 md:w-28 text-left">قیمت:</label>
          <div className="bg-slate-50 flex w-full">
            <AutoComplete
              disabled={!canEditForm}
              options={salesPricesSearchResponse.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={fields.price}
              handleChange={(_event, newValue) => {
                return setFields((prev: Fields) => {
                  return { ...prev, price: newValue as DefaultOptionType };
                });
              }}
              setSearch={setSalesPriceSearch}
              showLabel={false}
              outlinedInputPadding="10px"
              backgroundColor={!canEditForm ? "inherit" : "white"}
            />
          </div>
        </div>
        <div className="md:w-1/3 flex items-center">
          <label className="p-1 w-32 text-left">فروش از تاریخ:</label>
          <PersianDatePicker
            name="fDate"
            label="از:"
            value={fields.fdate}
            onChange={handleDateChange}
            disabled={canEditForm ? false : true}
          />
        </div>
        <div className="md:w-1/3 flex items-center">
          <label className="p-1 w-32 text-left">تا تاریخ:</label>
          <PersianDatePicker
            name="tDate"
            label="تا:"
            value={fields.tdate}
            onChange={handleDateChange}
            disabled={canEditForm ? false : true}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {body1}
      <p className="mt-2 px-2 text-sm">شرایط</p>
      {body2}
      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="تاریخ انتخابی باید بیشتر از تاریخ شروع باشد."
        backgroundColor="bg-red-200"
        color="text-red-800"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        visibleButton={false}
      />
    </>
  );
};

export default InvoiceReceipShowHeader;
