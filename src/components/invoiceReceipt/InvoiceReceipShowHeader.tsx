import { useEffect, useState } from "react";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { useGeneralContext } from "../../context/GeneralContext";
import { useCustomerStore } from "../../store/customerStore";
import { useBrandStore } from "../../store/brandStore";
import { useProductStore } from "../../store/productStore";
import {
  DefaultOptionType,
  DefaultOptionTypeStringId,
  SearchItem,
} from "../../types/general";
import PersianDatePicker from "../controls/PersianDatePicker";
import ModalMessage from "../layout/ModalMessage";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { useBrand } from "../../hooks/useBrands";
import { Fields } from "./InvoiceReceiptShow1";

type Props = {
  // canEditForm1Mst1: boolean;
  //brands: SearchItem[];
  customers: SearchItem[];
  canEditForm: boolean;
  fields: Fields;
  setFields: React.Dispatch<React.SetStateAction<Fields>>;
  salesPricesSearchResponse: SearchItem[];
};
const InvoiceReceipShowHeader = ({
  //canEditForm1Mst1,
  //brands,
  customers,
  canEditForm,
  fields,
  setFields,
  salesPricesSearchResponse,
}: Props) => {
  //const [cusomerSearch, setCusomerSearch] = useState<string>("");
  const [isCustomerEntered, setIsCustomerEntered] = useState<boolean>(false);
  const [isCustomerConditionEntered, setIsCustomerConditionEntered] =
    useState(false);
  const [isBrandsEntered, setIsBrandsEntered] = useState(false);
  //const [brandsearch, setBrandSearch] = useState<string>("");
  //const [salesPricesearch, setSalesPriceSearch] = useState<string>("");
  const [isSalesPricesEntered, setIsSalesPricesEntered] =
    useState<boolean>(false);
  const { systemId, yearId } = useGeneralContext();
  const { setField: setCusomerField } = useCustomerStore();
  const { setField: setBrandField } = useBrandStore();
  const { setField: setSalesPriceField } = useProductStore();
  const { brands } = useBrand();

  /*useEffect(() => {
    setCusomerField("systemIdCustomerSearch", systemId);
    setCusomerField("yearIdCustomerSearch", yearId);
    setCusomerField("search", customerSearchCondition);
  }, [customerSearchCondition, systemId, yearId]);*/

  /*useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandsearch);
    //setBrandField("page", 1);
    //setBrandField("lastId", 0);
    //setBrandField("usrPerm", 0);
  }, [brandsearch, systemId]);*/

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
              id: fields?.customer?.id ?? 0,
              title: fields?.customer?.title ?? "",
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
          options={customers?.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isCustomerEntered}
          setIsEntered={setIsCustomerEntered}
          placeholder={
            Array.isArray(fields?.customerCondition) &&
              fields?.customerCondition.length > 0
              ? undefined
              : "تامین کننده را انتخاب کنید..."
          }
        />
        <div className="flex">
          <label className="p-1 w-24 text-left">سررسید:</label>
          <input
            disabled={!canEditForm}
            value={convertToFarsiDigits(fields?.payDuration.toString())}
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
            value={fields?.dat}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex">
          <label className="p-1 w-24 text-left  ">ساعت:</label>
          <input
            type="text"
            value={fields?.tim}
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
          value={convertToFarsiDigits(fields?.dsc)}
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
      console.log(fields?.fdate);
      if (
        event.target.value &&
        fields?.fdate &&
        event.target.value < fields?.fdate
      ) {
        console.log(event.target.value, "2if");
        console.log(fields?.fdate, "2if");
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
            selectedOption={fields.customerCondition}
            setSelectedOption={(newValue) => {
              setFields((prev: Fields) => ({
                ...prev,
                customerCondition: newValue as DefaultOptionTypeStringId[],
              }));
            }}
            options={customers.map((b: any) => ({
              id: b.id,
              text: b.text,
            }))}
            isEntered={isCustomerConditionEntered}
            setIsEntered={setIsCustomerConditionEntered}
            multiple={true}
            placeholder={
              Array.isArray(customers) && customers.length > 0
                ? undefined
                : "تامین کننده را انتخاب کنید..."
            }
          />
          {/*<div className="w-full flex items-center">
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
                setSearch={setCustomerSearchCondition}
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
          </div>*/}
        </div>
      )}
      {canEditForm && (
        <AutoCompleteSearch
          label="برند"
          labelWidth="w-20"
          setField={setBrandField}
          fieldValues={[{ field: "accSystem", value: systemId }]}
          fieldSearch="search"
          selectedOption={fields.brand}
          setSelectedOption={(newValue) => {
            setFields((prev: Fields) => ({
              ...prev,
              brand: Array.isArray(newValue)
                ? (newValue as DefaultOptionTypeStringId[])
                : newValue
                  ? [newValue as DefaultOptionTypeStringId]
                  : [],
            }));
          }}
          options={brands.map((b: any) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isBrandsEntered}
          setIsEntered={setIsBrandsEntered}
          multiple={true}
          placeholder={
            Array.isArray(fields.customerCondition) &&
              fields.customerCondition.length > 0
              ? undefined
              : "برند را انتخاب کنید..."
          }
        />
      )}
      <div className="flex flex-col md:flex-row w-full md:justify-center md:items-center">
        <AutoCompleteSearch
          label="قیمت"
          labelWidth="w-20"
          setField={setSalesPriceField}
          fieldValues={[
            { field: "lastId", value: 0 },
            { field: "salesPricesSearchPage", value: 1 },
          ]}
          fieldSearch="salesPricesSearch"
          selectedOption={
            {
              id: fields?.price?.id ?? 0,
              title: fields?.price?.title ?? "",
            } as DefaultOptionType
          }
          setSelectedOption={
            fields?.price
              ? (newValue: any) => {
                setFields((prev: Fields) => ({
                  ...prev,
                  price: newValue as DefaultOptionType,
                }));
              }
              : undefined
          }
          options={salesPricesSearchResponse?.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isSalesPricesEntered}
          setIsEntered={setIsSalesPricesEntered}
          placeholder="قیمت را انتخاب کنید..."
        />
        <div className="md:w-1/3 flex items-center">
          <label className="p-1 w-32 text-left">فروش از تاریخ:</label>
          <PersianDatePicker
            name="fDate"
            label="از:"
            value={fields?.fdate}
            onChange={handleDateChange}
            disabled={canEditForm ? false : true}
          />
        </div>
        <div className="md:w-1/3 flex items-center">
          <label className="p-1 w-32 text-left">تا تاریخ:</label>
          <PersianDatePicker
            name="tDate"
            label="تا:"
            value={fields?.tdate}
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
