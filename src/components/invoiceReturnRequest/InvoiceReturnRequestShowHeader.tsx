import { useEffect, useState } from "react";
//import AutoComplete from "../controls/AutoComplete";
import { DefaultOptionType } from "../../types/general";
import { useCustomers } from "../../hooks/useCustomers";
import { convertToFarsiDigits } from "../../utilities/general";
import { colors } from "../../utilities/color";
import Button from "../controls/Button";
import { useGeneralContext } from "../../context/GeneralContext";
import { useCustomerStore } from "../../store/customerStore";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";

type Props = {
  invoiceReturnRequestShowResponse: any; //InvoiceReturnRequestShowResponse;
  canEditForm: boolean;
  setShowAttachment: React.Dispatch<React.SetStateAction<boolean>>;
  dsc: string;
  setDsc: React.Dispatch<React.SetStateAction<string>>;
  cnt: string;
  formKind: "isRequest" | "isPreInvoice";
};

const InvoiceReturnRequestShowHeader = ({
  invoiceReturnRequestShowResponse,
  canEditForm,
  setShowAttachment,
  dsc,
  setDsc,
  cnt,
  formKind,
}: Props) => {
  const { customers } = useCustomers();
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  //const [search, setSearch] = useState<string>("");
  const { systemId, yearId } = useGeneralContext();
  const { setField: setCustomerField } = useCustomerStore();
  const [isCustomerEntered, setIsCustomerEntered] = useState<boolean>(false);

  useEffect(() => {
    setCustomer({
      id:
        formKind === "isRequest"
          ? invoiceReturnRequestShowResponse.data.result.invoiceReturnRequest
              .cId
          : invoiceReturnRequestShowResponse.data.result.preInvoiceReturn.cId,
      title:
        formKind === "isRequest"
          ? invoiceReturnRequestShowResponse.data.result.invoiceReturnRequest
              .srName
          : invoiceReturnRequestShowResponse.data.result.preInvoiceReturn.srName,
    });
    setDsc(
      formKind === "isRequest"
        ? invoiceReturnRequestShowResponse.data.result.invoiceReturnRequest.dsc
        : invoiceReturnRequestShowResponse.data.result.preInvoiceReturn.dsc
    );
  }, [invoiceReturnRequestShowResponse, formKind]);

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <AutoCompleteSearch
          label="خریدار"
          labelWidth="w-16"
          setField={setCustomerField}
          fieldValues={[
            { field: "systemIdCustomerSearch", value: systemId },
            { field: "yearIdCustomerSearch", value: yearId },
            { field: "page", value: 1 },
            { field: "lastId", value: 0 },
            { field: "centerType", value: 0 },
          ]}
          fieldSearch="search"
          selectedOption={ {id: customer?.id ?? 0, title: customer?.title ?? ""} as DefaultOptionType }
          setSelectedOption={(newValue: any) => {
            if (newValue) {
            setCustomer({
                id: newValue.id,
                title: newValue.title,
              });
            } else {
              setCustomer(null);
            }
          }}
          options={customers.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isCustomerEntered}
          setIsEntered={setIsCustomerEntered}
          disabled={!canEditForm}
        />
        {/*<div className="w-full md:w-3/4 flex justify-center items-center">
          <label className="p-1 w-20 text-left">خریدار:</label>
          <div className="flex w-full rounded-md">
            <AutoComplete
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={customer}
              handleChange={(_event, newValue) => {
                return setCustomer(newValue as DefaultOptionType | null);
              }}
              disabled={!canEditForm}
              setSearch={setSearch}
              showLabel={false}
              backgroundColor={!canEditForm ? "inherit" : "white"}
              showClearIcon={false}
              inputPadding="0 !important"
            />
          </div>
        </div>*/}
        <div className="w-full md:w-1/4 flex">
          <label className="p-1 w-20 md:w-12 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              formKind === "isRequest"
                ? invoiceReturnRequestShowResponse.data.result.invoiceReturnRequest
                .dat
                : invoiceReturnRequestShowResponse.data.result.preInvoiceReturn.dat
                .dat
            )}
            disabled={!canEditForm}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="md:w-full flex">
          <label className="p-1 w-20 text-left">توضیحات:</label>
          <input
            type="text"
            value={convertToFarsiDigits(dsc)}
            onChange={(e) => setDsc(e.target.value)}
            disabled={!canEditForm}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        {formKind === "isRequest" && (
          <Button
            text={`ضمائم (${cnt})`}
            backgroundColor={colors.blue_400}
            backgroundColorHover={colors.blue_500}
            variant="w-32"
            onClick={() => {
              setShowAttachment(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceReturnRequestShowHeader;
