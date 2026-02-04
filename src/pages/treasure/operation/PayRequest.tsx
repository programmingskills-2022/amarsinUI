//حسابداری -> خزانه داری ->عملیات -> درخواست پرداخت
import Accept from "../../../assets/images/GrayThem/img24_3.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGeneralContext } from "../../../context/GeneralContext";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../../utilities/general";
import { debounce } from "lodash";
import ProductOfferHeader from "../../../components/productOffer/ProductOfferHeader";
import Skeleton from "../../../components/layout/Skeleton";
import ProductOfferTblHeader from "../../../components/productOffer/ProductOfferTblHeader";
import TTable from "../../../components/controls/TTable";
import { TablePaginationActions } from "../../../components/controls/TablePaginationActions";
import ProductOfferParams from "../../../components/productOffer/ProductOfferParams";
import ModalMessage from "../../../components/layout/ModalMessage";
import ModalForm from "../../../components/layout/ModalForm";
import { usePayRequest } from "../../../hooks/usePayRequest";
import { usePayRequestStore } from "../../../store/payRequestStore";
import {
  PayRequestDoFirstFlowRequest,
  PayRequestDtl,
  PayRequest as PayRequestType,
} from "../../../types/payRequest";
import ConfirmCard from "../../../components/layout/ConfirmCard";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../../types/definitionInvironment";
import PayRequestShow1 from "../../../components/payRequest/PayRequestShow1";

