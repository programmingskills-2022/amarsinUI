import { useEffect, useState } from "react";
import { useDefinitionInvironment } from "../../hooks/useDefinitionInvironment";
import { DefaultOptionType } from "../../types/general";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  convertToPersianDate,
  currencyStringToNumber,
  formatNumberWithCommas,
  parsePersianDateString,
} from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import { PayRequestResponse } from "../../types/payRequest";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useCustomers } from "../../hooks/useCustomers";
//import { AuthApiResponse } from "../../types/auth";
import { colors } from "../../utilities/color";
import Button from "../controls/Button";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import PersianDatePicker from "../controls/PersianDatePicker";

type Props = {
  cnt: number; //attachment count
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  payRequestResponse: PayRequestResponse;
  //authApiResponse: AuthApiResponse;
  customer: DefaultOptionType | null;
  setCustomer: (customer: DefaultOptionType | null) => void;
  system: DefaultOptionType | null;
  setSystem: (system: DefaultOptionType | null) => void;
  year: DefaultOptionType | null;
  setYear: (year: DefaultOptionType | null) => void;
  setShowAttachment: (showAttachment: boolean) => void;
  isNew: boolean;
  dsc: string;
  setDsc: (dsc: string) => void;
  dat: string;
  setDat: (dat: string) => void;
  tim: string;
  setTim: (tim: string) => void;
  fDate: Date | null;
  setFDate: (fDate: Date | null) => void;
  tDate: Date | null;
  setTDate: (tDate: Date | null) => void;
  dueDate: Date | null;
  setDueDate: (dueDate: Date | null) => void;
  settleAmnt: string;
  setSettleAmnt: (settleAmnt: string) => void;
  providerAmnt: string;
  setProviderAmnt: (providerAmnt: string) => void;
};

