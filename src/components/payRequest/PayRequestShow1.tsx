// کارشناس خرید -> ثبت اولیه
import { useEffect, useState } from "react";
import PayRequestShowHeader from "./PayRequestShowHeader";
import { usePayRequestStore } from "../../store/payRequestStore";
import { useAuthStore } from "../../store/authStore";
//import { AuthApiResponse } from "../../types/auth";
import PayRequestActiveTab0 from "./PayRequestActiveTab0";
import {
  ChequeBookDtlByIdResponse,
  ChequeBookDtlSearchResponse,
  ChequeBookSearchResponse,
  PayRequestDtlAddInvoiceRequest,
  PayRequestDtlRemoveInvoiceRequest,
  PayRequestDtlTable,
  PayRequestInvoiceIncludeChecks,
  PayRequestInvoicesResponse,
  PayRequestInvoicesTable,
  PayRequestResponse,
  PayRequestSaveDetail,
  PayRequestSaveInvoice,
  PayRequestSaveRequest,
} from "../../types/payRequest";
import PayRequestActiveTab2 from "./PayRequestActiveTab2";
import {
  RpCustomerBillsResponse,
  RpCustomerBillsResultWithIndex,
} from "../../types/sales";
import PayRequestActiveTab1 from "./payRequestActiveTab1";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  convertToPersianDate,
  currencyStringToNumber,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useGeneralContext } from "../../context/GeneralContext";
import { DefaultOptionType } from "../../types/general";
import ModalForm from "../layout/ModalForm";
import PayRequestInvoices from "./PayRequestInvoices";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import PayRequestAttachment from "./PayRequestAttachment";
import ShowMessages from "../controls/ShowMessages";
import { colors } from "../../utilities/color";
import ModalMessage from "../layout/ModalMessage";
import { v4 as uuidv4 } from "uuid";
import AttachmentShowTableTabs from "../attachment/AttachmentShowTableTabs";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../types/definitionInvironment";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

type Props = {
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
  fromWorkFlow: boolean;
  canEditForm1: boolean;
  payRequestSave: UseMutateAsyncFunction<
    any,
    Error,
    PayRequestSaveRequest,
    unknown
  >;
  isLoadingPayRequestSave: boolean;
  //selectedPayRequest: PayRequest | null;
  //payRequestDtls: PayRequestDtl[] | undefined;
  selectedId: number;
  payRequestSaveResponse: any;
  payRequestResponse:
  | PayRequestResponse
  | {
    meta: {
      errorCode: number;
      message: string;
      type: string;
    };
    data: {
      result: {
        err: number;
        msg: string;
        payRequest: {
          total_count: number;
          payRequests: never[];
        };
        payRequests: never[];
        payRequestDtls: never[];
        invcs: never[];
      };
    };
  };
  chequeBookSearchResponse: ChequeBookSearchResponse;
  chequeBookDtlSearchResponse: ChequeBookDtlSearchResponse;
  chequeBookDtlByIdResponse: ChequeBookDtlByIdResponse;
  payRequestInvoicesWorkFlowResponse: PayRequestInvoicesResponse;
  payRequestInvoices: PayRequestInvoicesResponse;
  isLoadingPayRequestInvoices: boolean;
  rpCustomerBillsResponse: RpCustomerBillsResponse;
  isLoadingRpCustomerBills: boolean;
  payRequestDtlRemoveInvoice: UseMutateAsyncFunction<
    any,
    Error,
    PayRequestDtlRemoveInvoiceRequest,
    unknown
  >;
  payRequestDtlRemoveInvoiceResponse: any;
  payRequestDtlAddInvoice: UseMutateAsyncFunction<
    any,
    Error,
    PayRequestDtlAddInvoiceRequest,
    unknown
  >;
  payRequestDtlAddInvoiceResponse: any;
  canEditForm1Dtl1: boolean;
  canEditForm1Dtl2: boolean;
  canEditForm1Mst1: boolean;
  canEditForm1Mst2: boolean;
};

