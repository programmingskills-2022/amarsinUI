//حسابداری => حسابداری بازرگانی => عملیات => درخواست خرید
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGeneralContext } from "../../../context/GeneralContext";
import { ProductPriceDtl } from "../../../types/productPrice";
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
import ModalForm from "../../../components/layout/ModalForm";
import ErrorPage from "../../../components/common/ErrorPage";
import { useProductStore } from "../../../store/productStore";
import { useProducts } from "../../../hooks/useProducts";
import { Indent, IndentDoFirstFlowRequest } from "../../../types/product";
import PurchaseRequestIndentForm from "../../../components/purchaseRequest/PurchaseRequestIndentForm";
import ModalMessage from "../../../components/layout/ModalMessage";
import InvoiceReceiptShowTableSummery from "../../../components/invoiceReceipt/InvoiceReceiptShowTableSummery";
import Card from "../../../components/controls/Card";
import { colors } from "../../../utilities/color";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";
import { DefinitionDateTime, DefinitionInvironment } from "../../../types/definitionInvironment";
import { useBrandStore } from "../../../store/brandStore";
import { useCustomerStore } from "../../../store/customerStore";

type Props = {
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
};
const PurchaseRequestIndent = ({ definitionDateTime, definitionInvironment }: Props) => {
  const {
    setField,
    id: prevId,
    indentDoFirstFlowResponse,
    indentDelResponse,
  } = useProductStore();
  const { setField: setCustomerField } = useCustomerStore();
  const {
    indentList,
    indentListDtl,
    //indentListMeta,
    refetchIndentList,
    isLoadingIndentList,
    isFetchingIndentList,
    errorIndentList,
    //indentListTotalCount,
    isLoadingIndentListDtl,
    indentListTotalCount,
    indentDoFirstFlow,
    indentDel,
  } = useProducts();

  //const { setField: setProductOfferField } = useProductOfferStore();
  const [data, setData] = useState<any[]>([]);
  const [dataDtl, setDataDtl] = useState<ProductPriceDtl[]>([]);
  const { yearId, systemId, chartId ,defaultRowsPerPage} = useGeneralContext();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isNew, setIsNew] = useState<boolean>(false); //for new
  const [isEdit, setIsEdit] = useState<boolean>(false); //for edit
  const [isOpen, setIsOpen] = useState<boolean>(false); //for open modal
  //for ProductPermParams params
  const [regFDate, setRegFDate] = useState<Date | null>(null);
  const [regTDate, setRegTDate] = useState<Date | null>(null);
  const [fDate, setFDate] = useState<Date | null>(null);
  const [tDate, setTDate] = useState<Date | null>(null);
  const [state, setState] = useState<number>(-1);
  const [selectedIndent, setSelectedIndent] = useState<Indent | null>(null);
  // for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultRowsPerPage);
  const abortControllerRef = useRef<AbortController | null>(null);
  //add filter options
  const [srchId, setSrchId] = useState<number>(-1);
  const [srchDate, setSrchDate] = useState<string>("");
  const [srchTime, setSrchTime] = useState<string>("");
  const [srchDsc, setSrchDsc] = useState<string>("");
  const [srchSRName, setSrchSRName] = useState<string>("");
  const [srchPayDuration, setSrchPayDuration] = useState<number>(-1);
  const [srchUsrName, setSrchUsrName] = useState<string>("");
  const [srchStep, setSrchStep] = useState<string>("");
  const [sortId, setSortId] = useState<number>(0);
  const [sortDate, setSortDate] = useState<number>(0);
  const [sortTime, setSortTime] = useState<number>(0);
  const [sortDsc, setSortDsc] = useState<number>(0);
  const [sortSRName, setSortSRName] = useState<number>(0);
  const [sortPayDuration, setSortPayDuration] = useState<number>(0);
  const [sortUsrName, setSortUsrName] = useState<number>(0);
  const [sortStep, setSortStep] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productGrace table
  const [selectedRowIndexDtl, setSelectedRowIndexDtl] = useState<number>(0); //for selected row index in productGraceDtl table

  const {setField:setBrandField}=useBrandStore()

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
      visible: false,
    },
    {
      Header: "شناسه",
      accessor: "ordrId",
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
      Header: "تامین کننده",
      accessor: "srName",
      width: "28%",
    },
    {
      Header: "سررسید",
      accessor: "payDuration",
      width: "5%",
    },
    {
      Header: "توضیح",
      accessor: "dsc",
      width: "20%",
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
        Header: "کالا",
        accessor: "product",
        width: "35%",
      },
      {
        Header: "تعداد",
        accessor: "cnt",
        width: "5%",
      },
      {
        Header: "آفر",
        accessor: "offer",
        width: "5%",
      },
      {
        Header: "مبلغ",
        accessor: "cost",
        width: "5%",
      },
      {
        Header: "تخفیف",
        accessor: "dcrmnt",
        width: "5%",
      },
      {
        Header: "مالیات",
        accessor: "taxValue",
        width: "5%",
      },
      {
        Header: "جمع",
        accessor: "total",
        width: "5%",
      },
      {
        Header: "شرح",
        accessor: "dtlDsc",
        width: "30%",
      },
    ],
    []
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
  }, [focusedInput, data]);
