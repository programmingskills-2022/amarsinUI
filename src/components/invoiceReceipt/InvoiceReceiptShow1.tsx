import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import { useGeneralContext } from "../../context/GeneralContext";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
  convertToPersianDate,
  formatNumberWithCommas,
  parsePersianDateString,
} from "../../utilities/general";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
//import { useBrandStore } from "../../store/brandStore";
import { EditableInput } from "../controls/TTable";

import { DefinitionDateTime } from "../../types/definitionInvironment";
import {
  Indent,
  IndentSaveRequest,
  IndentDtlHistory,
  IndentShowProductListRequest,
  IndentDtl,
  Detail,
  IndentShowProductListResponse,
} from "../../types/purchaseRequest";
import {
  QueryObserverResult,
  UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { IndentDtlTable, IndentMrsResponse } from "../../types/invoiceReceipt";
import InvoiceReceiptShowConditions from "./InvoiceReceiptShowConditions";
import InvoiceReceiptShowTable1 from "./InvoiceReceiptShowTable1";
import { useInvoiceReceiptStore } from "../../store/invoiceReceiptStore";

type Props = {
  addProductList: UseMutateAsyncFunction<
    any,
    Error,
    IndentShowProductListRequest,
    unknown
  >;
  dtlHistoryResponse: IndentDtlHistory[];
  isDtHistoryLoading: boolean;
  saveList: UseMutateAsyncFunction<any, Error, IndentSaveRequest, unknown>;
  saveListResponse: any;
  isLoadingSaveList: boolean;
  indentList: Indent[];
  indentListDtl: IndentDtl[];
  fromWorkFlow: boolean;
  canEditForm1: boolean;
  selectedId: number;
  selectedIndent: Indent | null;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  definitionDateTime: DefinitionDateTime;
  mrsId: number;
  indentMrsResponse: IndentMrsResponse;
  getIndentMrsResponse: () => Promise<
    QueryObserverResult<IndentMrsResponse, Error>
  >;
};
export type Fields = {
  customer: DefaultOptionTypeStringId | null;
  customerCondition: DefaultOptionTypeStringId[] | null;
  brand: DefaultOptionTypeStringId[] | null;
  payDuration: number;
  price: { id: number; title: string } | null;
  fdate: Date | null;
  tdate: Date | null;
  dsc: string;
  dat: string;
  tim: string;
};
export const headCells = [
  {
    Header: "ردیف",
    accessor: "index",
    width: "2%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "برند",
    accessor: "bName",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "کالا",
    accessor: "product",
    width: "25%",
    type: "autoComplete",
    placeholder: "کالا را انتخاب کنید...",
    Cell: EditableInput,
  },
  {
    Header: "موجودی",
    accessor: "companyStock",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فروش",
    accessor: "sumCompanyCnt",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "موجودی",
    accessor: "storeStock",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فروش",
    accessor: "sumStoreCnt",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "خرید",
    accessor: "lbDate",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "تعداد",
    accessor: "cnt",
    width: "5%",
    type: "inputText",
    Cell: EditableInput,
  },
  {
    Header: "آفر",
    accessor: "offer",
    width: "5%",
    type: "inputText",
    Cell: EditableInput,
  },
  {
    Header: "مبلغ",
    accessor: "cost",
    width: "5%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "تخفیف",
    accessor: "dcrmnt",
    width: "5%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "مالیات",
    accessor: "taxValue",
    width: "5%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value)),
  },
  {
    Header: "جمع",
    accessor: "total",
    width: "5%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value)),
  },
  {
    Header: "شرح",
    accessor: "dtlDsc",
    width: "10%",
    type: "textArea",
    Cell: EditableInput,
  },
  {
    Header: " ",
    accessor: "icons",
    width: "3%",

    Cell: () => {
      return (
        <div className="flex w-full">
          {
            <img
              src={TrashIcon}
              onClick={() => console.log("hello")}
              className="cursor-pointer"
              alt="TrashIcon"
            />
          }
          <img
            src={HistoryIcon}
            onClick={() => console.log("hello")}
            className="cursor-pointer"
            alt="HistoryIcon"
          />
        </div>
      );
    },
  },
];
const InvoiceReceiptShow1 = ({
  addProductList,
  dtlHistoryResponse,
  isDtHistoryLoading,
  saveList,
  saveListResponse,
  isLoadingSaveList,
  indentList,
  indentListDtl,
  fromWorkFlow,
  canEditForm1,
  selectedId,
  selectedIndent,
  isNew,
  setIsNew,
  setIsEdit,
  definitionDateTime,
  mrsId,
  indentMrsResponse,
  getIndentMrsResponse,
}: Props) => {
  /*const { indentMrsResponse, isLoading, getIndentMrsResponse } =
    useInvoiceReceipt();*/
  const { mrsId: mrsIdStore, setField: setInvoiceReceiptField } = useInvoiceReceiptStore();
  const [addList, setAddList] = useState<any[]>([]);
  //const [search, setSearch] = useState<string>("");
  const [showDeleted, setShowDeleted] = useState(true);
  //const [brandSearch, setBrandSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    products,
    isProductSearchLoading,
    productSearchFetchNextPage,
    productSearchHasNextPage,
    isProductSearchFetchingNextPage,
    salesPricesSearchResponse,
  } = useProducts();
  const { setField: setProductField } = useProductStore();
  const { yearId, systemId } = useGeneralContext();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<IndentDtlTable[]>([]);

  const [isModalRegOpen, setIsModalRegOpen] = useState(false);

  const [fields, setFields] = useState<Fields>({
    customer: {
      id: indentMrsResponse.data.result.indents?.[0]?.cId.toString() ?? "",
      title: indentMrsResponse.data.result.indents?.[0]?.srName ?? "",
    },
    customerCondition: [],
    brand: [],
    payDuration: indentMrsResponse.data.result.indents?.[0]?.payDuration ?? 0,
    dsc: indentMrsResponse.data.result.indents?.[0]?.dsc ?? "",
    price: {
      id: 0,
      title: "",
    },
    fdate: parsePersianDateString(
      indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
    )
      ? parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
        )
      : null,
    tdate: parsePersianDateString(
      indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
    )
      ? parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
        )
      : null,
    dat: isNew
      ? convertToFarsiDigits(
          convertToPersianDate(new Date(definitionDateTime.date))
        )
      : convertToFarsiDigits(
          indentMrsResponse.data.result.indents?.[0]?.dat ?? ""
        ),
    tim: isNew
      ? convertToFarsiDigits(definitionDateTime.time)
      : convertToFarsiDigits(
          indentMrsResponse.data.result.indents?.[0]?.tim ?? ""
        ),
  });
    // Set mrsId BEFORE useInvoiceReceipt hook runs to prevent stale queries
  if (mrsId !== mrsIdStore)
  {
    setInvoiceReceiptField("mrsId", mrsId);
  }

  ///////////////////////////////////////////////////////
  useEffect(() => {
    //console.log(isNew, indentList, "isNew");
    if (isNew) {
      setFields((prev) => ({
        ...prev,
        customer: null,
        customerCondition: [],
        brand: [],
        payDuration: 0,
        dsc: "",
        price: null,
        fdate: null,
        tdate: null,
        dat: "",
        tim: "",
      }));
    } else {
      setFields((prev: Fields) => ({
        ...prev,
        customer: {
          id: indentMrsResponse.data.result.indents?.[0]?.cId.toString() ?? "",
          title: indentMrsResponse.data.result.indents?.[0]?.srName ?? "",
        },
        payDuration:
          indentMrsResponse.data.result.indents?.[0]?.payDuration ?? 0,
        dsc: indentMrsResponse.data.result.indents?.[0]?.dsc ?? "",
        price: {
          id: indentMrsResponse.data.result.indents?.[0]?.salesPriceId ?? 0,
          title:
            indentMrsResponse.data.result.indents?.[0]?.salesPriceTitle ?? "",
        },
        fdate: parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
        )
          ? parsePersianDateString(
              indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
            )
          : null,
        tdate: parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
        )
          ? parsePersianDateString(
              indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
            )
          : null,
        dat: isNew
          ? convertToFarsiDigits(
              convertToPersianDate(new Date(definitionDateTime.date))
            )
          : convertToFarsiDigits(
              indentMrsResponse.data.result.indents?.[0]?.dat ?? ""
            ),
        tim: isNew
          ? convertToFarsiDigits(definitionDateTime.time)
          : convertToFarsiDigits(
              indentMrsResponse.data.result.indents?.[0]?.tim ?? ""
            ),
      }));
    }
  }, [isNew, indentMrsResponse.data.result.indents?.[0]]);

  ////////////////////////////////////////////////////////
  const columns: TableColumns = useMemo(() => {
    return headCells.map((item) => {
      return {
        ...item,
        options:
          item.accessor === "product"
            ? products &&
              products.map((p) => ({
                id: p.pId,
                title: p.n,
              }))
            : undefined,
        //setSearch: item.accessor === "product" ? setSearch : undefined,
        isLoading: item.accessor === "product" ? isProductSearchLoading : false,
        setField: item.accessor === "product" ? setProductField : undefined,
        fieldValues:
          item.accessor === "product"
            ? [
                { field: "productSearchAccSystem", value: systemId },
                { field: "productSearchAccYear", value: yearId },
                { field: "productSearchPage", value: 1 },
              ]
            : undefined,
        fieldSearch:
          item.accessor === "product" ? "productSearchSearch" : undefined,
        fetchNextPage:
          item.accessor === "product" ? productSearchFetchNextPage : undefined,
        hasNextPage:
          item.accessor === "product" ? productSearchHasNextPage : undefined,
        isFetchingNextPage:
          item.accessor === "product" ? isProductSearchFetchingNextPage : false,
        Cell:
          item.accessor === "icons"
            ? ({ row }: any) => {
                return (
                  <div className="flex w-full">
                    {canEditForm1 && (
                      <img
                        src={row.original.isDeleted ? RestoreIcon : TrashIcon}
                        onClick={() => updateToDeleted(row)}
                        className="cursor-pointer"
                        alt="TrashIcon"
                      />
                    )}
                    <img
                      src={HistoryIcon}
                      onClick={() => handleShowHistory(row)}
                      className="cursor-pointer"
                      alt="HistoryIcon"
                    />
                  </div>
                );
              }
            : item.Cell,
      };
    });
  }, [
    products,
    systemId,
    yearId,
    productSearchFetchNextPage,
    productSearchHasNextPage,
    isProductSearchFetchingNextPage,
  ]);

  // Initialize data when indentMrsResponse changes
  useEffect(() => {
    if (isNew) return;
    if (indentMrsResponse.data.result.indentDtls) {
      let i = 1;
      let initialData = indentMrsResponse.data.result.indentDtls.map((dtl) => ({
        ...dtl,
        index: i++,
        isDeleted: false,
      }));
      initialData.push({ ...newRow, index: initialData.length + 1 });
      //setOriginalData(initialData);
      //setData(initialData);
      console.log(initialData, "initialData");
      setAddList(initialData);
    }
  }, [indentMrsResponse.data.result.indentDtls]);


  /*useEffect(() => {
    //if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
    setBrandField("accSystem", -1);
    setProductField("salesPricesSearchPage", -1); // Disable salesPrices query
    setProductField("pId", -1);
    setProductField("mrsId", -1);
    setCustomerField("systemIdCustomerSearch", -1);

    setProductField("acc_YearIndentRequest",-1) 
    ////////////////////////////////////////////////////////
    //}
  }, [mrsId]);  */
  ////////////////////////////////////////////////////////
  const handleShowHistory = (row: any) => {
    //console.log("enter handleShowHistory")
    if (row.original.pId !== 0) {
      setProductField("pId", row.original.pId);
      setProductField("mrsId", mrsId);
      setProductField("mrsIdTrigger", Date.now());
      setShowHistory(true);
    }
  };

  const updateToDeleted = (row: any) => {
    setOriginalData((old) =>
      old.map((origRow) => {
        if (
          origRow.id === row.original.id &&
          origRow.pId === row.original.pId
        ) {
          return { ...origRow, isDeleted: !origRow.isDeleted };
        }
        return origRow;
      })
    );
  };
  ///////////////////////////////////////////////////////
  /*useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandSearch);
  }, [brandSearch, systemId]);*/
  ///////////////////////////////////////////////////////
  const newRow: IndentDtlTable = {
    index: 0,
    id: 0,
    ordr: 0,
    custId: 0,
    customer: "",
    pId: 0,
    bName: "",
    productCode: "",
    product: "",
    sumCompanyCnt: 0,
    sumStoreCnt: 0,
    lbDate: "",
    companyStock: 0,
    storeStock: 0,
    productExp: "",
    cnt: 0,
    offer: 0,
    cost: 0,
    dcrmntPrcnt: 0,
    dcrmnt: 0,
    tax: 0,
    taxValue: 0,
    total: 0,
    dtlDsc: "",
    del: false,
    recieptId: 0,
    recieptDsc: "",
    isDeleted: false,
  };
  const handleShowDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(e.target.checked);
  };
  ////////////////////////////////////////////////////////
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

  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (isNew && addList.length === 0) {
      setAddList([newRow]);
    }
  }, []);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log(isNew, selectedIndent, "selectedIndent");
    if (
      isNew === false &&
      selectedIndent !== null &&
      (selectedIndent.flwId === 0 || fromWorkFlow) &&
      indentListDtl !== undefined
    ) {
      //for edit
      //console.log(indentListDtl, "indentListDtl");
      const temp: any[] = indentListDtl.map((item) => ({
        ...item,
        isDeleted: false,
        index: indentListDtl.length + 1,
      }));
      temp.push({ ...newRow });
      setAddList(temp);
    }
  }, [selectedIndent, indentListDtl]);
  ////////////////////////////////////////////////////////
  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ): Promise<IndentShowProductListResponse | undefined> => {
    if (e) e.preventDefault();
    let request: IndentShowProductListRequest;
    request = {
      mrsId: mrsId,
      productId: productId,
      acc_Year: yearId,
      providers:
        fields.customerCondition?.map((provider) => Number(provider.id)) ?? [],
      brands: fields.brand?.map((b) => Number(b.id)) ?? [],
      salesPriceId: Number(fields.price?.id ?? 0),
      saleFDate:
        fields.fdate === null || !fields.fdate
          ? ""
          : convertPersianDate(fields.fdate.toLocaleDateString("fa-IR")),
      saleTDate:
        fields.tdate === null || !fields.tdate
          ? ""
          : convertPersianDate(fields.tdate.toLocaleDateString("fa-IR")),
    };

    console.log(request, "request");
    try {
      return await addProductList(request);
    } catch (error) {
      console.error("Error editing indents:", error);
    }
  };
  ////////////////////////////////////////////////////////
  const handleSubmitAndAddToTable = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ) => {
    console.log(addList, "initial addList");
    console.log(e, productId);
    const res = await handleSubmit(e, productId);

    console.log(res, "res");
    if (res && res.data.result) {
      // Filter out newRow entries (empty rows) before adding new records
      const filteredPrev = addList.filter((item: IndentDtl) => {
        // Remove items that match newRow pattern (id === 0 and product is empty)
        return !(
          item.id === 0 &&
          item.productCode === "" &&
          item.product === "" &&
          item.pId === 0
        );
      });

      let filtered = res.data.result.filter((product) => {
        const same = addList.find((temp) => temp.pId === product.pId);
        return same ? null : product;
      });
      console.log(filtered, "filtered");
      // Map all products at once
      const newProducts = filtered.map((product) => ({
        id: product.id,
        ordr: 0,
        custId: 0,
        customer: "",
        pId: product.pId,
        bName: product.bName,
        productCode: "",
        product: product.product,
        sumCompanyCnt: product.sumCompanyCnt ?? 0,
        sumStoreCnt: product.sumStoreCnt ?? 0,
        lbDate: product.lbDate ?? "",
        companyStock: product.companyStock ?? 0,
        storeStock: product.storeStock ?? 0,
        productExp: "",
        cnt: product.cnt ?? 0,
        offer: product.offer ?? 0,
        cost: product.cost ?? 0,
        dcrmntPrcnt: 0,
        dcrmnt: 0,
        tax: product.tax ?? 0,
        taxValue: product.taxValue ?? 0,
        total: product.total ?? 0,
        dtlDsc: product.dtlDsc,
        del: false,
        recieptId: 0,
        recieptDsc: "",
        isDeleted: false,
      }));

      // Add new empty row in the SAME update to avoid second state update
      const newAddList = [
        ...filteredPrev,
        ...newProducts,
        {
          ...newRow,
          isDeleted: false,
        },
      ];
      setAddList(newAddList);
    }
    //setIsOpen!==undefined && setIsOpen(false); //for close modal
  };
  ///////////////////////////////////////////////////////
  const handleAddRow = (
    index: number,
    setData: Dispatch<SetStateAction<IndentDtlTable[]>>
  ) => {
    setData((prev: IndentDtlTable[]) => [...prev, { ...newRow, index: index }]);
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<any | undefined> => {
    if (e) e.preventDefault();
    let request: IndentSaveRequest;
    const dtls: Detail[] = originalData
      .map((item) => {
        const dtl: Detail = {
          id: item.id,
          cId: item.custId,
          pId: item.pId,
          cnt: convertToLatinDigits(item.cnt.toString()),
          offer: convertToLatinDigits(item.offer.toString()),
          cost: convertToLatinDigits(item.cost.toString()),
          dcrmntPrcnt: item.dcrmntPrcnt.toString(),
          dcrmnt: convertToLatinDigits(item.dcrmnt.toString()),
          taxValue: item.taxValue.toString(),
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };
        if (item.cnt !== 0) {
          return dtl;
        } else {
          return undefined;
        }
      })
      .filter((item) => item !== undefined);

    request = {
      id: 0,
      ordrId: indentList?.[0]?.ordrId ?? "0",
      mrsId,
      customerId: Number(fields.customer?.id) ?? 0,
      del: showDeleted,
      acc_System: systemId,
      acc_Year: yearId,
      payDuration: fields.payDuration,
      dat: convertToLatinDigits(fields.dat), //indentMrsResponse.data.result.indents[0]?.dat ?? "",
      tim: convertToLatinDigits(fields.tim), //indentMrsResponse.data.result.indents[0]?.tim ?? "",
      dsc: fields.dsc,
      salesPriceId: Number(fields.price?.id ?? 0),
      saleFDate:
        fields.fdate === null || !fields.fdate
          ? ""
          : convertPersianDate(fields.fdate.toLocaleDateString("fa-IR")),
      saleTDate:
        fields.tdate === null || !fields.tdate
          ? ""
          : convertPersianDate(fields.tdate.toLocaleDateString("fa-IR")),
      dtls,
    };
    console.log(request, "request");
    try {
      const response = await saveList(request);
      setIsModalRegOpen(true);
      getIndentMrsResponse();
      if (response.meta.errorCode <= 0) {
        setIsNew(false);
        setIsEdit(false);
      }
      return response;
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <InvoiceReceiptShowConditions
        canEditForm={canEditForm1}
        fields={fields}
        setFields={setFields}
        salesPricesSearchResponse={salesPricesSearchResponse}
        handleSubmitAndAddToTable={handleSubmitAndAddToTable}
        indentListDtl={indentListDtl}
      />
      <div className="flex items-center justify-between gap-4">
        <label className="text-lg font-bold">اقلام</label>
        <hr className="w-full border-2 border-gray-300" />
        <div className="flex gap-2 items-center justify-end w-32">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeleted}
          />
          <p className="text-sm whitespace-nowrap">نمایش حذف شده ها</p>
        </div>
      </div>

      <InvoiceReceiptShowTable1
        canEditForm1={canEditForm1}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        isNew={isNew}
        //isEdit={isEdit}
        columns={columns}
        originalData={originalData}
        setOriginalData={setOriginalData}
        isLoadingSaveList={isLoadingSaveList}
        saveListResponse={saveListResponse}
        handleSubmitSave={handleSubmitSave}
        //isModalEmptyOpen={isModalEmptyOpen} //if user not fill the price, this modal will open
        //setIsModalEmptyOpen={setIsModalEmptyOpen} //if user not fill the price, this modal will open
        isDtHistoryLoading={isDtHistoryLoading}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        dtlHistoryResponse={dtlHistoryResponse}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isModalRegOpen={isModalRegOpen}
        setIsModalRegOpen={setIsModalRegOpen}
        selectedId={selectedId}
        //isLoading={isLoading}
      />
    </div>
  );
};

export default InvoiceReceiptShow1;