type Props = {
  definitionInvironment: DefinitionInvironment;
  definitionDateTime: DefinitionDateTime;
};
const PayRequest = ({ definitionInvironment, definitionDateTime }: Props) => {
  const {
    setField,
    id: prevId,
    payRequestDoFirstFlowResponse,
    payRequestDelResponse,
  } = usePayRequestStore();
  const {
    payRequest,
    payRequestTotalCount,
    payRequestMeta,
    refetch,
    isLoadingPayRequest,
    isFetchingPayRequest,
    isLoadingDtl,
    payRequestDtl,
    payRequestDoFirstFlow,
    payRequestDel,
    //add more
    //refetchPayRequestDtl,
    //payRequestDtlData,
    payRequestSave,
    isLoadingPayRequestSave,
    payRequestSaveResponse,
    //for tab 2
    payRequestResponse,
    chequeBookSearchResponse,
    chequeBookDtlSearchResponse,
    chequeBookDtlByIdResponse,
    payRequestInvoicesWorkFlowResponse,
    //for tab 0
    payRequestInvoicesResponse: payRequestInvoices,
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
  } = usePayRequest();

  const [data, setData] = useState<any[]>([]);
  const [dataDtl, setDataDtl] = useState<PayRequestDtl[]>([]);
  const { yearId, systemId, chartId, defaultRowsPerPage } = useGeneralContext();
  const [selectedId, setSelectedId] = useState<number>(589);
  const [isNew, setIsNew] = useState<boolean>(false); //for new
  const [isEdit, setIsEdit] = useState<boolean>(false); //for edit
  //for ProductPermParams params
  const [regFDate, setRegFDate] = useState<Date | null>(null);
  const [regTDate, setRegTDate] = useState<Date | null>(null);
  const [fDate, setFDate] = useState<Date | null>(null);
  const [tDate, setTDate] = useState<Date | null>(null);
  const [state, setState] = useState<number>(-1);
  const [selectedPayRequest, setSelectedPayRequest] =
    useState<PayRequestType | null>(null);
  // for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultRowsPerPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  //add filter options
  const [srchId, setSrchId] = useState<number>(-1);
  const [srchDate, setSrchDate] = useState<string>("");
  const [srchTime, setSrchTime] = useState<string>("");
  const [srchDsc, setSrchDsc] = useState<string>("");
  const [srchAccepted, setSrchAccepted] = useState<number>(-1);
  const [srchUsrName, setSrchUsrName] = useState<string>("");
  const [srchStep, setSrchStep] = useState<string>("");
  const [srchSrName, setSrchSrName] = useState<string>("");
  const [srchAmount, setSrchAmount] = useState<number>(-1);
  const [sortId, setSortId] = useState<number>(0);
  const [sortDate, setSortDate] = useState<number>(0);
  const [sortTime, setSortTime] = useState<number>(0);
  const [sortDsc, setSortDsc] = useState<number>(0);
  const [sortAccepted, setSortAccepted] = useState<number>(0);
  const [sortUsrName, setSortUsrName] = useState<number>(0);
  const [sortStep, setSortStep] = useState<number>(0);
  const [sortSrName, setSortSrName] = useState<number>(0);
  const [sortAmount, setSortAmount] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productGrace table
  const [selectedRowIndexDtl, setSelectedRowIndexDtl] = useState<number>(0); //for selected row index in productGraceDtl table
  const [sumAmount, setSumAmount] = useState<number>(0); //for sum amount of payRequestDtl
  const columns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "شناسه",
      accessor: "id",
      width: "5%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "7%",
    },
    {
      Header: "ساعت",
      accessor: "tim",
      width: "5%",
    },
    {
      Header: "طرف حساب",
      accessor: "srName",
      width: "25%",
    },
    {
      Header: "مبلغ",
      accessor: "amount",
      width: "5%",
    },
    {
      Header: "توضیح",
      accessor: "dsc",
      width: "20%",
    },
    {
      Header: "تایید",
      accessor: "accepted",
      width: "3%",
    },
    {
      Header: "کاربر",
      accessor: "usrName",
      width: "15%",
    },
    {
      Header: "مرحله",
      accessor: "flowMapName",
      width: "10%",
    },
  ];

  const columnsDtl = React.useMemo(
    () => [
      {
        Header: "ردیف",
        accessor: "index",
        width: "5%",
      },
      {
        Header: "دسته چک",
        accessor: "chequeBook",
        width: "15%",
      },
      {
        Header: "شماره چک",
        accessor: "chqBkNo",
        width: "10%",
      },
      {
        Header: "در وجه",
        accessor: "prsn",
        width: "25%",
      },
      {
        Header: "صیادی",
        accessor: "chqNo",
        width: "10%",
      },
      {
        Header: "تاریخ",
        accessor: "dat",
        width: "5%",
      },
      {
        Header: "مبلغ",
        accessor: "amount",
        width: "10%",
      },
      {
        Header: "شرح",
        accessor: "dtlDsc",
        width: "20%",
      },
    ],
    [],
  );
  // Refs for maintaining focus on input elements
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Function to preserve focus
  const preserveFocus = useCallback((inputName: string) => {
    setFocusedInput(inputName);
    setTimeout(() => {
      if (inputRefs.current[inputName]) {
        inputRefs.current[inputName]?.focus();
      }
    }, 0);
  }, []);

  // Restore focus after re-renders
  useEffect(() => {
    if (focusedInput && inputRefs.current[focusedInput]) {
      inputRefs.current[focusedInput]?.focus();
    }
  }, [focusedInput, data, payRequest]);

  useEffect(() => {
    console.log("yearId in PayRequestOperation", yearId);
    setField("yearId", yearId);
    setField("systemId", systemId);
    setField("yearIdDtl", yearId);
    setField("systemIdDtl", systemId);
    setField("state", state);

    setField(
      "regFDate",
      regFDate === null || !regFDate
        ? ""
        : convertPersianDate(regFDate.toLocaleDateString("fa-IR")),
    );
    setField(
      "regTDate",
      regTDate === null || !regTDate
        ? ""
        : convertPersianDate(regTDate.toLocaleDateString("fa-IR")),
    );
    setField(
      "fDate",
      fDate === null || !fDate
        ? ""
        : convertPersianDate(fDate.toLocaleDateString("fa-IR")),
    );
    setField(
      "tDate",
      tDate === null || !tDate
        ? ""
        : convertPersianDate(tDate.toLocaleDateString("fa-IR")),
    );
  }, [yearId, systemId, state, regFDate, regTDate, fDate, tDate]);

  useEffect(() => {
    //setSelectedId(0);
    setField("srchId", srchId);
    setField("srchDate", srchDate);
    setField("srchTime", srchTime);
    setField("srchDsc", srchDsc);
    setField("srchAccepted", srchAccepted);
    setField("srchUsrName", srchUsrName);
    setField("srchStep", srchStep);
    setField("srchAmount", srchAmount);
    setField("srchSrName", srchSrName);
  }, []);

  useEffect(() => {
    setField("sortId", sortId);
    setField("sortDate", sortDate);
    setField("sortTime", sortTime);
    setField("sortDsc", sortDsc);
    setField("sortAccepted", sortAccepted);
    setField("sortUsrName", sortUsrName);
    setField("sortStep", sortStep);
    setField("sortSrName", sortSrName);
    setField("sortAmount", sortAmount);
  }, [
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortAccepted,
    sortUsrName,
    sortStep,
    sortSrName,
    sortAmount,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);
    setField("pageNumber", pageNumber);
  }, [pageNumber]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setPageNumber(1);
  }, [
    state,
    regFDate,
    regTDate,
    fDate,
    tDate,
    chartId,
    systemId,
    srchId,
    srchDate,
    srchTime,
    srchDsc,
    srchAccepted,
    srchUsrName,
    srchStep,
    srchSrName,
    srchAmount,
    yearId,
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortAccepted,
    sortUsrName,
    sortStep,
    sortSrName,
    sortAmount,
  ]);

  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      console.log(field, value, "field, value");
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      console.log(field, value, "field, value in handleDebounceFilterChange");
      setField(field, value);
    }, 500),
    [setField],
  );

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    console.log("selectedId", selectedId,selectedPayRequest);
    if (prevId !== selectedId) {
      setField("id", selectedId);
    }
    selectedId !== 0 &&
      setSelectedPayRequest(
        payRequest?.find((item) => item.id === selectedId) || null,
      );
  }, [selectedId, payRequest]);
  //initialize data for payRequest table
  useEffect(() => {
    if (payRequest && payRequest.length === 0) {
      setData([]);
      setDataDtl([]);
      return;
    }
    const tempData = payRequest?.map((item, index) => {
      return {
        ...item,
        id: convertToFarsiDigits(item.id),
        dat: convertToFarsiDigits(item.dat),
        tim: convertToFarsiDigits(item.tim),
        srName: convertToFarsiDigits(item.srName),
        amount: convertToFarsiDigits(item.amount),
        dsc: convertToFarsiDigits(item.dsc),
        accepted: item.accepted ? (
          <img src={Accept} alt="Accept" className="w-4 h-4" />
        ) : null,
        usrName: convertToFarsiDigits(item.usrName),
        flowMapName: convertToFarsiDigits(item.flowMapName),
        index: convertToFarsiDigits((pageNumber - 1) * pageSize + index + 1),
      };
    });

    setData(tempData || []);
    if (tempData?.[0]?.id) {
      setSelectedId(Number(convertToLatinDigits(tempData?.[0]?.id)));
    } else {
      setSelectedId(0);
    }
  }, [payRequest]);

  useEffect(() => {
    let tempDataDtl: any[] = [];
    if (
      payRequestDtl &&
      payRequestDtl.length > 0 &&
      payRequest &&
      payRequest.length > 0
    ) {
      tempDataDtl = payRequestDtl.map((item, index) => {
        return {
          index: convertToFarsiDigits(index + 1),
          chequeBook: convertToFarsiDigits(item.chequeBook),
          chqBkNo: convertToFarsiDigits(item.chqBkNo),
          prsn: convertToFarsiDigits(item.prsn),
          chqNo: convertToFarsiDigits(item.chqNo),
          dat: convertToFarsiDigits(item.dat),
          amount: convertToFarsiDigits(
            formatNumberWithCommas(Number(item.amount)),
          ),
          dtlDsc: convertToFarsiDigits(item.dtlDsc),
        };
      });
      if (tempDataDtl) {
        setDataDtl(tempDataDtl);
        setSumAmount(
          payRequestDtl.reduce((acc, item) => acc + Number(item.amount), 0),
        );
      }
    }
  }, [payRequestDtl]);

  const handleSelectedIdChange = (id: number) => {
    //console.log(id, "id in WorkflowForm");
    setSelectedId(id);
  };

  const { isModalOpen, setIsModalOpen } = useGeneralContext();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen || isModalConfirmOpen || isModalDeleteOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
        setIsModalConfirmOpen(false);
        setIsModalDeleteOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen, isModalConfirmOpen, isModalDeleteOpen]);

  const handleConfirm = () => {
    const request: PayRequestDoFirstFlowRequest = {
      chartId: chartId,
      flowNo: 405020300,
      wFMS_FlowMapId: 405020301,
      yearId: yearId,
      systemId: systemId,
      id: selectedId,
      dsc: selectedPayRequest?.dsc || "",
    };
    console.log("request", request);
    setIsModalConfirmOpen(true);
    payRequestDoFirstFlow(request);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleDelete = () => {
    payRequestDel(selectedId);
    setSelectedId(0);
    setSelectedRowIndex(0);
    setSelectedPayRequest(null);
    setIsModalDeleteOpen(true);
  };

  const ProductPermInput = (
    inputName: string,
    inputWidth: string,
    inputValue: string,
    setInputValue: (value: string) => void,
  ) => {
    return (
      <input
        ref={(el) => (inputRefs.current[inputName] = el)}
        name={inputName}
        value={convertToFarsiDigits(inputValue ?? "")}
        onChange={(e) => {
          preserveFocus(inputName);
          handleDebounceFilterChange(
            inputName,
            convertToLatinDigits(e.target.value),
          );
          setInputValue(e.target.value);
        }}
        onFocus={() => setFocusedInput(inputName)}
        style={{ width: inputWidth }}
        className={`border p-1 text-sm rounded-sm`}
      />
    );
  };
  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
    >
      <ProductOfferHeader
        columns={columns}
        setIsNew={setIsNew}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleConfirm={handleConfirm}
        selectedProductOffer={selectedPayRequest || null}
        data={data}
        refetch={refetch}
        definitionInvironment={definitionInvironment}
      />
      <div className="flex flex-col md:flex-row gap-2 px-2 h-1/2">
        <div className="flex flex-col w-full md:w-3/4 h-full">
          <div className="w-full overflow-y-scroll bg-white rounded-md h-full">
            {isLoadingPayRequest || isFetchingPayRequest ? (
              <Skeleton />
            ) : (
              <>
                <div className="w-full flex  justify-center md:justify-end items-center ">
                  <input
                    name="index"
                    value={""}
                    disabled
                    style={{ width: columns[0].width }}
                    className={`border p-1 text-sm bg-gray-200 rounded-sm border-gray-300`}
                  />
                  <input
                    ref={(el) => (inputRefs.current["srchId"] = el)}
                    name="srchId"
                    value={srchId === -1 ? "" : srchId}
                    onChange={(e) => {
                      preserveFocus("srchId");
                      handleDebounceFilterChange(
                        "srchId",
                        e.target.value === "" ? -1 : e.target.value,
                      );
                      setSrchId(Number(e.target.value));
                    }}
                    onFocus={() => setFocusedInput("srchId")}
                    style={{ width: columns[1].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductPermInput(
                    "srchDate",
                    columns[2].width,
                    srchDate,
                    setSrchDate,
                  )}
                  {ProductPermInput(
                    "srchTime",
                    columns[3].width,
                    srchTime,
                    setSrchTime,
                  )}
                  {ProductPermInput(
                    "srchSrName",
                    columns[4].width,
                    srchSrName,
                    setSrchSrName,
                  )}
                  <input
                    ref={(el) => (inputRefs.current["srchAmount"] = el)}
                    name="srchAmount"
                    value={srchAmount === -1 ? "" : srchAmount}
                    onChange={(e) => {
                      preserveFocus("srchAmount");
                      handleDebounceFilterChange(
                        "srchAmount",
                        e.target.value === "" ? -1 : e.target.value,
                      );
                      setSrchAmount(Number(e.target.value));
                    }}
                    onFocus={() => setFocusedInput("srchAmount")}
                    style={{ width: columns[5].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductPermInput(
                    "srchDsc",
                    columns[6].width,
                    srchDsc,
                    setSrchDsc,
                  )}
                  <input
                    name="srchAccepted"
                    type="checkbox"
                    checked={srchAccepted === 1}
                    onChange={(e) => {
                      handleDebounceFilterChange(
                        "srchAccepted",
                        e.target.checked ? 1 : -1,
                      );
                      setSrchAccepted(Number(e.target.checked ? 1 : -1));
                    }}
                    style={{ width: columns[7].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductPermInput(
                    "srchUsrName",
                    columns[8].width,
                    srchUsrName,
                    setSrchUsrName,
                  )}
                  {ProductPermInput(
                    "srchStep",
                    columns[9].width,
                    srchStep,
                    setSrchStep,
                  )}
                </div>
                <ProductOfferTblHeader
                  columns={columns}
                  sortId={sortId}
                  sortDate={sortDate}
                  sortTime={sortTime}
                  sortDsc={sortDsc}
                  sortAccepted={sortAccepted}
                  sortUsrName={sortUsrName}
                  sortStep={sortStep}
                  setSortId={setSortId}
                  setSortDate={setSortDate}
                  setSortTime={setSortTime}
                  setSortDsc={setSortDsc}
                  setSortAccepted={setSortAccepted}
                  setSortUsrName={setSortUsrName}
                  setSortStep={setSortStep}
                  setSortSrName={setSortSrName}
                  setSortAmount={setSortAmount}
                />
                <TTable
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
                  columns={columns}
                  data={data}
                  fontSize="0.75rem"
                  changeRowSelectColor={true}
                  setSelectedId={handleSelectedIdChange}
                  wordWrap={false}
                  showToolTip={true}
                  showHeader={false}
                />
              </>
            )}
          </div>
          <div className="w-full bg-white rounded-md">
            <TablePaginationActions
              setSelectedRowIndex={setSelectedRowIndex}
              page={pageNumber - 1}
              setPage={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={payRequestTotalCount ?? 0}
              showPagination={true}
            />
          </div>
        </div>
        {/* ProductOfferParams */}
        <div className="w-full md:w-1/4 h-full">
          <ProductOfferParams
            regFDate={regFDate}
            setRegFDate={setRegFDate}
            regTDate={regTDate}
            setRegTDate={setRegTDate}
            fDate={fDate}
            setFDate={setFDate}
            tDate={tDate}
            setTDate={setTDate}
            setState={setState}
          />
        </div>
      </div>
      <div className="px-2 h-full">
        {isLoadingDtl ? (
          <Skeleton />
        ) : (
          <>
            <TTable
              selectedRowIndex={selectedRowIndexDtl}
              setSelectedRowIndex={setSelectedRowIndexDtl}
              columns={columnsDtl}
              data={dataDtl}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              wordWrap={true}
              showToolTip={true}
              maxVisibleColumns={6}
            />
          </>
        )}
      </div>
      <ConfirmCard backgroundColor="bg-gray-300" variant="flex-row gap-2">
        <p className="text-sm text-gray-500">جمع: لیست چک ها:</p>
        <p className="text-sm text-gray-500">
          {convertToFarsiDigits(formatNumberWithCommas(sumAmount))}
        </p>
      </ConfirmCard>
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={payRequestMeta?.message || ""}
      />
      <ModalForm
        isOpen={isNew || isEdit}
        onClose={() => {
          setIsNew(false);
          setIsEdit(false);
        }}
        title="درخواست پرداخت"
        width="1"
        height="90vh"
      >
        <PayRequestShow1
          definitionInvironment={definitionInvironment}
          canEditForm1={true}
          payRequestSave={payRequestSave}
          isLoadingPayRequestSave={isLoadingPayRequestSave}
          //selectedPayRequest={selectedPayRequest} //for check if selectedPayRequest.flwId===0 new else edit && sending selectedPayRequest.id in edit
          //payRequestDtls={payRequestDtl}
          isNew={isNew} //for check if isNew new else edit
          setIsNew={setIsNew}
          setIsEdit={setIsEdit}
          fromWorkFlow={false} 
          selectedId={selectedId}
          definitionDateTime={definitionDateTime}
          payRequestSaveResponse={payRequestSaveResponse}
          //for tab 2
          payRequestResponse={payRequestResponse}
          chequeBookSearchResponse={chequeBookSearchResponse}
          chequeBookDtlSearchResponse={chequeBookDtlSearchResponse}
          chequeBookDtlByIdResponse={chequeBookDtlByIdResponse}
          payRequestInvoicesWorkFlowResponse={
            payRequestInvoicesWorkFlowResponse
          }
          //for tab 0
          payRequestInvoices={payRequestInvoices}
          isLoadingPayRequestInvoices={isLoadingPayRequestInvoices}
          //for tab 1
          rpCustomerBillsResponse={rpCustomerBillsResponse}
          isLoadingRpCustomerBills={isLoadingRpCustomerBills}
          //for PayRequest/DtlRemoveInvoice
          payRequestDtlRemoveInvoice={payRequestDtlRemoveInvoice}
          payRequestDtlRemoveInvoiceResponse={
            payRequestDtlRemoveInvoiceResponse
          }
          //for PayRequest/DtlAddInvoice
          payRequestDtlAddInvoice={payRequestDtlAddInvoice}
          payRequestDtlAddInvoiceResponse={payRequestDtlAddInvoiceResponse}
          canEditForm1Dtl1={false}
          canEditForm1Dtl2={true}
          canEditForm1Mst1={true}
          canEditForm1Mst2={true}
        />
        {/*<PayRequestOperationForm
          selectedPayRequest={selectedPayRequest}
          isNew={isNew}
          setIsNew={setIsNew}
          setIsEdit={setIsEdit}
          definitionDateTime={definitionDateTime}
          definitionInvironment={definitionInvironment}
        />*/}
      </ModalForm>
      <ModalMessage
        isOpen={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        backgroundColor={
          payRequestDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          payRequestDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={payRequestDoFirstFlowResponse?.meta.message || ""}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        message={
          payRequestDelResponse?.meta.errorCode > 0
            ? payRequestDelResponse?.meta.message || ""
            : "اطلاعات با موفقیت حذف شد."
        }
        visibleButton={false}
      />
    </div>
  );
};

export default PayRequest;
