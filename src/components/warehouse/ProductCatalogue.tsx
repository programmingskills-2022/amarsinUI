import { useCallback, useEffect, useRef, useState } from "react";
import {
  WarehouseTemporaryReceiptIndentDtl,
} from "../../types/warehouse";
import { green, red } from "@mui/material/colors";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { Column } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import ModalMessage from "../layout/ModalMessage";
import { debounce } from "lodash";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
import { ProductCatalogTable } from "../../types/product";

type Props = {
  dtl: WarehouseTemporaryReceiptIndentDtl;
  visible: boolean;
  uid?: string;
  setUid?: (uid: string) => void;
};

const ProductCatalogue = ({ dtl, visible, uid, setUid }: Props) => {
  const { productCatalog, isLoadingProductCatalog } = useProducts();
  const { setField } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const columns: Column[] = [
    {
      Header: "ردیف",
      accessor: "rowId",
      width: "5%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "عنوان",
      accessor: "title",
      width: visible ? "15%" : "35%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "اطلاعات سیستم",
      accessor: "systemInfo",
      width: "40%",
      visible,
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "اطلاعات سامانه",
      accessor: "samaneInfo",
      width: visible ? "40%" : "60%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
  ];
  const titles = [
    "بچ",
    "صاحب مجوز",
    "کالا",
    "تولید",
    "انقضاء",
    "GTIN",
    "IRC",
    "تعداد در بسته",
    "کد گروه",
    "گروه",
    "کد وضعیت",
    "وضعیت",
  ];

  const systemInfos = [
    dtl.code,
    "",
    dtl.pName,
    dtl.produce,
    dtl.expire,
    dtl.gtin,
    dtl.irc,
    "",
    "",
    "",
    "",
  ];
  const samaneInfos = [
    productCatalog.data.result.data?.batchCode,
    productCatalog.data.result.data?.licenseOwner,
    productCatalog.data.result.data?.persianProductName,
    productCatalog.data.result.data?.manufacturing,
    productCatalog.data.result.data?.expiration,
    productCatalog.data.result.data?.gtin,
    productCatalog.data.result.data?.irc,
    productCatalog.data.result.data?.packageCount.toString(),
    productCatalog.data.result.data?.productCategoryCode.toString(),
    productCatalog.data.result.data?.productCategory,
    productCatalog.data.result.statusCode.toString(),
    productCatalog.data.result.statusMessage,
  ];

  let data: ProductCatalogTable[] = [];
  let i: number;
  for (i = 0; i < 12; i++) {
    let record: ProductCatalogTable =
      i !== 11
        ? {
            rowId: String(i + 1),
            title: titles[i],
            systemInfo: systemInfos[i] ?? "",
            samaneInfo: samaneInfos[i] ?? "",
          }
        : {
            rowId: "",
            title: titles[i],
            systemInfo: "",
            samaneInfo: productCatalog.data.result.statusMessage,
          };
    data.push(record);
  }
  //initialize product catalog request
  useEffect(() => {
    console.log(dtl,uid, "dtl in ProductCatalogue")
    if (uid !== undefined) {
      setField("idProductCatalogRequest", 0);// for estelam id value is 0
      setField("uIDProductCatalogRequest", uid!);
    } else {
      setField("idProductCatalogRequest", dtl.cId);
      setField("uIDProductCatalogRequest", dtl.uId);
    }
    //setField("iRCProductCatalogRequest", dtl.irc);
    //getProductCatalog()
  }, [dtl.cId, dtl.uId, dtl.irc]);

  const handleCellColorChange = (row: any): string | null => {
    if (row.original.title === "وضعیت")
      return row.original.samaneInfo === "مجاز" ? green[200] : red[200];
    return "";
  };

  const setCatalogRequest = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = convertToLatinDigits(e.target.value).replace(
      /\D/g,
      ""
    );
    setUid?.(numericValue);
    if (numericValue !== "") {
      setField("idProductCatalogRequest", 0); // for estelam id value is 0
      handleDebounceFilterChange("uIDProductCatalogRequest", numericValue);
    }
  };
  //for debouncing input(uid) change
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      console.log(field, value, "field, value");
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      setIsModalOpen(true);
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
  //////////////////////////////////////////////////////////////
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

  const { width } = useCalculateTableHeight();

  return (
    <div className="w-full flex flex-col gap-2">
      {uid !== undefined && (
        <div className="w-full flex justify-center items-center gap-2">
          <label className="w-20 text-left">یو آی دی:</label>
          <input
            type="text"
            value={convertToFarsiDigits(uid)}
            onChange={setCatalogRequest}
            className="w-full bg-white border-2 border-gray-300 rounded-md p-1"
          />
        </div>
      )}
      {isLoadingProductCatalog ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <>
          <TTable
            data={data}
            columns={columns}
            wordWrap={true}
            CellColorChange={handleCellColorChange}
            fontSize={width > 640 ? "1rem" : "0.75rem"}
          />
        </>
      )}
      {uid !== undefined && (
        <ModalMessage
          isOpen={isModalOpen}
          backgroundColor={
            productCatalog?.meta?.errorCode === -1
              ? "bg-green-200"
              : "bg-red-200"
          }
          color="text-white"
          onClose={() => setIsModalOpen(false)}
          message={productCatalog?.meta?.message || ""}
          visibleButton={false}
        />
      )}
    </div>
  );
};

export default ProductCatalogue;
