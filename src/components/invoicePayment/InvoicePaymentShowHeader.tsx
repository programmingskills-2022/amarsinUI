import { useEffect, useMemo, useRef, useState } from "react";
import AutoComplete from "../controls/AutoComplete";
import { DefaultOptionType, SearchItem } from "../../types/general";
import { useCustomers } from "../../hooks/useCustomers";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  convertToPersianDate,
  currencyStringToNumber,
  handleCurrencyInputChange,
  parsePersianDateString,
} from "../../utilities/general";
import {
  InvoicePaymentResponse,
  InvoicePaymentSaveRequest,
  InvoicePaymentSaveResponse,
} from "../../types/invoice";
import { useBankAccount } from "../../hooks/useBankAccount";
import { usePayment } from "../../hooks/usePayment";
import { usePaymentStore } from "../../store/paymentStore";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useCheques } from "../../hooks/useCheques";
import { useChequeStore } from "../../store/chequeStore";
import Input from "../controls/Input";
import { usePayRequest } from "../../hooks/usePayRequest";
import { usePayRequestStore } from "../../store/payRequestStore";
import PersianDatePicker from "../controls/PersianDatePicker";
import { useBankStore } from "../../store/bankStore";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useInvoiceStore } from "../../store/invoiceStore";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../../utilities/color";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";

type Props = {
  invoicePaymentResponse: InvoicePaymentResponse;
  canEditForm: boolean;
  invoicePaymentSave: UseMutateAsyncFunction<
    any,
    Error,
    InvoicePaymentSaveRequest,
    unknown
  >;
  isLoadingInvoicePaymentSave: boolean;
  invoicePaymentSaveResponse: InvoicePaymentSaveResponse;
  banks: SearchItem[];
};