//for api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  useEffect(() => {
    console.log("state", state);
    console.log("enter useEffect");
    setField("id", 0);
    setField("ordrIdIndentRequest", 0);
    setField("showDeletedInentDtl", false);
    setField("acc_YearIndentRequest", yearId);
    setField("acc_SystemIndentRequest", systemId);
    setField("state", state);

    setField(
      "regFDate",
      regFDate === null || !regFDate
        ? ""
        : convertPersianDate(regFDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "regTDate",
      regTDate === null || !regTDate
        ? ""
        : convertPersianDate(regTDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "fDate",
      fDate === null || !fDate
        ? ""
        : convertPersianDate(fDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "tDate",
      tDate === null || !tDate
        ? ""
        : convertPersianDate(tDate.toLocaleDateString("fa-IR"))
    );
  }, [yearId, systemId, state, regFDate, regTDate, fDate, tDate]);

  useEffect(() => {
    //setSelectedId(0);
    setField("srchId", srchId);
    setField("srchDate", srchDate);
    setField("srchTime", srchTime);
    setField("srchDsc", srchDsc);
    setField("srchUsrName", srchUsrName);
    setField("srchStep", srchStep);
    setField("srchSRName", srchSRName);
    setField("srchPayDuration", srchPayDuration);
  }, []);

  useEffect(() => {
    setField("sortId", sortId);
    setField("sortDate", sortDate);
    setField("sortTime", sortTime);
    setField("sortDsc", sortDsc);
    setField("sortUsrName", sortUsrName);
    setField("sortStep", sortStep);
    setField("sortSRName", sortSRName);
    setField("sortPayDuration", sortPayDuration);
  }, [
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortUsrName,
    sortStep,
    sortSRName,
    sortPayDuration,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);`
    setField("pageNumber", pageNumber);
  }, [pageNumber]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setPageNumber(1);
    setSelectedRowIndex(0);
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
    srchSRName,
    srchUsrName,
    srchStep,
    srchPayDuration,
    yearId,
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortSRName,
    sortUsrName,
    sortStep,
    sortPayDuration,
  ]);
  //////////////////////////////////////////////////////////////////////////////
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      console.log(field, value, "field, value");
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setField(field, value);
    }, 500),
    [setField]
  );
  //////////////////////////////////////////////////////////////////////////////
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const currentIndent = indentList.find((item) => item.id === selectedId);
    if (currentIndent && prevId !== selectedId) {
      console.log("mrsIdIndentRequest", currentIndent.mrsId)
      setField("mrsIdIndentRequest", currentIndent.mrsId);
    }
    //if (selectedId!==0) setField("mrsIdIndentRequest", selectedId);
    /*if (prevId !== selectedId) {
      setField("id", selectedId);
    }*/
    selectedId !== 0 && setSelectedIndent(currentIndent || null);
  }, [selectedId]);
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const tempData = indentList?.map((item, index) => {
      return {
        ...item,
        ordrId: convertToFarsiDigits(item.ordrId),
        dat: convertToFarsiDigits(item.dat),
        tim: convertToFarsiDigits(item.tim),
        payDuration: convertToFarsiDigits(item.payDuration),
        dsc: convertToFarsiDigits(item.dsc),
        usrName: convertToFarsiDigits(item.usrName),
        flowMapName: convertToFarsiDigits(item.flowMapName),
        index: convertToFarsiDigits((pageNumber - 1) * pageSize + index + 1),
      };
    });
    setData(tempData || []);
    if (tempData?.[0]?.id) {
      setSelectedId(tempData?.[0]?.id);
    } else {
      setSelectedId(0);
    }
  }, [indentList]);
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let tempDataDtl: any[] = [];
    if (indentList.length === 0) {
      setDataDtl(tempDataDtl);
      return;
    }
    if (indentListDtl) {
      tempDataDtl = indentListDtl.map((item, index) => {
        return {
          index: convertToFarsiDigits(index + 1),
          bName: convertToFarsiDigits(item.bName),
          product: convertToFarsiDigits(item.product),
          cnt: convertToFarsiDigits(item.cnt),
          offer: convertToFarsiDigits(item.offer),
          cost: convertToFarsiDigits(formatNumberWithCommas(item.cost)),
          dcrmnt: convertToFarsiDigits(formatNumberWithCommas(item.dcrmnt)),
          taxValue: convertToFarsiDigits(formatNumberWithCommas(item.taxValue)),
          total: convertToFarsiDigits(formatNumberWithCommas(item.total)),
          dtlDsc: convertToFarsiDigits(item.dtlDsc),
        };
      });
      if (tempDataDtl) {
        setDataDtl(tempDataDtl);
      }
    }
  }, [indentListDtl]);
  //////////////////////////////////////////////////////////////////////////////
  const handleSelectedIdChange = (id: number) => {
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
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  const handleConfirm = () => {
    const request: IndentDoFirstFlowRequest = {
      acc_Year: yearId,
      acc_System: systemId,
      mrsId: selectedIndent?.mrsId ?? 0,
      dsc: selectedIndent?.dsc || "توضیحات",
      chartId: chartId,
    };
    console.log(request, "request");
    setIsModalConfirmOpen(true);
    indentDoFirstFlow(request);
    setSelectedId(data?.[0]?.id ?? 0);
    setSelectedRowIndex(0);
  };

  const handleEdit = () => {
    setBrandField("accSystem",-1)
    setField("productSearchAccSystem",-1)
    setField("salesPricesSearchPage", -1); // Disable salesPrices query
    setCustomerField("systemIdCustomerSearch",-1)
    setIsEdit(true);
  };

  const handleDelete = () => {
    indentDel(selectedIndent?.mrsId ?? 0);
    setIsModalDeleteOpen(true);
    setSelectedId(data?.[0]?.id ?? 0);
    setSelectedRowIndex(0);
  };

  const ProductPermInput = (
    inputName: string,
    inputWidth: string,
    inputValue: string,
    setInputValue: (value: string) => void
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
            convertToLatinDigits(e.target.value)
          );
          setInputValue(e.target.value);
        }}
        onFocus={() => setFocusedInput(inputName)}
        style={{ width: inputWidth }}
        className={`border p-1 text-sm rounded-sm`}
      />
    );
  };
  const { width, height } = useCalculateTableHeight();
  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
    >
      <ProductOfferHeader
        columns={columns}
        setIsNew={setIsNew}
        //setIsOpen={setIsOpen}//for open/close modal
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleConfirm={handleConfirm}
        selectedProductOffer={selectedIndent || null}
        data={data}
        refetch={refetchIndentList}
        definitionInvironment={definitionInvironment}
      />
      <div className="flex flex-col md:flex-row gap-2 px-2 h-1/2">
        <div className="flex flex-col w-full md:w-3/4 h-full">
          <div className="w-full overflow-y-scroll bg-white rounded-md h-full">
            {errorIndentList ? (
              <ErrorPage
                error={errorIndentList}
                title="خطا در بارگذاری اطلاعات"
                onRetry={() => refetchIndentList()}
                showHomeButton={true}
              />
            ) : isLoadingIndentList || isFetchingIndentList ? (
              <Skeleton />
            ) : (
              <>
                <div className="w-full flex justify-center md:justify-end items-center ">
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
                        e.target.value === "" ? -1 : e.target.value
                      );
                      setSrchId(Number(e.target.value));
                    }}
                    onFocus={() => setFocusedInput("srchId")}
                    style={{ width: columns[2].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductPermInput(
                    "srchDate",
                    columns[3].width,
                    srchDate,
                    setSrchDate
                  )}
                  {ProductPermInput(
                    "srchTime",
                    columns[4].width,
                    srchTime,
                    setSrchTime
                  )}
                  {ProductPermInput(
                    "srchSRName",
                    columns[5].width,
                    srchSRName,
                    setSrchSRName
                  )}
                  <input
                    ref={(el) => (inputRefs.current["srchPayDuration"] = el)}
                    name="srchPayDuration"
                    value={srchPayDuration === -1 ? "" : srchPayDuration}
                    onChange={(e) => {
                      preserveFocus("srchPayDuration");
                      handleDebounceFilterChange(
                        "srchPayDuration",
                        e.target.value === "" ? -1 : e.target.value
                      );
                      setSrchPayDuration(Number(e.target.value));
                    }}
                    onFocus={() => setFocusedInput("srchPayDuration")}
                    style={{ width: columns[6].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductPermInput(
                    "srchDsc",
                    columns[7].width,
                    srchDsc,
                    setSrchDsc
                  )}
                  {ProductPermInput(
                    "srchUsrName",
                    columns[8].width,
                    srchUsrName,
                    setSrchUsrName
                  )}
                  {ProductPermInput(
                    "srchStep",
                    columns[9].width,
                    srchStep,
                    setSrchStep
                  )}
                </div>
                <ProductOfferTblHeader
                  columns={columns}
                  sortId={sortId}
                  sortDate={sortDate}
                  sortTime={sortTime}
                  sortDsc={sortDsc}
                  sortSrName={sortSRName}
                  sortAmount={sortPayDuration}
                  sortUsrName={sortUsrName}
                  sortStep={sortStep}
                  setSortId={setSortId}
                  setSortDate={setSortDate}
                  setSortTime={setSortTime}
                  setSortDsc={setSortDsc}
                  setSortSrName={setSortSRName}
                  setSortAmount={setSortPayDuration}
                  setSortUsrName={setSortUsrName}
                  setSortStep={setSortStep}
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
              page={pageNumber - 1}
              setPage={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={indentListTotalCount ?? 0}
              setSelectedRowIndex={setSelectedRowIndex}
              showPagination={true}
            />
          </div>
        </div>
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
        {isLoadingIndentListDtl ? (
          <Skeleton />
        ) : (
          <div
            className="overflow-y-auto"
            style={width > 640 ? { height: height-350 } : { height: "fit" }}
          >
            <TTable
              selectedRowIndex={selectedRowIndexDtl}
              setSelectedRowIndex={setSelectedRowIndexDtl}
              columns={columnsDtl}
              data={dataDtl}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              wordWrap={true}
              showToolTip={true}
              maxVisibleColumns={8}
            />
          </div>
        )}
      </div>
      <ModalForm
        isOpen={ isNew || isEdit}
        onClose={() => {
          setIsNew(false);
          setIsEdit(false);
          //setIsOpen(false);
        }}
        title="درخواست خرید"
        width="1"
        height="90vh"
      >
        <PurchaseRequestIndentForm
          selectedIndent={selectedIndent}
          isNew={isNew}
          setIsNew={setIsNew}
          setIsEdit={setIsEdit}
          definitionDateTime={definitionDateTime}
          //setIsOpen={setIsOpen}//for open/close modal
          //setIsNew={setIsNew}
          //setIsEdit={setIsEdit}
        />
      </ModalForm>
      {/* for top confirm button operations */}
      <ModalMessage
        isOpen={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        backgroundColor={
          indentDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          indentDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={indentDoFirstFlowResponse?.meta.message || ""}
        visibleButton={false}
      />
      {/* for top delete button operations */}
      <ModalMessage
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        message={
          indentDelResponse?.meta.errorCode >0
            ? indentDelResponse?.meta.message || ""
            : "اطلاعات با موفقیت حذف شد."
        }
        visibleButton={false}
      />
      <Card
        border="none"
        rounded="none"
        backgroundColor={colors.gray_300}
        className="flex-row gap-2 rounded-bl-md rounded-br-md justify-end "
      >
        <InvoiceReceiptShowTableSummery data={dataDtl} />
      </Card>
    </div>
  );
};

export default PurchaseRequestIndent;
