import { useEffect } from "react";
import { HeadCell } from "../../hooks/useTable";
import { useWarehouse } from "../../hooks/useWarehouse";
import {
  ProductCatalogTable,
  WarehouseTemporaryReceiptIndentDtl,
} from "../../types/warehouse";
import { Table } from "../controls/Table";
import { useWarehouseStore } from "../../store/warehouseStore";
import {  green, red } from "@mui/material/colors";

type Props = {
  dtl: WarehouseTemporaryReceiptIndentDtl;
};

const ProductCatalogue = ({ dtl }: Props) => {
  const { productCatalog, } = useWarehouse();
  const { setField } = useWarehouseStore();
  const headCells: HeadCell<ProductCatalogTable>[] = [
    {
      id: "rowId",
      label: "ردیف",
      disableSorting: true,
      cellWidth: "5%",
      isNumber: true,
      changeColor: true,
    },
    {
      id: "title",
      label: "عنوان",
      cellWidth: "15%",
      isNumber: true,
      disableSorting: true,
      changeColor: true,
    },
    {
      id: "systemInfo",
      label: "اطلاعات سیستم",
      cellWidth: "40%",
      isNumber: true,
      disableSorting: true,
      changeColor: true,
    },
    {
      id: "samaneInfo",
      label: "اطلاعات سامانه",
      cellWidth: "40%",
      isNumber: true,
      disableSorting: true,
      changeColor: true,
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
    productCatalog.data?.BatchCode,
    productCatalog.data?.LicenseOwner,
    productCatalog.data?.PersianProductName,
    productCatalog.data?.Manufacturing,
    productCatalog.data?.Expiration,
    productCatalog.data?.GTIN,
    productCatalog.data?.IRC,
    productCatalog.data?.PackageCount.toString(),
    productCatalog.data?.ProductCategoryCode.toString(),
    productCatalog.data?.ProductCategory,
    productCatalog?.statusCode.toString(),
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
            systemInfo: productCatalog.statusMessage,
            samaneInfo: "",
          };
    data.push(record);
  }

  useEffect(() => {
    console.log(dtl.cId, "dtl.cId")
    setField("productId", dtl.cId);
    //getProductCatalog()

  }, []);

  const handleCellColorChange = (
    cell: HeadCell<ProductCatalogTable>,
    item: ProductCatalogTable
  ) => {
    if (cell.changeColor && item?.["title"] === "وضعیت") {
      return item?.["systemInfo"] === "مجاز" ? green[200] : red[200];
    }
    return "";
  };

  return (
    <Table
      data={data}
      headCells={headCells}
      wordWrap={true}
      cellColorChangeHandler={handleCellColorChange}
    />
  );
};

export default ProductCatalogue;