const InvoicePaymentShowHeader = ({
  invoicePaymentResponse,
  canEditForm,
  invoicePaymentSave,
  isLoadingInvoicePaymentSave,
  invoicePaymentSaveResponse,
  banks,
}: Props) => {
  //برای نقدی
  const [fishNo, setFishNo] = useState("");
  const { invoiceId } = useInvoiceStore();
  const { cashPosSystemSearch } = useCheques();
  const { setField: setCashPosSystemField , setField: setChequeField } = useChequeStore();
  const [cashPosSystem, setCashPosSystem] = useState<DefaultOptionType | null>( //برای صندوق
    null
  );
  const [cashPosSystemEntered, setCashPosSystemEntered] = useState(false);
  //برای پوز
  const { chequeBookGetById } = usePayment();
  const [posSystemEntered, setPosSystemEntered] = useState(false);

  const [cash_PosSystem, setCash_PosSystem] =
    useState<DefaultOptionType | null>(null);
  //برای چک
  const [prsn, setPrsn] = useState(""); // در وجه
  const [sayadi, setSayadi] = useState(""); //  صیادی
  const [bank, setBank] = useState<DefaultOptionType | null>(null); // بانک (id:bankId)(title:bankName_Partners)
  const [isBankEntered, setIsBankEntered] = useState(false);
  const [transferenceOwner, setTransferenceOwner] = useState(""); // شعبه
  const [fixSerial, setFixSerial] = useState(""); // برای سریال
  const [accNo, setAccNo] = useState(""); //  برای شبا
  const { chequeBookSearchResponse, chequeBookDtlSearchResponse } =
    usePayRequest();
  const { setField: setPayRequestField } = usePayRequestStore();
  const [isChequeBookEntered, setIsChequeBookEntered] = useState(false);
  const [chequeBooks, setChequeBooks] = useState<DefaultOptionType[]>([]);
  const [acc_DefCheq, setAcc_DefCheq] = useState<DefaultOptionType | null>(
    null
  );
  const [cheqNoSearch, setCheqNoSearch] = useState(""); //  برای شماره چک و شماره
  const [cheqNo, setCheqNo] = useState<DefaultOptionType | null>(null);
  const [cheqNos, setCheqNos] = useState<DefaultOptionType[]>([]);
  const [sarDate, setSarDate] = useState<Date | null>(null); //  سررسید   convertToPersianDate(sarDate)
  const [isCheckChequeBook, setIsCheckChequeBook] = useState(false);
  //const { banks } = useBanks();
  const { setField: setBankField } = useBankStore();
  //برای واریز به حساب
  const [bankAccount, setBankAccount] = useState<DefaultOptionType | null>(
    null
  );
  const { bankAccountSearchResponse } = useBankAccount();
  const [isBankAccountEntered, setIsBankAccountEntered] = useState(false);
  const [peygiri, setPeygiri] = useState("");
  const [karmozd, setKarmozd] = useState("");
  const [Tafkik, setTafkik] = useState(false);
  //برای طرف حساب
  const { customers } = useCustomers();
  const { setField: setCusomerField } = useCustomerStore();
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const [isCustomerEntered, setIsCustomerEntered] = useState(false);
  const [dat, setDat] = useState<Date | null>(null);
  const [payKind, setPayKind] = useState<number>(0);
  const [dsc, setDsc] = useState<string>(""); // توضیحات
  const [amnt, setAmnt] = useState<string>("");
  //برای نحوه پرداخت
  const [paymentKind, setPaymentKind] = useState<DefaultOptionType | null>({
    id: 9,
    title: "واریز به/ برداشت از حساب",
  });
  const [isPaymentKindEntered, setIsPaymentKindEntered] = useState(false);
  const { setField: setBankAccountField } = useBankAccountStore();
  const { paymentKinds } = usePayment();
  const paymentKindsOrdered = useMemo(
    () => [...paymentKinds].sort((a: any, b: any) => a.id - b.id),
    [paymentKinds]
  );

  const { setField: setPaymentField } = usePaymentStore();
  const [message, setMessage] = useState("");
  const { systemId, yearId } = useGeneralContext();
  // order paymentKinds by id is handled by useMemo above
  
  // Use ref to track if we've already processed this data to prevent infinite loops
  const processedDataRef = useRef<{
    customerId: number;
    amnt: string;
    dat: string;
  } | null>(null);

  // Extract key values for dependency tracking
  const result = invoicePaymentResponse?.data?.result;
  const resultCustomerId = result?.customerId ?? -1;
  const resultAmnt = result?.amnt ?? "";
  const resultDat = result?.dat ?? "";
  const resultSrName = result?.srName ?? "";

  useEffect(() => {
    if (!result) return;
    
    const currentData = {
      customerId: resultCustomerId,
      amnt: resultAmnt,
      dat: resultDat,
    };
    
    // Only process if data actually changed (prevent infinite loop)
    if (
      processedDataRef.current?.customerId === currentData.customerId &&
      processedDataRef.current?.amnt === currentData.amnt &&
      processedDataRef.current?.dat === currentData.dat
    ) {
      return;
    }
    
    processedDataRef.current = currentData;
    
    setChequeField("sayadiPaymentId", -1);
    setChequeField("paymentIdAccept", -1);
    setCustomer({
      id: resultCustomerId,
      title: resultSrName,
    });
    setDat(parsePersianDateString(resultDat) ?? null);
    const findPaymentKind = paymentKinds.find((b) => b.id === 9);
    if (findPaymentKind)
      setPaymentKind({
        id: findPaymentKind?.id ?? 0,
        title: findPaymentKind?.text ?? "",
      });
    setBankAccount({
      id: 0,
      title: "",
    });
    setPayKind(0);
    setAmnt(convertToFarsiDigits(resultAmnt));
    setAcc_DefCheq({
      id: 0,
      title: "",
    });
  }, [resultCustomerId, resultAmnt, resultDat, resultSrName, paymentKinds, setChequeField, result]);
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(paymentKind,"paymentKind")
    if (Number(paymentKind?.id) === 9 ) setDsc("واریز به");
    else {
      const to =
        paymentKind === null
          ? ""
          : invoicePaymentResponse?.data?.result?.srName ?? "";
      setDsc(`پرداخت  ${paymentKind ? paymentKind.title : ""} به ${to}`);
    }
    setSayadi("");
    setAccNo("");
    setCheqNo({ id: 0, title: "" });
    setFixSerial("");
    setBank({ id: 0, title: "" });
    setTransferenceOwner("");
    setIsCheckChequeBook(false);
    setPrsn("");
    setFishNo("");
    setCash_PosSystem({ id: 0, title: "" });
    setMessage("");
  }, [paymentKind?.id]);

  useEffect(() => {
    if (!isCheckChequeBook) {
      setSayadi("");
      setAccNo("");
      setCheqNo({ id: 0, title: "" });
      setFixSerial("");
      setBank({ id: 0, title: "" });
      setTransferenceOwner("");
    }
  }, [isCheckChequeBook]);

  // برای دسته چک
  useEffect(() => {
    if (chequeBookSearchResponse.data.result.results.length > 0) {
      setChequeBooks(
        chequeBookSearchResponse.data.result.results.map((p) => {
          return { id: p.id, title: convertToFarsiDigits(p.text) };
        })
      );
    }
  }, [chequeBookSearchResponse.data.result.results]);
  //برای شماره چک
  useEffect(() => {
    chequeBookDtlSearchResponse.data.result.results.length > 0 &&
      setCheqNos(
        chequeBookDtlSearchResponse.data.result.results.map((p) => {
          return { id: p.id, title: convertToFarsiDigits(p.text) };
        })
      );
  }, [chequeBookDtlSearchResponse.data.result.results]);
  //  برای حساب
  useEffect(() => {
    setDsc(`واریز به ${bankAccount ? bankAccount.title : ""}`);
  }, [bankAccount]);
  //برای پیغام
  useEffect(() => {
    setMessage(invoicePaymentSaveResponse.meta?.message ?? "");
  }, [invoicePaymentSaveResponse]);

    //برای نحوه پرداخت
  useEffect(() => {
    setPaymentField("paymentKindSearch", "");
    setPaymentField("paymentKindSearchPage", 1);
    setPaymentField("paymentKindSearchLastId", 0);
  }, []);

  // api/Payment/chequeBookDtlSearch?ChequeBookId=
  useEffect(() => {
    setPayRequestField("searchChequeBookDtlSearch", cheqNoSearch);
    setPayRequestField("pageChequeBookDtlSearch", 1);
    setPayRequestField("lastIdChequeBookDtlSearch", 0);
    if (acc_DefCheq?.id !== 0) {
      setPayRequestField("chequeBookIdChequeBookDtlSearch", acc_DefCheq?.id);
    }
  }, [cheqNoSearch, acc_DefCheq?.id]);

  //for api/Payment/chequeBookGetById?id=190
  useEffect(() => {
    setPaymentField("checkBookId", acc_DefCheq?.id);
  }, [acc_DefCheq?.id]);

  //change sayadi,... value by changing chequeBookGetById
  useEffect(() => {
    setSayadi(chequeBookGetById?.chqBkNo ?? "");
    setAccNo(chequeBookGetById?.sheba ?? "");
    setCheqNo({
      id: chequeBookGetById?.chequeBookDtlId ?? 0,
      title: convertToFarsiDigits(chequeBookGetById?.cheqNo) ?? "",
    });
    setFixSerial(convertToFarsiDigits(chequeBookGetById.fixChqNo) ?? "");
    setBank({
      id: chequeBookGetById?.bnkId ?? 0,
      title: convertToFarsiDigits(chequeBookGetById?.bnk) ?? "",
    });
    setTransferenceOwner(chequeBookGetById?.brnch ?? "");
  }, [chequeBookGetById]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    setFishNo(cheqNo?.title ?? "");
  }, [cheqNo]);
  ////////////////////////////////////////////////////////
  //for save
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    if (e) e.preventDefault();
    let request: InvoicePaymentSaveRequest;
    let cash_Pos = 0;
    if (Number(paymentKind?.id) === 0) {
      // دریافت
      cash_Pos = cashPosSystem?.id ?? 0;
    } else if (Number(paymentKind?.id) === 1) {
      // پوز
      cash_Pos = cash_PosSystem?.id ?? 0;
    } else if (Number(paymentKind?.id) === 9) {
      // واریز به حساب
      cash_Pos = bankAccount?.id ?? 0;
    }
    request = {
      dat: dat !== null ? convertToPersianDate(dat) : "",
      customerId: customer?.id ?? 0,
      invoiceId,
      paymentId: 0,
      systemId,
      kind: payKind,
      payKind: paymentKind?.id ?? 0,
      yearId,
      sayadi: convertToLatinDigits(sayadi),
      prsn,
      bankId: bank?.id ?? 0,
      bankName_Partners: bank?.title ?? "",
      fixSerial: convertToLatinDigits(fixSerial),
      no: convertToLatinDigits(fishNo),
      transferenceOwner: convertToLatinDigits(transferenceOwner),
      cash_PosSystem: cash_Pos,
      accNo: convertToLatinDigits(accNo),
      acc_DefCheq: acc_DefCheq?.id ?? 0,
      sarDate: sarDate !== null ? convertToPersianDate(sarDate) : "",
      amount: currencyStringToNumber(convertToLatinDigits(amnt)).toString(),
      dsc: convertToLatinDigits(dsc),
      updateAcepted: true,
      idempotencyKey: uuidv4(),  
    };
    console.log(request);
    try {
      const response = await invoicePaymentSave(request);
      //setIsModalOpen(true);
      return response;
      //console.log("response");
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  //for نقدی
  const ShowFieldOfPaymentKind0 = (
    <>
      <div className="w-full md:w-1/2 flex">
        <label className="p-1 w-24 text-left">شماره فیش:</label>
        <input
          type="text"
          value={convertToFarsiDigits(fishNo)}
          onChange={(e) => setFishNo(e.target.value)}
          disabled={!canEditForm}
          className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <AutoCompleteSearch
        label="صندوق"
        labelWidth="w-24"
        setField={setCashPosSystemField}
        fieldValues={[
          { field: "systemId", value: systemId },
          { field: "page", value: 1 },
          { field: "lastId", value: 0 },
          { field: "payKind", value: 0 },
        ]}
        fieldSearch="search"
        selectedOption={cashPosSystem as DefaultOptionType}
        setSelectedOption={(cash_PosSystem: any) =>
          setCashPosSystem(cash_PosSystem as DefaultOptionType)
        }
        options={cashPosSystemSearch.map((b: any) => ({
          id: b.id,
          text: b.text,
        }))}
        isEntered={cashPosSystemEntered}
        setIsEntered={setCashPosSystemEntered}
      />
    </>
  );
  //for پوز
  const ShowFieldOfPaymentKind1 = (
    <AutoCompleteSearch
      label="پوز"
      labelWidth="w-20"
      setField={setCashPosSystemField}
      fieldValues={[
        { field: "systemId", value: systemId },
        { field: "page", value: 1 },
        { field: "lastId", value: 0 },
        { field: "payKind", value: 1 },
      ]}
      fieldSearch="search"
      selectedOption={cash_PosSystem as DefaultOptionType}
      setSelectedOption={(cash_PosSystem: any) =>
        setCash_PosSystem(cash_PosSystem as DefaultOptionType)
      }
      options={cashPosSystemSearch.map((b: any) => ({
        id: b.id,
        text: b.text,
      }))}
      isEntered={posSystemEntered}
      setIsEntered={setPosSystemEntered}
    />
  );
  //for واریز به حساب
  const ShowFieldOfPaymentKind9 = (
    <>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <AutoCompleteSearch
          label="حساب"
          labelWidth="w-20"
          setField={setBankAccountField}
          fieldValues={[
            { field: "systemId", value: systemId },
            { field: "page", value: 1 },
            { field: "lastId", value: 0 },
          ]}
          fieldSearch="search"
          selectedOption={bankAccount as DefaultOptionType}
          setSelectedOption={(bankAccount: any) =>
            setBankAccount(bankAccount as DefaultOptionType)
          }
          options={bankAccountSearchResponse.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isBankAccountEntered}
          setIsEntered={setIsBankAccountEntered}
        />
      </div>
      <div className="w-full md:w-1/4 flex">
        <label className="p-1 w-20 md:w-12 text-left">پیگیری:</label>
        <input
          type="text"
          value={convertToFarsiDigits(peygiri)}
          onChange={(e) => setPeygiri(e.target.value)}
          disabled={!canEditForm}
          className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="w-full md:w-1/4 flex gap-2">
        <div className="w-full md:w-1/2 flex">
          <label className="p-1 w-20 md:w-12 text-left">کارمزد:</label>
          <input
            type="text"
            value={convertToFarsiDigits(karmozd)}
            onChange={(e) => setKarmozd(e.target.value)}
            disabled={!canEditForm}
            className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-start items-center gap-2 w-full md:w-1/2">
          <input
            type="checkbox"
            name="isSeparated"
            checked={Tafkik}
            onChange={(e) => setTafkik(e.target.checked)}
            disabled={!canEditForm}
          />
          <label>تفکیک شده</label>
        </div>
      </div>
    </>
  );
  //for چک
  const ShowFieldOfPaymentKind2_part1 = (
    <>
      <div className="w-full md:w-1/4 flex ">
        <label className="p-1 w-28 text-left">در وجه:</label>
        <input
          type="text"
          value={convertToFarsiDigits(prsn)}
          onChange={(e) => setPrsn(e.target.value)}
          disabled={!canEditForm}
          className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="px-4">
          <input
            type="checkbox"
            name="isSeparated"
            checked={isCheckChequeBook}
            onChange={(e) => setIsCheckChequeBook(e.target.checked)}
            disabled={!canEditForm}
          />
        </div>
        <AutoCompleteSearch
          label="دسته چک"
          labelWidth="w-16"
          setField={setPayRequestField}
          fieldValues={[
            { field: "acc_systemChequeBookSearch", value: systemId },
            { field: "pageChequeBookSearch", value: 1 },
            { field: "lastIdChequeBookSearch", value: 0 },
          ]}
          fieldSearch="searchChequeBookSearch"
          selectedOption={acc_DefCheq as DefaultOptionType}
          setSelectedOption={(acc_DefCheq: any) =>
            setAcc_DefCheq(acc_DefCheq as DefaultOptionType)
          }
          options={chequeBooks.map((b) => ({
            id: b.id,
            text: b.title,
          }))}
          disabled={!isCheckChequeBook}
          isEntered={isChequeBookEntered}
          setIsEntered={setIsChequeBookEntered}
        />
      </div>
      <div className="w-full md:w-1/4 flex justify-center items-center">
        <label className="p-1 w-12 text-left">صیادی:</label>
        <input
          type="text"
          value={convertToFarsiDigits(sayadi)}
          onChange={(e) => setSayadi(e.target.value)}
          disabled={!canEditForm}
          className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
    </>
  );
  //for چک- cont
  const ShowFieldOfPaymentKind2_part2 = (
    <>
      {/*fourth row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-1/4 flex justify-center items-center">
          <label className="p-1 w-28 text-left">شبا:</label>
          <input
            type="text"
            value={convertToFarsiDigits(accNo)}
            onChange={(e) => setAccNo(e.target.value)}
            disabled={isCheckChequeBook}
            className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex w-1/4 items-center gap-1">
          <label className="w-36 text-left">شماره چک:</label>
          <div className="flex w-full-minus-24 justify-center items-center gap-2">
            {isCheckChequeBook ? (
              <div className="flex w-full rounded-md">
                <AutoComplete
                  options={cheqNos.map((b) => ({
                    id: b.id,
                    title: convertToLatinDigits(b.title),
                  }))}
                  value={cheqNo}
                  handleChange={(_event, newValue) => {
                    if (newValue) {
                      const selectedOption = newValue as DefaultOptionType;
                      return setCheqNo({
                        ...selectedOption,
                        title: convertToFarsiDigits(selectedOption.title),
                      });
                    }
                    return setCheqNo(null);
                  }}
                  setSearch={setCheqNoSearch}
                  showLabel={false}
                  backgroundColor={"white"}
                  showClearIcon={false}
                  inputPadding="0 !important"
                />
              </div>
            ) : (
              <div className="flex w-full justify-center items-center gap-2">
                <Input
                  name="fishNo"
                  value={fishNo}
                  onChange={(e) =>
                    setFishNo(convertToFarsiDigits(e.target.value))
                  }
                  widthDiv="w-full"
                  widthInput="w-full"
                  variant="outlined"
                />
              </div>
            )}

            <label>/</label>
            <div className="flex w-full justify-center items-center gap-2">
              <Input
                name="fixSerial"
                value={fixSerial}
                onChange={(e) =>
                  setFixSerial(convertToFarsiDigits(e.target.value))
                }
                widthDiv="w-full"
                widthInput="w-full"
                variant="outlined"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/4 flex justify-center items-center">
          <AutoCompleteSearch
            label="بانک"
            labelWidth="w-20"
            setField={setBankField}
            fieldValues={[
              { field: "page", value: 1 },
              { field: "lastId", value: 0 },
            ]}
            fieldSearch="search"
            selectedOption={bank as DefaultOptionType}
            setSelectedOption={(bank: any) =>
              setBank(bank as DefaultOptionType)
            }
            options={banks.map((b) => ({
              id: b.id,
              text: b.text,
            }))}
            disabled
            isEntered={isBankEntered}
            setIsEntered={setIsBankEntered}
          />
        </div>

        <div className="w-full md:w-1/4 flex justify-center items-center">
          <label className="p-1 w-12 text-left">شعبه:</label>
          <input
            type="text"
            value={convertToFarsiDigits(transferenceOwner)}
            onChange={(e) => setTransferenceOwner(e.target.value)}
            disabled={isCheckChequeBook}
            className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {/*fifth row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-1/4 flex items-center gap-2">
          <label className="w-24 text-left">سررسید:</label>
          <PersianDatePicker
            name="sarDate"
            label="سررسید"
            value={sarDate}
            fontSize="text-sm"
            onChange={(event) => setSarDate(event.target.value as Date | null)}
            disabled={!canEditForm}
          />
        </div>
      </div>
    </>
  );
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      {/*first row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        {/*  طرف حساب */}
        <AutoCompleteSearch
          label="طرف حساب"
          labelWidth="w-20"
          setField={setCusomerField}
          fieldValues={[
            { field: "systemIdCustomerSearch", value: systemId },
            { field: "page", value: 1 },
            { field: "lastId", value: 0 },
            { field: "yearIdCustomerSearch", value: yearId },
            { field: "centerType", value: 0 },
          ]}
          fieldSearch="search"
          selectedOption={customer as DefaultOptionType}
          setSelectedOption={(customer: any) =>
            setCustomer(customer as DefaultOptionType)
          }
          options={customers.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          disabled
          isEntered={isCustomerEntered}
          setIsEntered={setIsCustomerEntered}
        />
        <div className="w-full md:w-1/4 flex gap-2">
          <input
            type="radio"
            name="payKind"
            id="payKind"
            onChange={() => setPayKind(0)}
            disabled
          />
          <label htmlFor="payKind">دریافت</label>
          <input
            type="radio"
            name="payKind"
            id="payKind"
            onChange={() => setPayKind(1)}
            defaultChecked={true}
            disabled
          />
          <label htmlFor="payKind">پرداخت</label>
        </div>
        <div className="w-full md:w-1/4 flex justify-center items-center">
          <label className="p-1 w-20 md:w-12 text-left">تاریخ:</label>
          <PersianDatePicker
            name="fDate"
            label="تا:"
            value={dat}
            fontSize="text-sm"
            onChange={(event) => setDat(event.target.value as Date | null)}
          />
        </div>
      </div>
      {/*second row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-1/4">
        <AutoCompleteSearch
          label="نحوه پرداخت"
          labelWidth="w-20"
          setField={setPaymentField}
          fieldValues={[
            { field: "paymentKindSearchSystemId", value: systemId },
            { field: "paymentKindSearchPage", value: 1 },
            { field: "paymentKindSearchLastId", value: 0 },
          ]}
          fieldSearch="paymentKindSearch"
          selectedOption={paymentKind as DefaultOptionType}
          setSelectedOption={(paymentKind: any) =>
            setPaymentKind(paymentKind as DefaultOptionType)
          }
          options={paymentKindsOrdered.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isPaymentKindEntered}
          setIsEntered={setIsPaymentKindEntered}
        />
      </div>
      {/*third row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        {Number(paymentKind?.id) === 0 && ShowFieldOfPaymentKind0}
        {Number(paymentKind?.id) === 1 && ShowFieldOfPaymentKind1}
        {Number(paymentKind?.id) === 2 && ShowFieldOfPaymentKind2_part1}
        {Number(paymentKind?.id) === 9 && ShowFieldOfPaymentKind9}
      </div>
      {Number(paymentKind?.id) === 2 && ShowFieldOfPaymentKind2_part2}
      {/*last row*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-3/4 flex justify-center items-center">
          <label className="p-1 w-24 text-left">توضیحات:</label>
          <input
            type="text"
            value={convertToFarsiDigits(dsc)}
            onChange={(e) => setDsc(e.target.value)}
            disabled={!canEditForm}
            className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-full md:w-1/4 flex">
          <label className="p-1 w-20 md:w-12 text-left">مبلغ:</label>
          <input
            type="text"
            value={amnt}
            onChange={(e) => {
              handleCurrencyInputChange(e.target.value, setAmnt);
            }}
            //disabled={!canEditForm}
            className="text-sm text-gray-600 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
        <div className="flex items-center gap-2">
          <label
            style={{
              color:
                invoicePaymentSaveResponse.meta.errorCode > 0
                  ? colors.red500
                  : colors.green700,
            }}
          >
            {message}
          </label>
          <Button
            text={isLoadingInvoicePaymentSave ? "در حال ثبت اطلاعات..." : "ثبت"}
            backgroundColor="bg-green-500"
            color="text-white"
            backgroundColorHover="bg-green-600"
            colorHover="text-white"
            variant="shadow-lg w-64"
            onClick={handleSubmitSave}
          />
        </div>
      </ConfirmCard>
    </div>
  );
};

export default InvoicePaymentShowHeader;