const PayRequestShow1 = ({
  isNew,
  setIsNew,
  setIsEdit,
  definitionDateTime,
  definitionInvironment,
  fromWorkFlow,
  canEditForm1,
  payRequestSave,
  isLoadingPayRequestSave,
  //selectedPayRequest,
  //payRequestDtls,
  selectedId,
  payRequestSaveResponse,
  //for tab 2
  payRequestResponse,
  chequeBookSearchResponse,
  chequeBookDtlSearchResponse,
  chequeBookDtlByIdResponse,
  payRequestInvoicesWorkFlowResponse,
  //for tab 0
  payRequestInvoices,
  isLoadingPayRequestInvoices,
  //for tab 1
  rpCustomerBillsResponse,
  isLoadingRpCustomerBills,
  //for PayRequest/DtlRemoveInvoice
  payRequestDtlRemoveInvoice,
  payRequestDtlRemoveInvoiceResponse,
  //for PayRequest/DtlAddInvoice
  payRequestDtlAddInvoice,
  payRequestDtlAddInvoiceResponse,
  canEditForm1Dtl1,
  canEditForm1Dtl2,
  canEditForm1Mst1,
  canEditForm1Mst2,
}: Props) => {
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const {
    setField: setPayRequestField,
    payRequestSaveResponse: payRequestSaveResponseStore,
    //id: payRequestId,
    //customerId: customerIdRpCustomerBills,
    //fDate: fDateRpCustomerBills,
    //tDate: tDateRpCustomerBills,
  } = usePayRequestStore();
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data.result.initData;
  //const { id, setField } = usePayRequestStore();
  const { systemId, yearId } = useGeneralContext();
  //for PayRequestShowHeader.tsx
  const [system, setSystem] = useState<{ id: number; title: string } | null>({
    id: initData?.systemId ?? 0,
    title: convertToFarsiDigits(initData?.systemTitle) ?? "",
  });
  const [year, setYear] = useState<{ id: number; title: string } | null>({
    id: initData?.yearId ?? 0,
    title: convertToFarsiDigits(initData?.yearTitle) ?? "",
  });
  //for PayRequestAttachment.tsx
  const [guid, setGuid] = useState<string>("");
  //for PayRequestShowHeader props
  const [cnt, setCnt] = useState(0);
  const [dsc, setDsc] = useState<string>("");
  const [dat, setDat] = useState<string>("");
  const [tim, setTim] = useState<string>("");
  const [fDate, setFDate] = useState<Date | null>(null);
  const [tDate, setTDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [settleAmnt, setSettleAmnt] = useState<string>("");
  const [providerAmnt, setProviderAmnt] = useState<string>("");
  //for tab 0
  const [totalRem, setTotalRem] = useState(0);
  const [sumRem, setSumRem] = useState(0);
  // end of tab 0
  const [activeTab, setActiveTab] = useState(0);
  const [dataInTab0, setDataInTab0] = useState<PayRequestInvoicesTable[]>([]);
  const [dataInTab1, setDataInTab1] = useState<
    RpCustomerBillsResultWithIndex[]
  >([]);
  //for tab 1
  const [remSumTab1, setRemSumTab1] = useState(0);
  const [sumStatus, setSumStatus] = useState("");
  // end of tab 1
  //for tab 2
  const [newPay, setNewPay] = useState(0);
  const [payRequestDtlId, setPayRequestDtlId] = useState(0);
  const [amountTab2, setAmountTab2] = useState(0);
  const [chequeBookSearch, setChequeBookSearch] = useState("");
  const [chequeBookDtlSearch, setChequeBookDtlSearch] = useState("");
  const [showInvoices, setShowInvoices] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [isModalRegOpen, setIsModalRegOpen] = useState(false);
  const [pay, setPay] = useState(0);
  const [dataInTab2, setDataInTab2] = useState<PayRequestDtlTable[]>([]);
  const [data, setData] = useState<PayRequestDtlTable[]>([]);
  const [invoices, setInvoices] = useState<PayRequestInvoiceIncludeChecks[]>(
    []
  );
  const [invoicesWithChecks, setInvoicesWithChecks] = useState<
    PayRequestInvoiceIncludeChecks[]
  >([]);
  const [chequeBookId, setChequeBookId] = useState(0);
  const [options1, setOptions1] = useState<DefaultOptionType[]>([]);
  const [options2, setOptions2] = useState<DefaultOptionType[]>([]);
  const [payRequestDtlIndex, setPayRequestDtlIndex] = useState(0);
  const [tempData, setTempData] = useState<PayRequestInvoiceIncludeChecks[]>(
    []
  );
  //to consider both from workflow and from payRequestShow
  const [payRequestInvoicesResponse, setPayRequestInvoicesResponse] =
    useState<PayRequestInvoicesResponse>({
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          invoices: [],
        },
      },
    });
  //to consider both from workflow and from payRequestShow
  useEffect(() => {
    if (fromWorkFlow) {
      setPayRequestInvoicesResponse(payRequestInvoicesWorkFlowResponse);
    } else {
      setPayRequestInvoicesResponse(payRequestInvoices);
    }
  }, [payRequestInvoicesWorkFlowResponse, payRequestInvoices]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalRegOpen) {
      timeoutId = setTimeout(() => {
        setIsModalRegOpen(false);
        if (payRequestSaveResponseStore?.meta.errorCode <= 0) {
          setIsNew(false);
          setIsEdit(false);
        }
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalRegOpen]);
  ////////////////////////////////////////////////////////
  //for /api/PayRequest?Id=..
  useEffect(() => {
    setActiveTab(2);
  }, [selectedId]);

  /*if (
    payRequestId !== selectedId &&
    !isNew
  ) {
    //console.log(payRequestId, selectedId);
    setPayRequestField("id", selectedId);
    setPayRequestField("yearIdDtl", yearId);
    setPayRequestField("systemIdDtl", systemId);
    setPayRequestField("yearId", -1);
    setPayRequestField("systemId", -1);
    setPayRequestField("payRequestDtlId", -1);
  }*/

  //initializing tab 0
  useEffect(() => {
    const tempData: PayRequestInvoicesTable[] =
      payRequestInvoicesResponse.data.result.invoices.map((item, index) => {
        return {
          ...item,
          index: index + 1,
          settle: 0,
          dcrmntPercent: 0,
          payRequestDtlId: 0,
        };
      });
    setTotalRem(tempData.reduce((acc, item) => acc + item.rem, 0));
    setDataInTab0(tempData);
  }, [payRequestInvoicesResponse]);
  //initializing tab 1
  useEffect(() => {
    setDataInTab1(
      rpCustomerBillsResponse.data.result.map((item, index) => ({
        ...item,
        index: index + 1,
        sanad: item.sanad === -1 ? 0 : item.sanad,
      }))
    );
    setRemSumTab1(
      rpCustomerBillsResponse.data.result[
        rpCustomerBillsResponse.data.result.length - 1
      ]?.rem ?? 0
    );
    setSumStatus(
      rpCustomerBillsResponse.data.result[
        rpCustomerBillsResponse.data.result.length - 1
      ]?.bedBes ?? ""
    );
  }, [rpCustomerBillsResponse]);

  //initializing tab 2
  useEffect(() => {
    setChequeBookId(
      payRequestResponse.data.result.payRequestDtls[0]?.chequeBookId ?? 0
    );
  }, [payRequestResponse.data.result.payRequestDtls[0]?.chequeBookId]);
  useEffect(() => {
    setOptions1(
      chequeBookSearchResponse.data.result.results.map((p) => {
        return { id: p.id, title: convertToFarsiDigits(p.text) };
      })
    );
  }, [chequeBookSearchResponse.data.result.results]);
  useEffect(() => {
    setOptions2(
      chequeBookDtlSearchResponse.data.result.results.map((p) => {
        return { id: p.id, title: convertToFarsiDigits(p.text) };
      })
    );
  }, [chequeBookDtlSearchResponse.data.result.results]);
  ////////////////////////////////////////////////////////for defining guid
  useEffect(() => {
    if (isNew) {
      setGuid(uuidv4());
    } else {
      setGuid(
        payRequestResponse.data.result.payRequest.payRequests?.[0]?.guid ?? ""
      );
    }
  }, [isNew, payRequestResponse.data.result.payRequest.payRequests?.[0]?.guid]);
  /////////////////////////////////////////////////////////////for defining cnt
  useEffect(() => {
    let tempCnt = 0;
    if (isNew) {
      tempCnt = 0;
      //} else if (attachments.data.result.length !== 0) {
      //  tempCnt = attachments.data.result.length ?? 0;
    } else {
      tempCnt =
        payRequestResponse.data.result.payRequest.payRequests?.[0]
          ?.attachCount ?? 0;
    }
    setCnt(tempCnt);
  }, [
    //attachments.data.result.length,
    isNew,
    payRequestResponse.data.result.payRequest.payRequests?.[0]?.attachCount,
  ]);
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    const invcs = payRequestResponse.data.result.invcs;
    setDataInTab2(
      isNew
        ? []
        : payRequestResponse.data.result.payRequestDtls.map((item, index) => {
          const tempItem = invcs.find((p) => p.payRequestDtlId === item.id);
          return {
            ...item,
            amount: convertToFarsiDigits(
              formatNumberWithCommas(Number(item.amount))
            ),
            index: index + 1,
            checked: tempItem ? true : false,
          };
        })
    );
    setAmountTab2(
      payRequestResponse.data.result.payRequestDtls.reduce(
        (acc, item) => acc + Number(item.amount),
        0
      )
    );
  }, [payRequestResponse]);
  //initializing invoices
  useEffect(() => {
    //for invoices with checks
    const tempData: PayRequestInvoiceIncludeChecks[] =
      payRequestInvoicesResponse.data.result.invoices.map((item, index) => {
        return {
          ...item,
          index: index,
          settle: 0,
          dcrmntPercent: 0,
          invcs: payRequestResponse.data.result.invcs.filter(
            (p) => p.id === item.id
          ),
        };
      });
    setInvoicesWithChecks(tempData);
  }, [payRequestInvoicesResponse.data.result.invoices, payRequestResponse]);
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    let settleSum: number = 0;
    //console.log(invoicesWithChecks, "invoicesWithChecks in useEffect");
    const tempInvoicesWithChecks = invoicesWithChecks.map((item, index) => {
      let checked = item.checked; //Number(item.settlement )> 0 ? true : false;
      //item.checked is deleted because it is not in the api/PayRequest/DtlInvoices?PayRequestDtlId=3290;
      //فاکتوری که در آن از چک کلیک شده پرداخت شده است
      //اگر رکورد در حال ویرایش است
      let invoicePayByClickedCheck;
      if (isNew) {
        invoicePayByClickedCheck = item.invcs.find(
          (p) => p.paymentRow === payRequestDtlIndex
        );
      } else {
        invoicePayByClickedCheck = item.invcs.find(
          (p) => p.payRequestDtlId === payRequestDtlId
        );
      }
      //فاکتورهایی که با چکهای دیگری پرداخت شده اند
      //اگر رکورد در حال ویرایش است
      let invoicePayByOtherChecks;
      if (isNew) {
        invoicePayByOtherChecks = item.invcs.filter(
          (p) => p.paymentRow !== payRequestDtlIndex
        );
      } else {
        invoicePayByOtherChecks = item.invcs.filter(
          (p) => p.payRequestDtlId !== payRequestDtlId
        );
      }
      const totalPayByOtherChecks = invoicePayByOtherChecks.reduce(
        (acc, item) => acc + item.settle,
        0
      );
      let pay = fromWorkFlow ? 0 : item.pay ?? 0;
      console.log(pay, "pay from menu")
      //اگر فاکتور با چک دیگری پرداخت شده باشد
      if (invoicePayByOtherChecks.length > 0) {
        pay = fromWorkFlow ? totalPayByOtherChecks : pay + totalPayByOtherChecks;
        const tempSettle = invoicePayByClickedCheck
          ? invoicePayByClickedCheck.settle
          : 0;
        checked = tempSettle > 0 ? checked : false;
      }
      return {
        ...item,
        index: index + 1,
        dcrmntPercent: 0,
        dcrmnt: 0,
        checked: invoicePayByClickedCheck ? true : checked,
        settle: invoicePayByClickedCheck ? invoicePayByClickedCheck.settle : 0,
        rem: fromWorkFlow ? item.rem : item.total - pay, //جمع فاکتور -پرداختی
        payed: fromWorkFlow ? item.payed ?? 0 : pay,
        payRequestDtlId: payRequestDtlId,
      };
    });
    settleSum = tempInvoicesWithChecks.reduce(
      (acc, item) => acc + item.settle,
      0
    );
    setNewPay(pay - settleSum);
    setInvoices(tempInvoicesWithChecks);
  }, [
    payRequestResponse,
    payRequestDtlId,
    invoicesWithChecks,
    payRequestDtlIndex,
  ]);
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    const settleSum = invoicesWithChecks.reduce(
      (acc, item) => acc + item.settle,
      0
    );
    if (settleSum === 0) {
      setNewPay(pay);
    }
  }, [pay]);
  ////////////////////////////////////////////////////////////////////////////
  //for setting fields in tab 1
  /*if (
    customer &&
    customer.id !== customerIdRpCustomerBills &&
    fDate &&
    tDate &&
    convertToPersianDate(fDate) !== fDateRpCustomerBills &&
    convertToPersianDate(tDate) !== tDateRpCustomerBills
  ) {
    //setPayRequestField("idRpCustomerBills", payRequestId);
    setPayRequestField("customerIdRpCustomerBills", customer?.id ?? 0);
    setPayRequestField("systemIdRpCustomerBills", systemId);
    setPayRequestField("yearIdRpCustomerBills", yearId);
    setPayRequestField(
      "fDateRpCustomerBills",
      fDate ? convertToPersianDate(fDate) : ""
    );
    setPayRequestField(
      "tDateRpCustomerBills",
      tDate ? convertToPersianDate(tDate) : ""
    );
  }*/

  useEffect(() => {
    //setPayRequestField("idRpCustomerBills", payRequestId);
    setPayRequestField("customerIdRpCustomerBills", customer?.id ?? 0);
    setPayRequestField("systemIdRpCustomerBills", systemId);
    setPayRequestField("yearIdRpCustomerBills", yearId);
    setPayRequestField(
      "fDateRpCustomerBills",
      fDate ? convertToPersianDate(fDate) : ""
    );
    setPayRequestField(
      "tDateRpCustomerBills",
      tDate ? convertToPersianDate(tDate) : ""
    );
  }, [systemId, yearId, customer?.id, fDate, tDate]);
  ////////////////////////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<string | undefined> => {
    if (e) e.preventDefault();
    let request: PayRequestSaveRequest;
    const dtls: PayRequestSaveDetail[] = [];
    const invcs: PayRequestSaveInvoice[] = [];
    data.map((item) => {
      const dtl: PayRequestSaveDetail = {
        ordr: item.index,
        id: item.id,
        chequeBookId: item.chequeBookId,
        chequeBookDtlId: item.chequeBookDtlId,
        prsn: item.prsn,
        chqNo: item.chqNo ?? "",
        chqBkNo: convertToLatinDigits(item.chqBkNo ?? ""),
        dat: convertToLatinDigits(item.dat),
        amount: currencyStringToNumber(
          convertToLatinDigits(item.amount)
        ).toString(),
        dtlDsc: convertToLatinDigits(item.dtlDsc),
        deleted: item.del,
      };
      dtls.push(dtl);
    });
    invoices.map((item) => {
      item.invcs.map((p) => {
        let idx = 0;
        data.map((p1) => {
          if (p1.id === p.payRequestDtlId) {
            idx = p1.index;
          }
        });
        const invc: PayRequestSaveInvoice = {
          payRequestDtlId: p.payRequestDtlId,
          paymentRow: isNew ? p.paymentRow : idx,
          id: item.id,
          dcrmntPrcnt: item.dcrmntPercent,
          dcrmnt: item.dcrmnt,
          settle: p.settle,
        };
        invcs.push(invc);
      });
    });

    request = {
      guid,
      usrId: authApiResponse?.data.result.login.usrId ?? 0,
      id: isNew
        ? 0
        : payRequestResponse.data.result.payRequest.payRequests?.[0]?.id ?? 0,
      systemId: system?.id ?? 0,
      yearId: year?.id ?? 0,
      customerId: customer?.id ?? 0,
      dat: convertToLatinDigits(dat),
      tim: convertToLatinDigits(tim),
      fDate: fDate ? convertToPersianDate(fDate) : "",
      tDate: tDate ? convertToPersianDate(tDate) : "",
      dueDate: dueDate ? convertToPersianDate(dueDate) : "",
      settleAmnt: convertToLatinDigits(settleAmnt),
      providerAmnt: convertToLatinDigits(providerAmnt),
      dsc,
      dtls: dtls,
      invcs: invcs,
    };
    console.log(request);
    try {
      await payRequestSave(request);
      setIsModalRegOpen(true);
      return "اطلاعات با موفقیت ثبت شد.";
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  //////////////////////////////////////////////////////////////
  const handleConfirm = () => {
    console.log(tempData, "tempData in handleConfirm");
    const isChecked = tempData.some((p) => p.checked);
    const newDataInTab2 = dataInTab2.map((item) => {
      if (isNew && item.index === payRequestDtlIndex) {
        return { ...item, checked: isChecked };
      } else if (!isNew && item.id === payRequestDtlId) {
        return { ...item, checked: isChecked };
      } else {
        return { ...item };
      }
    });
    setDataInTab2(newDataInTab2);

    setInvoices(
      tempData.map((item: any) => {
        return {
          ...item,
          checked: item.settle > 0 ? true : false,
        };
      })
    );
    setInvoicesWithChecks(
      tempData.map((item) => {
        return {
          ...item,
          checked: item.settle > 0 ? true : false,
        };
      })
    );
    setShowInvoices(false);
  };

  //console.log(isFromWorkflow, "isFromWorkflow")
  return (
    <div>
      <PayRequestShowHeader
        cnt={cnt}
        system={system}
        setSystem={setSystem}
        year={year}
        setYear={setYear}
        customer={customer}
        setCustomer={setCustomer}
        payRequestResponse={payRequestResponse}
        setShowAttachment={setShowAttachment}
        isNew={isNew}
        dsc={dsc}
        setDsc={setDsc}
        dat={dat}
        setDat={setDat}
        tim={tim}
        setTim={setTim}
        fDate={fDate}
        setFDate={setFDate}
        tDate={tDate}
        setTDate={setTDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        settleAmnt={settleAmnt}
        setSettleAmnt={setSettleAmnt}
        providerAmnt={providerAmnt}
        setProviderAmnt={setProviderAmnt}
        definitionDateTime={definitionDateTime}
        definitionInvironment={definitionInvironment}
        canEditForm1Mst1={canEditForm1Mst1}
        canEditForm1Mst2={canEditForm1Mst2}
      //authApiResponse={authApiResponse as AuthApiResponse}
      />
      <AttachmentShowTableTabs
        tab0Title={`فاکتورهای باز: ${convertToFarsiDigits(
          formatNumberWithCommas(sumRem)
        )} / ${convertToFarsiDigits(formatNumberWithCommas(totalRem))}`}
        tab1Title={`مانده حساب: ${convertToFarsiDigits(
          formatNumberWithCommas(remSumTab1)
        )} (${sumStatus})`}
        tab2Title={`لیست چکها: ${convertToFarsiDigits(
          formatNumberWithCommas(amountTab2)
        )}`}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 0 && (
        <PayRequestActiveTab0
          isLoading={isLoadingPayRequestInvoices}
          data={dataInTab0}
          setData={setDataInTab0}
          setRemSum={setSumRem}
          customerId={customer?.id ?? -1}
        />
      )}
      {activeTab === 1 && (
        <PayRequestActiveTab1
          isLoading={isLoadingRpCustomerBills}
          data={dataInTab1}
        />
      )}
      {activeTab === 2 && (
        <PayRequestActiveTab2
          data={data}
          setData={setData}
          setPayRequestDtlId={setPayRequestDtlId} // for keeping check record id
          payRequestSaveResponse={payRequestSaveResponse}
          setPay={setPay} // keep مبلغ پرداختی
          setField={setPayRequestField}
          setShowInvoices={setShowInvoices}
          chequeBookSearch={chequeBookSearch}
          chequeBookDtlSearch={chequeBookDtlSearch}
          setChequeBookSearch={setChequeBookSearch}
          setChequeBookDtlSearch={setChequeBookDtlSearch}
          chequeBookDtlByIdResponse={chequeBookDtlByIdResponse}
          options1={options1}
          options2={options2}
          originalData={dataInTab2}
          setOriginalData={setDataInTab2}
          customerId={customer?.id ?? -1}
          setAmountTab2={setAmountTab2}
          setChequeBookId={setChequeBookId}
          chequeBookId={chequeBookId}
          setPayRequestDtlIndex={setPayRequestDtlIndex}
          isNew={isNew}
          fromWorkFlow={fromWorkFlow}
          canEditForm1={canEditForm1}
          canEditForm1Dtl1={canEditForm1Dtl1}
          canEditForm1Dtl2={canEditForm1Dtl2}
        />
      )}
      {canEditForm1 && (
        <ConfirmCard
          backgroundColor="bg-gray-300"
          variant="flex-row gap-2 rounded-lg justify-end"
        >
          <Button
            text={isLoadingPayRequestSave ? "در حال ثبت اطلاعات..." : "ثبت"}
            backgroundColor="bg-green-500"
            color="text-white"
            backgroundColorHover="bg-green-600"
            colorHover="text-white"
            variant="shadow-lg w-64"
            onClick={handleSubmitSave}
          />
        </ConfirmCard>
      )}
      <ModalForm
        isOpen={showInvoices}
        onClose={() => handleConfirm()}
        title="فاکتورهای تسویه نشده"
        width="2/3"
      >
        <PayRequestInvoices
          canEditForm1Dtl2={canEditForm1Dtl2}
          tempData={tempData}
          setTempData={setTempData}
          payRequestDtlId={payRequestDtlId}
          data={invoices}
          setInvoicesWithChecks={setInvoicesWithChecks}
          pay={pay}
          newPay={newPay}
          payRequestDtlIndex={payRequestDtlIndex}
          isNew={isNew}
          payRequestDtlRemoveInvoice={payRequestDtlRemoveInvoice}
          payRequestDtlRemoveInvoiceResponse={
            payRequestDtlRemoveInvoiceResponse
          }
          payRequestDtlAddInvoice={payRequestDtlAddInvoice}
          payRequestDtlAddInvoiceResponse={payRequestDtlAddInvoiceResponse}
          fromWorkFlow={fromWorkFlow}
        />
      </ModalForm>
      <ModalForm
        isOpen={showAttachment}
        onClose={() => setShowAttachment(false)}
        title="ضمائم درخواست پرداخت"
        width="1/2"
        height="90vh"
      >
        <PayRequestAttachment
          formId={
            isNew //|| workFlowRowSelectResponse.msg === "PayRequestOperationForm"
              ? 0
              : selectedId
          }
          setCnt={setCnt}
          prefix={"payrequest"}
          guid={guid}
        />
      </ModalForm>

      <ModalMessage
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor={
          payRequestSaveResponseStore?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          payRequestSaveResponseStore?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={
          payRequestSaveResponseStore?.meta.errorCode > 0
            ? payRequestSaveResponseStore?.meta.message || ""
            : "اطلاعات با موفقیت ثبت شد."
        }
        visibleButton={false}
      />

      {payRequestSaveResponseStore?.data.result.dtlErrMsgs?.length > 0 && (
        <ModalForm
          isOpen={isModalRegOpen}
          onClose={() => setIsModalRegOpen(false)}
          title="پیام ها"
          width="1/2"
        >
          <ShowMessages
            dtlErrMsgs={
              payRequestSaveResponseStore.data.result.dtlErrMsgs || []
            }
            color={colors.red100}
            heightWindow={300}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default PayRequestShow1;
