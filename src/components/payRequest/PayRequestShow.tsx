import { useEffect, useState } from "react";
import { usePayRequest } from "../../hooks/usePayRequest";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import PayRequestShowHeader from "./PayRequestShowHeader";
import { usePayRequestStore } from "../../store/payRequestStore";
import { useAuthStore } from "../../store/authStore";
//import { AuthApiResponse } from "../../types/auth";
import PayRequestShowTableHeader from "./PayRequestShowTableHeader";
import PayRequestActiveTab0 from "./PayRequestActiveTab0";
import {
  PayRequestDtlTable,
  PayRequestInvoiceIncludeChecks,
  PayRequestInvoicesTable,
  PayRequestSaveDetail,
  PayRequestSaveInvoice,
  PayRequestSaveRequest,
} from "../../types/payRequest";
import PayRequestActiveTab2 from "./PayRequestActiveTab2";
import { RpCustomerBillsResultWithIndex } from "../../types/sales";
import PayRequestActiveTab1 from "./payRequestActiveTab1";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
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

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const PayRequestShow = ({ workFlowRowSelectResponse }: Props) => {
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const { setField: setPayRequestField } = usePayRequestStore();
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data.result.initData;
  //for PayRequestShowHeader.tsx
  const [system, setSystem] = useState<{ id: number; title: string } | null>({
    id: initData?.systemId ?? 0,
    title: convertToFarsiDigits(initData?.systemTitle) ?? "",
  });
  const [year, setYear] = useState<{ id: number; title: string } | null>({
    id: initData?.yearId ?? 0,
    title: convertToFarsiDigits(initData?.yearTitle) ?? "",
  });
  const [cnt, setCnt] = useState(0);
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
  //const isConfirmRef: React.MutableRefObject<boolean> = useRef(false);
  const [newPay, setNewPay] = useState(0);
  const [payRequestDtlId, setPayRequestDtlId] = useState(0);
  const [amountTab2, setAmountTab2] = useState(0);
  const [chequeBookSearch, setChequeBookSearch] = useState("");
  const [chequeBookDtlSearch, setChequeBookDtlSearch] = useState("");
  const [showInvoices, setShowInvoices] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
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
  // end of tab 2
  const {
    //for tab 2
    payRequestResponse,
    chequeBookSearchResponse,
    chequeBookDtlSearchResponse,
    chequeBookDtlByIdResponse,
    isLoadingPayRequestSave,
    payRequestSave,
    payRequestSaveResponse,
    //for tab 0
    payRequestInvoicesResponse,
    isLoadingPayRequestInvoices,
    //for tab 1
    rpCustomerBillsResponse,
    isLoadingRpCustomerBills,
  } = usePayRequest();

  useEffect(() => {
    //console.log(workFlowRowSelectResponse?.workTableRow.formId);
    setActiveTab(2);
    setPayRequestField("id", workFlowRowSelectResponse?.workTableRow.formId);
    setPayRequestField("acc_year", initData?.yearId);
    setPayRequestField("acc_system", initData?.systemId);
  }, [
    workFlowRowSelectResponse?.workTableRow.formId,
    initData?.yearId,
    initData?.systemId,
  ]);
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
  useEffect(() => {
    //set attachment count
    setCnt(payRequestResponse.data.result.payRequests[0]?.attachCount ?? 0);
    const invcs = payRequestResponse.data.result.invcs; // keep factors include settles in tempPayRequestResponse
    setDataInTab2(
      payRequestResponse.data.result.payRequestDtls.map((item, index) => {
        const tempItem = invcs.find((p) => p.payRequestDtlId === item.id);
        return {
          ...item,
          amount: convertToFarsiDigits(
            formatNumberWithCommas(Number(item.amount))
          ),
          index: index + 1,
          checked: tempItem ? true : false,
          //chqBkNo: chequeBookDtlByIdResponse.data.result.checkBookDtl.chqBkNo ?? item.chqBkNo
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
    const tempDate: PayRequestInvoiceIncludeChecks[] =
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
    setInvoicesWithChecks(tempDate);
  }, [payRequestInvoicesResponse.data.result.invoices, payRequestResponse]);
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    let newPay = 0;
    //console.log(payRequestDtlId, "payRequestDtlId");
    const tempData = invoicesWithChecks.map((item, index) => {
      //فاکتوری که در آن از چک کلیک شده پرداخت شده است
      const invoicePayByClickedCheck = item.invcs.find(
        (p) => p.payRequestDtlId === payRequestDtlId
      );
      const invoicePayByOtherChecks = item.invcs.filter(
        (p) => p.payRequestDtlId !== payRequestDtlId
      );
      const totalPayByOtherChecks = invoicePayByOtherChecks.reduce(
        (acc, item) => acc + item.settle,
        0
      );
      let pay = 0;
      if (invoicePayByClickedCheck) {
        console.log(
          invoicePayByClickedCheck,
          "invoicePayByClickedCheck in PayRequestShow"
        );
      }
      //اگر فاکتور با چک دیگری پرداخت شده باشد
      if (invoicePayByOtherChecks.length > 0) {
        pay = totalPayByOtherChecks;
      }
      return {
        ...item,
        index: index + 1,
        dcrmntPercent: 0,
        dcrmnt: 0,
        checked: invoicePayByClickedCheck ? true : item.checked,
        settle: invoicePayByClickedCheck ? invoicePayByClickedCheck.settle : 0,
        rem: item.total - pay, //جمع فاکتور -پرداختی
        pay,
        payRequestDtlId: payRequestDtlId,
      };
    });
    //console.log(pay, newPay, "pay and newPay");
    setNewPay(pay - newPay);
    setInvoices(tempData);
    //setOriginalInvoices(tempData);
  }, [payRequestResponse, payRequestDtlId, invoicesWithChecks]);
  ////////////////////////////////////////////////////////////////////////////
  const { id, setField } = usePayRequestStore();
  const { systemId, yearId } = useGeneralContext();
  useEffect(() => {
    console.log(customer, "customer in PayRequestShow");
    setField("idRpCustomerBills", id);
    setField("customerIdRpCustomerBills", customer?.id ?? 0);
    setField("systemIdRpCustomerBills", systemId);
    setField("yearIdRpCustomerBills", yearId);
    setField(
      "fDateRpCustomerBills",
      payRequestResponse.data.result.payRequests[0]?.fDate ?? ""
    );
    setField(
      "tDateRpCustomerBills",
      payRequestResponse.data.result.payRequests[0]?.tDate ?? ""
    );
  }, [
    systemId,
    yearId,
    id,
    customer?.id,
    payRequestResponse.data.result.payRequests[0]?.fDate,
    payRequestResponse.data.result.payRequests[0]?.tDate,
  ]);
  ////////////////////////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
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
          paymentRow: idx,
          id: item.id,
          dcrmntPrcnt: item.dcrmntPercent,
          dcrmnt: item.dcrmnt,
          settle: p.settle,
        };
        invcs.push(invc);
      });
    });
    request = {
      guid: payRequestResponse.data.result.payRequests[0]?.guid ?? "",
      usrId: authApiResponse?.data.result.login.usrId ?? 0,
      id: payRequestResponse.data.result.payRequests[0]?.id ?? 0,
      acc_System: system?.id ?? 0,
      acc_Year: year?.id ?? 0,
      customerId: customer?.id ?? 0,
      dat: payRequestResponse.data.result.payRequests[0]?.dat ?? "",
      tim: payRequestResponse.data.result.payRequests[0]?.tim ?? "",
      fDate: payRequestResponse.data.result.payRequests[0]?.fDate ?? "",
      tDate: payRequestResponse.data.result.payRequests[0]?.tDate ?? "",
      dueDate: payRequestResponse.data.result.payRequests[0]?.dueDate ?? "",
      settleAmnt:
        payRequestResponse.data.result.payRequests[0]?.settleAmnt ?? "",
      providerAmnt:
        payRequestResponse.data.result.payRequests[0]?.providerAmnt ?? "",
      dsc: payRequestResponse.data.result.payRequests[0]?.dsc ?? "",
      dtls: dtls,
      invcs: invcs,
    };
    console.log(request);
    try {
      const response = await payRequestSave(request);
      //setIsModalOpen(true);
      return response;
      //console.log("response in handleSubmitSave");
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
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
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        payRequestResponse={payRequestResponse}
        setShowAttachment={setShowAttachment}
        //authApiResponse={authApiResponse as AuthApiResponse}
      />
      <PayRequestShowTableHeader
        totalRem={totalRem}
        sumRem={sumRem}
        remSumTab1={remSumTab1}
        amountTab2={amountTab2}
        sumStatus={sumStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 0 && (
        <PayRequestActiveTab0
          isLoading={isLoadingPayRequestInvoices}
          data={dataInTab0}
          setData={setDataInTab0}
          setRemSum={setSumRem}
          customerId={customer?.id ?? 0}
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
          canEditForm={
            workFlowRowSelectResponse.workTableForms.canEditForm1Dtl1
          }
          originalData={dataInTab2}
          setOriginalData={setDataInTab2}
          customerId={customer?.id ?? 0}
          setAmountTab2={setAmountTab2}
          setChequeBookId={setChequeBookId}
          chequeBookId={chequeBookId}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
        />
      )}
      {workFlowRowSelectResponse.workTableForms.canEditForm1Dtl1 && (
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
        onClose={() => setShowInvoices(false)}
        title="فاکتورهای تسویه نشده"
        width="2/3"
      >
        <PayRequestInvoices
          payRequestDtlId={payRequestDtlId}
          data={invoices}
          setData={setInvoices}
          setInvoicesWithChecks={setInvoicesWithChecks}
          pay={pay}
          setShowInvoices={setShowInvoices}
          newPay={newPay}
          setNewPay={setNewPay}
          //isConfirmRef={isConfirmRef}
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
          formId={workFlowRowSelectResponse.workTableRow.formId}
          setCnt={setCnt}
        />
      </ModalForm>
    </div>
  );
};

export default PayRequestShow;
