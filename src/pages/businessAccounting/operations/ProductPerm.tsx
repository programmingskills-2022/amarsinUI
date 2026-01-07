//خسابداری->حسابداری بازرگانی->عملیات-> مجوز کالا
import { columns } from "../../../components/productOffer/ProductOfferGeneral";
import Accept from "../../../assets/images/GrayThem/img24_3.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useProductPerm } from "../../../hooks/useProductPerm";
import { useProductPermStore } from "../../../store/productPermStore";
import { useGeneralContext } from "../../../context/GeneralContext";
import {
  ProductPermDoFirstFlowRequest,
  ProductPermDtl,
  ProductPerm as ProductPermType,
} from "../../../types/productPerm";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
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
import ProductPermForm from "../../../components/productPerm/ProductPermForm";
import { DefinitionDateTime, DefinitionInvironment } from "../../../types/definitionInvironment";
import { TableColumns } from "../../../types/general";
import { useBrandStore } from "../../../store/brandStore";
import { useProductStore } from "../../../store/productStore";
import { useCustomerStore } from "../../../store/customerStore";

type Props = {
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
};
const ProductPerm = ({ definitionDateTime, definitionInvironment }: Props) => {
  const {
    setField,
    id: prevId,
    productPermDoFirstFlowResponse,
    productPermDelResponse,
  } = useProductPermStore();
  const {setField:setProductField}=useProductStore()
  const { setField: setCustomerField } = useCustomerStore();
  const {
    productPerm,
    productPermTotalCount,
    refetch,
    isLoading,
    isFetching,
    isLoadingDtl,
    productPermDtl,
    productPermMeta,
    addProductList,
    productPermDtlHistory,
    isLoadingDtlHistory,
    productPermSave,
    isLoadingProductPermSave,
    productPermDoFirstFlow,
    productPermDel,
  } = useProductPerm();

  //const { setField: setProductOfferField } = useProductOfferStore();
  const {setField:setBrandField}=useBrandStore()
  const [data, setData] = useState<any[]>([]);
  const [dataDtl, setDataDtl] = useState<ProductPermDtl[]>([]);
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
  const [selectedProductPerm, setSelectedProductPerm] =
    useState<ProductPermType | null>(null);
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
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productPerm table
  const [selectedRowIndexDtl, setSelectedRowIndexDtl] = useState<number>(0); //for selected row index in productPermDtl table

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
        width: "45%",
      },
      {
        Header: "نیاز به مجوز",
        accessor: "np",
        width: "5%",
      },
      {
        Header: "شرح",
        accessor: "dtlDsc",
        width: "35%",
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
      Header: "کد",
      accessor: "productCode",
    },
    {
      Header: "کالا",
      accessor: "product",
    },
    {
      Header: "نیاز به مجوز",
      accessor: "npBool",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
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
  }, [focusedInput, data, productPerm]);

  useEffect(() => {
    setField("yearId", yearId);
    setField("systemId", systemId);
    setField("yearIdDtl", yearId);
    setField("systemIdDtl", systemId);
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
      setSelectedProductPerm(
        productPerm?.find((item) => item.id === selectedId) || null
      );
  }, [selectedId, productPerm]);

  useEffect(() => {
    const tempData = productPerm?.map((item, index) => {
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
  }, [productPerm]);

  useEffect(() => {
    let tempDataDtl: any[] = [];
    if (productPermDtl) {
      tempDataDtl = productPermDtl.map((item, index) => {
        return {
          index: convertToFarsiDigits(index + 1),
          bName: convertToFarsiDigits(item.bName),
          productCode: convertToFarsiDigits(item.productCode),
          product: convertToFarsiDigits(item.product),
          npBool: item.np,
          np: item.np ? (
            <img src={Accept} alt="Accept" className="w-4 h-4" />
          ) : null,
          dtlDsc: convertToFarsiDigits(item.dtlDsc),
        };
      });
      if (tempDataDtl) {
        setDataDtl(tempDataDtl);
      }
    }
  }, [productPermDtl]);

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
    const request: ProductPermDoFirstFlowRequest = {
      chartId,
      systemId,
      yearId,
      id: selectedId,
      dsc: selectedProductPerm?.dsc || "",
    };
    productPermDoFirstFlow(request);
    setIsModalConfirmOpen(true);
  };

  const handleEdit = () => {
    setBrandField("accSystem",-1)
    setProductField("productSearchAccSystem",-1)
    setProductField("salesPricesSearchPage", -1); // Disable salesPrices query  
    setCustomerField("systemIdCustomerSearch",-1)      
    setIsEdit(true);
  };

  const handleDelete = () => {
    productPermDel(selectedId);
    setSelectedId(0)
    setSelectedRowIndex(0)
    setSelectedProductPerm(null)    
    setIsModalDeleteOpen(true);
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
  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
    >
      <ProductOfferHeader
        columns={ excelHeadCells}
        setIsNew={setIsNew}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleConfirm={handleConfirm}
        selectedProductOffer={selectedProductPerm || ({} as ProductPermType)}
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
                  {ProductPermInput(
                    "srchDate",
                    columns[2].width,
                    srchDate,
                    setSrchDate
                  )}
                  {ProductPermInput(
                    "srchTime",
                    columns[3].width,
                    srchTime,
                    setSrchTime
                  )}
                  {ProductPermInput(
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
                  {ProductPermInput(
                    "srchUsrName",
                    columns[6].width,
                    srchUsrName,
                    setSrchUsrName
                  )}
                  {ProductPermInput(
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
              totalCount={productPermTotalCount ?? 0}
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
        message={productPermMeta?.message || ""}
      />
      <ModalForm
        isOpen={isNew || isEdit}
        onClose={() => {
          setIsNew(false);
          setIsEdit(false);
        }}
        title="نیاز به مجوز"
        width="1"
      >
        <ProductPermForm
          addProductList={addProductList}
          productPermDtlHistory={productPermDtlHistory || []}
          isLoadingDtlHistory={isLoadingDtlHistory}
          productPermSave={productPermSave}
          isLoadingProductPermSave={isLoadingProductPermSave}
          selectedProductPerm={selectedProductPerm} //for check if selectedProductPerm.flwId===0 new else edit && sending selectedProductPerm.id in edit
          productPermDtls={productPermDtl}
          isNew={isNew} //for check if isNew new else edit
          setIsNew={setIsNew}
          setIsEdit={setIsEdit}
          fromWorkFlow={false} //for not going to editting in product perm form as default
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
          productPermDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          productPermDoFirstFlowResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={productPermDoFirstFlowResponse?.meta.message || ""}
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
          productPermDelResponse?.meta.errorCode >0
            ? productPermDelResponse?.meta.message || ""
            : "اطلاعات با موفقیت حذف شد."
        }
        visibleButton={false}
      />
    </div>
  );
};

export default ProductPerm;
