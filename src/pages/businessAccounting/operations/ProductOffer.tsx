//خسابداری->حسابداری بازرگانی->عملیات-> آفر کالا
import React, { useCallback, useEffect, useRef, useState } from "react";
import Accept from "../../../assets/images/GrayThem/img24_3.png";
import { useGeneralContext } from "../../../context/GeneralContext";
import TTable from "../../../components/controls/TTable";
import { useProductOfferStore } from "../../../store/productOfferStore";
import { useProductOffer } from "../../../hooks/useProductOffer";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../../utilities/general";
import ModalMessage from "../../../components/layout/ModalMessage";
import Skeleton from "../../../components/layout/Skeleton";
import ProductOfferParams from "../../../components/productOffer/ProductOfferParams";
import ModalForm from "../../../components/layout/ModalForm";
import ProductOfferForm from "../../../components/productOffer/ProductOfferForm";
import {
  ProductOffer as ProductOfferType,
  ProductOfferDtlTable,
} from "../../../types/productOffer";
import { debounce } from "lodash";
import { TablePaginationActions } from "../../../components/controls/TablePaginationActions";
import ProductOfferTblHeader from "../../../components/productOffer/ProductOfferTblHeader";
import ProductOfferHeader from "../../../components/productOffer/ProductOfferHeader";
import { columns } from "../../../components/productOffer/ProductOfferGeneral";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../../types/definitionInvironment";
import { TableColumns } from "../../../types/general";
import { useBrandStore } from "../../../store/brandStore";
import { useProductStore } from "../../../store/productStore";
import { useCustomerStore } from "../../../store/customerStore";