const PayRequestShowHeader = ({
  cnt,
  workFlowRowSelectResponse,
  payRequestResponse,
  // authApiResponse,
  customer,
  setCustomer,
  system,
  setSystem,
  year,
  setYear,
  setShowAttachment,
  isNew,
  dsc,
  setDsc,
  dat,
  setDat,
  tim,
  setTim,
  fDate,
  setFDate,
  tDate,
  setTDate,
  dueDate,
  setDueDate,
  settleAmnt,
  setSettleAmnt,
  providerAmnt,
  setProviderAmnt,
}: Props) => {
  const canEditForm1Mst1 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Mst1;
  const canEditForm1Mst2 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Mst2;
  const { definitionInvironment } = useDefinitionInvironment();
  //const initData = authApiResponse?.data.result.initData;
  const { customers } = useCustomers();
  const { setField: setCustomerField } = useCustomerStore();
  const { systemId, yearId } = useGeneralContext();
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [systemSearch, setSystemSearch] = useState<string>("");
  const [yearSearch, setYearSearch] = useState<string>("");

  const { definitionDateTime } = useDefinitionInvironment();
  useEffect(() => {
    setCustomerField("systemId", systemId);
    setCustomerField("yearId", yearId);
    setCustomerField("search", customerSearch);
    setCustomerField("page", 1);
    setCustomerField("lastId", 0);
    setCustomerField("centerType", 0);
    console.log(
      customerSearch,
      systemSearch,
      yearSearch,
      canEditForm1Mst1,
      canEditForm1Mst2,
      "canEditForm1Mst1"
    );
  }, [systemId, yearId, customerSearch]);

  useEffect(() => {
    setCustomer(
      isNew
        ? null
        : {
            id:
              payRequestResponse.data.result.payRequest.payRequests?.[0]
                ?.customerId ?? 0,
            title:
              payRequestResponse.data.result.payRequest.payRequests?.[0]
                ?.srName ?? "",
          }
    );
    //initializing variables
    setDsc(
      isNew
        ? ""
        : convertToFarsiDigits(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.dsc ??
              ""
          )
    );
    setDat(
      isNew
        ? convertToFarsiDigits(
            convertToPersianDate(new Date(definitionDateTime.date))
          )
        : convertToFarsiDigits(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.dat ??
              ""
          )
    );
    setTim(
      isNew
        ? convertToFarsiDigits(definitionDateTime.time)
        : convertToFarsiDigits(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.tim ??
              ""
          )
    );
    setFDate(
      isNew
        ? new Date(definitionDateTime.date)
        : parsePersianDateString(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.fDate ??
              ""
          )
    );
    setTDate(
      isNew
        ? new Date(definitionDateTime.date)
        : parsePersianDateString(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.tDate ??
              ""
          )
    );
    setDueDate(
      isNew
        ? new Date(definitionDateTime.date)
        : parsePersianDateString(
            payRequestResponse.data.result.payRequest.payRequests?.[0]
              ?.dueDate ?? ""
          )
    );
    setSettleAmnt(
      isNew
        ? ""
        : convertToFarsiDigits(
            formatNumberWithCommas(
              Number(
                payRequestResponse.data.result.payRequest.payRequests?.[0]
                  ?.settleAmnt ?? 0
              )
            )
          )
    );
    setProviderAmnt(
      isNew
        ? ""
        : convertToFarsiDigits(
            formatNumberWithCommas(
              Number(
                payRequestResponse.data.result.payRequest.payRequests?.[0]
                  ?.providerAmnt ?? 0
              )
            )
          )
    );
  }, [payRequestResponse]);

  const inputElement = (
    value: string,
    disabled: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <div className="flex w-full">
        <input
          type="text"
          value={convertToFarsiDigits(value)}
          disabled={disabled}
          onChange={onChange}
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          style={{
            backgroundColor: disabled ? colors.gray50 : "inherit",
            color: disabled ? colors.gray600 : "inherit",
          }}
        />
      </div>
    );
  };
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="w-1/4 flex justify-center items-center">
          <label className="p-1 w-28 text-left">سیستم:</label>
          <div className="bg-slate-50 flex w-full rounded-md">
            <AutoComplete
              options={definitionInvironment?.systems ?? []}
              value={system}
              handleChange={(_event, newValue) => {
                return setSystem(newValue as DefaultOptionType);
              }}
              setSearch={setSystemSearch}
              showLabel={false}
              inputPadding="0 !important"
              showClearIcon={false}
              changeColorOnFocus={true}
              disabled={!canEditForm1Mst1}
              backgroundColor={canEditForm1Mst1 ? colors.gray100 : "inherit"}
            />
          </div>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <label className="p-1 w-20 text-left">سال مالی:</label>
          <div className="bg-slate-50 flex w-full rounded-md">
            <AutoComplete
              options={
                definitionInvironment?.years !== undefined
                  ? definitionInvironment?.years.map((b) => ({
                      id: b.id,
                      title: convertToFarsiDigits(b.code),
                    }))
                  : []
              }
              value={year}
              handleChange={(_event, newValue) => {
                return setYear(newValue as DefaultOptionType);
              }}
              setSearch={setYearSearch}
              showLabel={false}
              inputPadding="0 !important"
              showClearIcon={false}
              changeColorOnFocus={true}
              disabled={!canEditForm1Mst1}
              backgroundColor={canEditForm1Mst1 ? colors.gray100 : "inherit"}
            />
          </div>
        </div>
        <div className="w-1/4 flex">
          <label className="p-1 w-24 text-left">تاریخ:</label>
          {inputElement(dat, true, (e) => {
            setDat(convertToLatinDigits(e.target.value));
          })}
        </div>
        <div className="flex w-1/4">
          <label className="p-1 w-36 text-left">ساعت:</label>
          {inputElement(tim, true, (e) => {
            setTim(convertToLatinDigits(e.target.value));
          })}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex w-1/2">
          <div className="w-full flex items-center gap-2">
            <label className="w-28 text-left">از تاریخ:</label>
            <PersianDatePicker
              name="fDate"
              label="تا:"
              value={fDate}
              fontSize="text-sm"
              onChange={(event) => setFDate(event.target.value as Date | null)}
              disabled={!canEditForm1Mst2}
            />
          </div>
          <div className="w-full flex items-center gap-2">
            <label className="w-20 text-left">تا تاریخ:</label>
            <PersianDatePicker
              name="tDate"
              label="تا:"
              value={tDate}
              fontSize="text-sm"
              onChange={(event) => setTDate(event.target.value as Date | null)}
              disabled={!canEditForm1Mst2}
            />
          </div>
          <div className="w-full flex items-center gap-2">
            <label className="w-20 text-left">سررسید:</label>
            <PersianDatePicker
              name="dueDate"
              label="سررسید:"
              value={dueDate}
              fontSize="text-sm"
              onChange={(event) =>
                setDueDate(event.target.value as Date | null)
              }
              disabled={!canEditForm1Mst2}
            />
          </div>
        </div>
        <div className="flex w-1/2">
          <div className="flex w-1/2">
            <label className="p-1 w-24 text-left">مبلغ تسویه:</label>
            {inputElement(settleAmnt, !canEditForm1Mst2, (e) => {
              setSettleAmnt(
                currencyStringToNumber(
                  convertToLatinDigits(e.target.value)
                ).toString()
              );
            })}
          </div>
          <div className="flex w-1/2">
            <label className="p-1 w-48 text-left">مبلغ تامین کننده:</label>
            {inputElement(providerAmnt, !canEditForm1Mst2, (e) => {
              setProviderAmnt(
                currencyStringToNumber(
                  convertToLatinDigits(e.target.value)
                ).toString()
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <label className="p-1 w-24 text-left">طرف حساب:</label>
        <div className="bg-slate-50 flex w-full rounded-md">
          <AutoComplete
            options={customers.map((b) => ({
              id: b.id,
              title: b.text,
            }))}
            value={customer}
            handleChange={(_event, newValue) => {
              return setCustomer(newValue as DefaultOptionType | null);
            }}
            setSearch={setCustomerSearch}
            showLabel={false}
            inputPadding="0 !important"
            showClearIcon={false}
            changeColorOnFocus={true}
            disabled={!canEditForm1Mst2}
            backgroundColor={canEditForm1Mst2 ? colors.gray100 : "inherit"}
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <label className="p-1 w-24 text-left">توضیحات:</label>
        {inputElement(dsc, !canEditForm1Mst2, (e) => {
          setDsc(convertToLatinDigits(e.target.value));
        })}
        <Button
          text={`ضمائم ${ `(${convertToFarsiDigits(cnt)})`}`}
          backgroundColor={colors.blue_400}
          backgroundColorHover={colors.blue_500}
          variant="w-32"
          onClick={() => {
            setShowAttachment(true);
          }}
        />
      </div>
    </div>
  );
};

export default PayRequestShowHeader;