type Props = {
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
};
const ProductOffer = ({ definitionDateTime, definitionInvironment }: Props) => {
  const columnsDtl = React.useMemo(
    () => [
      {
        Header: "ردیف",
        accessor: "index",
        width: "5%",
      },
      {
        Header: "برند",
        accessor: "bName",
        width: "10%",
      },
      {
        Header: "کالا",
        accessor: "product",
        width: "40%",
      },
      {
        Header: convertToFarsiDigits("پ 1"),
        accessor: "s1O",
        width: "5%",
      },
      {
        Header: convertToFarsiDigits("پ 2"),
        accessor: "s2O",
        width: "5%",
      },
      {
        Header: convertToFarsiDigits("پ 3"),
        accessor: "s3O",
        width: "5%",
      },
      {
        Header: convertToFarsiDigits("پ 4"),
        accessor: "s4O",
        width: "5%",
      },
      {
        Header: "بدون آفر",
        accessor: "no",
        width: "5%",
      },
      {
        Header: "توضیح",
        accessor: "dtlDsc",
        width: "20%",
      },
    ],
    []
  );
  ////////////////////////////////////////////////////////
  //for excel head cells
  const excelHeadCells: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
    },
    {
      Header: "برند",
      accessor: "bName",
    },
    {
      Header: "کد کالا",
      accessor: "productCode",
    },
    {
      Header: "نام کالا",
      accessor: "product",
    },
    {
      Header: "پ 1",
      accessor: "s1Excel",
    },
    {
      Header: "پ 2",
      accessor: "s2Excel",
    },
    {
      Header: "پ 3",
      accessor: "s3Excel",
    },
    {
      Header: "پ 4",
      accessor: "s4Excel",
    },
    {
      Header: "بدون آفر",
      accessor: "no",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
  const {
    setField,
    id: prevId,
    productOfferDelResponse,
  } = useProductOfferStore();
  const {setField:setProductField}=useProductStore()
  const { setField: setCustomerField } = useCustomerStore();
  const {
    productOffer,
    productOfferTotalCount,
    productOfferDtl,
    productOfferMeta,
    isLoading,
    isFetching,
    isLoadingDtl,
    refetch,
    addProductList,
    isLoadingAddList,
    productOfferDtlHistory,
    isLoadingProductOfferDtlHistory,
    productOfferSave,
    isLoadingProductOfferSave,
    productOfferDoFirstFlow,
    productOfferDel,
  } = useProductOffer();

  //const { setField: setProductOfferField } = useProductOfferStore();
  const {setField:setBrandField}=useBrandStore()
  const [data, setData] = useState<any[]>([]);
  const [dataDtl, setDataDtl] = useState<ProductOfferDtlTable[]>([]);
  const { yearId, systemId, chartId, defaultRowsPerPage } = useGeneralContext();
  const [selectedId, setSelectedId] = useState<number>(1363);
  const [isNew, setIsNew] = useState<boolean>(false); //for new
  const [isEdit, setIsEdit] = useState<boolean>(false); //for edit
  //for ProductOfferParams params
  const [regFDate, setRegFDate] = useState<Date | null>(null);
  const [regTDate, setRegTDate] = useState<Date | null>(null);
  const [fDate, setFDate] = useState<Date | null>(null);
  const [tDate, setTDate] = useState<Date | null>(null);
  const [state, setState] = useState<number>(-1);
  const [selectedProductOffer, setSelectedProductOffer] =
    useState<ProductOfferType | null>(null);
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
  const [sortId, setSortId] = useState<number>(0);
  const [sortDate, setSortDate] = useState<number>(0);
  const [sortTime, setSortTime] = useState<number>(0);
  const [sortDsc, setSortDsc] = useState<number>(0);
  const [sortAccepted, setSortAccepted] = useState<number>(0);
  const [sortUsrName, setSortUsrName] = useState<number>(0);
  const [sortStep, setSortStep] = useState<number>(0);

  // Refs for maintaining focus on input elements
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productOffer table
  const [selectedRowIndexDtl, setSelectedRowIndexDtl] = useState<number>(0); //for selected row index in productOfferDtl table

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

  useEffect(() => {
    setField("acc_Year", yearId);
    setField("acc_System", systemId);
    setField("acc_YearDtl", yearId);
    setField("acc_SystemDtl", systemId);
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
    setField("srchAccepted", srchAccepted);
    setField("srchUsrName", srchUsrName);
    setField("srchStep", srchStep);
    setProductField("productSearchAccSystem",-1)
    setProductField("salesPricesSearchPage", -1); // Disable salesPrices query    
  }, [srchId,srchDate,srchTime,srchDsc,srchAccepted,srchUsrName,srchStep]);

  useEffect(() => {
    setField("sortId", sortId);
    setField("sortDate", sortDate);
    setField("sortTime", sortTime);
    setField("sortDsc", sortDsc);
    setField("sortAccepted", sortAccepted);
    setField("sortUsrName", sortUsrName);
    setField("sortStep", sortStep);
  }, [
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortAccepted,
    sortUsrName,
    sortStep,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);
    setField("pageNumber", pageNumber);
  }, [pageNumber]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("srchDsc", srchDsc);
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
    yearId,
    sortId,
    sortDate,
    sortTime,
    sortDsc,
    sortAccepted,
    sortUsrName,
    sortStep,
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

      setField(field, value);
    }, 500),
    [setField]
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
    console.log("selectedId", selectedId);
    if (prevId !== selectedId) {
      setField("id", selectedId);
    }
    selectedId !== 0 &&
      setSelectedProductOffer(
        productOffer?.find((item) => item.id === selectedId) || null
      );
  }, [selectedId, selectedRowIndex]);

  useEffect(() => {
    const tempData = productOffer?.map((item, index) => {
      return {
        ...item,
        id: convertToFarsiDigits(item.id),
        dat: convertToFarsiDigits(item.dat),
        tim: convertToFarsiDigits(item.tim),
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
  }, [productOffer]);

  useEffect(() => {
    let tempDataDtl: ProductOfferDtlTable[] = [];
    if (productOfferDtl) {
      tempDataDtl = productOfferDtl.map((item, index) => {
        return {
          index: convertToFarsiDigits(index + 1),
          id: item.id,
          bName: convertToFarsiDigits(item.bName),
          pId: item.pId,
          product: convertToFarsiDigits(item.product),
          productCode: convertToFarsiDigits(item.productCode),
          lastDate: convertToFarsiDigits(item.lastDate),
          s1O:
            item.s1N + item.s1D < 0
              ? ""
              : convertToFarsiDigits(
                  item.s1D.toString() + "+" + item.s1N.toString()
                ),
          s2O:
            item.s2N + item.s2D < 0
              ? ""
              : convertToFarsiDigits(
                  item.s2D.toString() + "+" + item.s2N.toString()
                ),
          s3O:
            item.s3N + item.s3D < 0
              ? ""
              : convertToFarsiDigits(
                  item.s3D.toString() + "+" + item.s3N.toString()
                ),
          s4O:
            item.s4N + item.s4D < 0
              ? ""
              : convertToFarsiDigits(
                  item.s4D.toString() + "+" + item.s4N.toString()
                ),
          s1N: "",
          s1D: "",
          s2N: "",
          s2D: "",
          s3N: "",
          s3D: "",
          s4N: "",
          s4D: "",
          no: item.no ? (
            <img src={Accept} alt="Accept" className="w-4 h-4" />
          ) : null,
          dtlDsc: convertToFarsiDigits(item.dtlDsc),
          //for excel
          s1Excel:
            Number(item.s1N) + Number(item.s1D) > 0
              ? item.s1D.toString() + "+" + item.s1N.toString()
              : "",
          s2Excel:
            Number(item.s2N) + Number(item.s2D) > 0
              ? item.s2D.toString() + "+" + item.s2N.toString()
              : "",
          s3Excel:
            Number(item.s3N) + Number(item.s3D) > 0
              ? item.s3D.toString() + "+" + item.s3N.toString()
              : "",
          s4Excel:
            Number(item.s4N) + Number(item.s4D) > 0
              ? item.s4D.toString() + "+" + item.s4N.toString()
              : "",
        };
      });
      if (tempDataDtl) {
        setDataDtl(tempDataDtl);
      }
    }
  }, [productOfferDtl]);

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
    setField("chartIdProductOfferDoFirstFlow", chartId);
    setField("acc_SystemProductOfferDoFirstFlow", systemId);
    setField("acc_YearProductOfferDoFirstFlow", yearId);
    setField("idProductOfferDoFirstFlow", selectedId);
    setField("dscProductOfferDoFirstFlow", selectedProductOffer?.dsc || "");
    setIsModalConfirmOpen(true);
  };

  const handleEdit = () => {
    setBrandField("accSystem",-1)
    setProductField("productSearchAccSystem",-1)
    setProductField("salesPricesSearchPage", -1); // Disable salesPrices query      
    setProductField("acc_YearIndentRequest",-1)  
    setCustomerField("systemIdCustomerSearch",-1)
    setIsEdit(true);
  };

  const handleDelete = () => {
    productOfferDel(selectedId);
    setSelectedId(0);
    setSelectedRowIndex(0);
    setSelectedProductOffer(null);
    setIsModalDeleteOpen(true);
  };

  const ProductOfferInput = (
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

  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
    >
      {/* Top header */}
      <ProductOfferHeader
        columns={excelHeadCells}
        setIsNew={setIsNew}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleConfirm={handleConfirm}
        selectedProductOffer={selectedProductOffer as ProductOfferType}
        data={dataDtl}
        refetch={refetch}
        definitionInvironment={definitionInvironment}
      />
      <div className="flex flex-col md:flex-row gap-2 px-2 h-1/2">
        <div className="flex flex-col w-full md:w-3/4 h-full">
          <div className="w-full overflow-y-scroll bg-white rounded-md h-full">
            {isLoading || isFetching ? (
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
                    style={{ width: columns[1].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductOfferInput(
                    "srchDate",
                    columns[2].width,
                    srchDate,
                    setSrchDate
                  )}
                  {ProductOfferInput(
                    "srchTime",
                    columns[3].width,
                    srchTime,
                    setSrchTime
                  )}
                  {ProductOfferInput(
                    "srchDsc",
                    columns[4].width,
                    srchDsc,
                    setSrchDsc
                  )}
                  <input
                    name="srchAccepted"
                    type="checkbox"
                    checked={srchAccepted === 1}
                    onChange={(e) => {
                      handleDebounceFilterChange(
                        "srchAccepted",
                        e.target.checked ? 1 : -1
                      );
                      setSrchAccepted(Number(e.target.checked ? 1 : -1));
                    }}
                    style={{ width: columns[5].width }}
                    className={`border p-1 text-sm rounded-sm`}
                  />
                  {ProductOfferInput(
                    "srchUsrName",
                    columns[6].width,
                    srchUsrName,
                    setSrchUsrName
                  )}
                  {ProductOfferInput(
                    "srchStep",
                    columns[7].width,
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
                />
                <TTable
                  columns={columns}
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
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
              totalCount={productOfferTotalCount ?? 0}
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
          <TTable
            columns={columnsDtl}
            selectedRowIndex={selectedRowIndexDtl}
            setSelectedRowIndex={setSelectedRowIndexDtl}
            data={dataDtl}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            showToolTip={true}
            maxVisibleColumns={8}
          />
        )}
      </div>
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={productOfferMeta?.message || ""}
      />
      <ModalForm
        isOpen={isNew || isEdit}
        onClose={() => {
          setIsNew(false);
          setIsEdit(false);
        }}
        title="آفرهای کالا"
        width="1"
      >
        <ProductOfferForm
          addProductList={addProductList}
          isLoadingAddList={isLoadingAddList}
          productOfferDtlHistory={productOfferDtlHistory || []}
          isLoadingProductOfferDtlHistory={isLoadingProductOfferDtlHistory}
          productOfferSave={productOfferSave}
          isLoadingProductOfferSave={isLoadingProductOfferSave}
          selectedProductOffer={selectedProductOffer} //for check if selectedProductOffer.flwId===0 new else edit && sending selectedProductOffer.id in edit
          productOfferDtls={productOfferDtl}
          isNew={isNew} //for check if isNew new else edit
          setIsNew={setIsNew}
          setIsEdit={setIsEdit}
          fromWorkFlow={false}
          canEditForm1={true}
          selectedId={selectedId}
          setSelectedRowIndex={setSelectedRowIndex}
          definitionDateTime={definitionDateTime}
        />
      </ModalForm>
      <ModalMessage
        isOpen={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        backgroundColor={
          (productOfferDoFirstFlow?.meta?.errorCode ?? 0) <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          (productOfferDoFirstFlow?.meta?.errorCode ?? 0) <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={productOfferDoFirstFlow?.meta.message || ""}
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
          productOfferDelResponse?.meta.errorCode > 0
            ? productOfferDelResponse?.meta.message || ""
            : "اطلاعات با موفقیت حذف شد."
        }
        visibleButton={false}
      />
    </div>
  );
};

export default ProductOffer;
