import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import { colors } from "../../utilities/color";
import { useEffect, useState } from "react";
import { Check } from "@mui/icons-material";
import ModalForm from "../layout/ModalForm";
import ModalMessage from "../layout/ModalMessage";
import ShowMessages from "../controls/ShowMessages";
import ReceiptPurchaseShowFooter from "./ReceiptPurchaseShowFooter";
import ReceiptPurchaseShowTableHeader from "./ReceiptPurchaseShowTableHeader";
import {
  WarehouseTemporaryReceiptPurchaseRegResponse,
  WarehouseTemporaryReceiptPurchaseShowResponse,
  WarehouseTemporaryReceiptSalesPricesResponse,
} from "../../types/warehouse";
import ProductOfferForm from "../productOffer/ProductOfferForm";
import { useProductOffer } from "../../hooks/useProductOffer";
import { ProductOffer } from "../../types/productOffer";
import { useProductPerm } from "../../hooks/useProductPerm";
import ProductPermForm from "../productPerm/ProductPermForm";
import { ProductPerm } from "../../types/productPerm";
import { useProductGrace } from "../../hooks/useProductGrace";
import { ProductGrace } from "../../types/productGrace";
import ProductGraceForm from "../productGrace/ProductGraceForm";
import { useProductPrice } from "../../hooks/useProductPrice";
import { ProductPrice } from "../../types/productPrice";
import ProductPriceForm from "../productPrice/ProductPriceForm";
import { useWarehouseStore } from "../../store/warehouseStore";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useAuthStore } from "../../store/authStore";
import { MenuItem } from "../../types/menu";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  warehouseTemporaryReceiptPurchaseShowResponse: WarehouseTemporaryReceiptPurchaseShowResponse;
  isLoadingWarehouseTemporaryReceiptPurchaseShow: boolean;
  isLoadingWarehouseTemporaryReceiptSalesPrices: boolean;
  warehouseTemporaryReceiptSalesPricesResponse: WarehouseTemporaryReceiptSalesPricesResponse;
  isLoadingWarehouseTemporaryReceiptPurchaseReg: boolean;
  warehouseTemporaryReceiptPurchaseRegResponse: WarehouseTemporaryReceiptPurchaseRegResponse;
  definitionDateTime: DefinitionDateTime;
};

const ReceiptPurchaseShowTable = ({
  warehouseTemporaryReceiptPurchaseShowResponse,
  isLoadingWarehouseTemporaryReceiptPurchaseShow,
  isLoadingWarehouseTemporaryReceiptSalesPrices,
  warehouseTemporaryReceiptSalesPricesResponse,
  isLoadingWarehouseTemporaryReceiptPurchaseReg,
  warehouseTemporaryReceiptPurchaseRegResponse,
  definitionDateTime,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //for offer history show in ReceiptPurchaseShowTableHeader.tsx
  const {
    productOfferDtl,
    addProductList: addProductListOffer,
    productOfferDtlHistory,
    isLoadingProductOfferDtlHistory,
    productOfferSave,
    isLoadingProductOfferSave,
    isLoadingAddList,
  } = useProductOffer();
  const { setField: setWarehouseTemporaryReceiptPurchaseRegField } =
    useWarehouseStore();
  const [selectedProductOffer, setSelectedProductOffer] =
    useState<ProductOffer | null>(null);

  //for check permission offer for open history modal
  const { authApiResponse } = useAuthStore();
  const [permissionOffer, setPermissionOffer] = useState(false);
  const [permissionPerm, setPermissionPerm] = useState(false);
  const [permissionGrace, setPermissionGrace] = useState(false);
  const [permissionPrice, setPermissionPrice] = useState(false);
  //const [selectedId, setSelectedId] = useState<number>(0);
  useEffect(() => {
    const menu = authApiResponse?.data.result.menu;
    if (menu) {
      if (menu.find((item: MenuItem) => item.path === "/Admin/ProductOffer")) {
        setPermissionOffer(true);
      }
      if (menu.find((item: MenuItem) => item.path === "/Admin/ProductPerm")) {
        setPermissionPerm(true);
      }
      if (menu.find((item: MenuItem) => item.path === "/Admin/ProductGrace")) {
        setPermissionGrace(true);
      }
      if (menu.find((item: MenuItem) => item.path === "/Admin/ProductPrice")) {
        setPermissionPrice(true);
      }
    }
  }, [authApiResponse]);

  // for perm history show in ReceiptPurchaseShowTableHeader.tsx
  const {
    productPermDtl,
    addProductList: addProductListPerm,
    productPermDtlHistory,
    isLoadingDtlHistory,
    productPermSave,
    isLoadingProductPermSave,
  } = useProductPerm();
  const [selectedProductPerm, setSelectedProductPerm] =
    useState<ProductPerm | null>(null);
  // for grace history show in ReceiptPurchaseShowTableHeader.tsx
  const {
    productGraceDtl,
    addProductList: addProductListGrace,
    productGraceDtlHistory,
    isLoadingDtlHistory: isLoadingDtlHistoryGrace,
    productGraceSave,
    isLoadingProductGraceSave,
  } = useProductGrace();
  const [selectedProductGrace, setSelectedProductGrace] =
    useState<ProductGrace | null>(null);
  // for price history show in ReceiptPurchaseShowTableHeader.tsx
  const {
    productPriceDtl,
    addProductList: addProductListPrice,
    productPriceDtlHistory,
    isLoadingDtlHistory: isLoadingDtlHistoryPrice,
    productPriceSave,
    isLoadingProductPriceSave,
  } = useProductPrice();
  const [selectedProductPrice, setSelectedProductPrice] =
    useState<ProductPrice | null>(null);

  const columns: TableColumns = [
    {
      Header: "اطلاعات رسید موقت",
      width: "34%",
      columns: [
        {
          Header: "ردیف",
          accessor: "index",
          width: "3%",
        },
        {
          Header: "کد",
          accessor: "pCode",
          width: "5%",
        },
        {
          Header: "کالا",
          accessor: "pName",
          width: "16%",
        },
        {
          Header: "تعداد",
          accessor: "cnt",
          width: "5%",
        },
        {
          Header: "مصرف کننده",
          accessor: "consumerPrice",
          width: "5%",
        },
      ],
    },

    {
      Header: "کنترل",
      width: "21%",
      backgroundColor: colors.orang100,
      columns: [
        {
          Header: "موجودی",
          accessor: "stock",
          width: "7%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "سقف آفر",
          accessor: "pOffer",
          width: "4%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "مالیات",
          accessor: "tax",
          width: "3%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "مجوز",
          accessor: "permImage",
          width: "4%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "فرجه",
          accessor: "graceDays",
          width: "3%",
          backgroundColor: colors.orang100,
        },
      ],
    },
    {
      Header: "پورسانت",
      width: "6%",
      backgroundColor: colors.orang100,
      columns: [
        {
          Header: "فروش",
          accessor: "sC",
          width: "3%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "وصول",
          accessor: "cC",
          width: "3%",
          backgroundColor: colors.orang100,
        },
      ],
    },
    {
      Header: "اطلاعات ثبت",
      width: "16%",
      backgroundColor: colors.indigo50,
      columns: [
        {
          Header: "تعداد",
          accessor: "regCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "آفر",
          accessor: "regOffer",
          width: "3%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "قیمت",
          accessor: "salePrice",
          width: "8%",
          backgroundColor: colors.indigo50,
        },
      ],
    },
    {
      Header: "رسید انبار",
      width: "10%",
      backgroundColor: colors.green50,
      columns: [
        {
          Header: "تعداد",
          accessor: "rCnt",
          width: "5%",
          backgroundColor: colors.green50,
        },
        {
          Header: "مبلغ",
          accessor: "rCost",
          width: "5%",
          backgroundColor: colors.green50,
        },
      ],
    },
    {
      Header: "فاکتور خرید",
      width: "13%",
      backgroundColor: colors.green50,
      columns: [
        {
          Header: "تعداد",
          accessor: "tCnt",
          width: "5%",
          backgroundColor: colors.green50,
        },
        {
          Header: "آفر",
          accessor: "tOffer",
          width: "3%",
          backgroundColor: colors.green50,
        },
        {
          Header: "مبلغ",
          accessor: "tCost",
          width: "5%",
          backgroundColor: colors.green50,
        },
      ],
    },
  ];
  const [salesPrice, setSalesPrice] = useState<DefaultOptionType | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [baseData, setBaseData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in orderRegShowTable table

  //for history show in ReceiptPurchaseShowTableHeader.tsx
  const [isNewOffer, setIsNewOffer] = useState<boolean>(false);
  const [isNewPerm, setIsNewPerm] = useState<boolean>(false);
  const [isNewGrace, setIsNewGrace] = useState<boolean>(false);
  const [isNewPrice, setIsNewPrice] = useState<boolean>(false);
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
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log(salesPrice, "salesPrice in order reg show table useEffect");
    const tempData =
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.warehouseTemporaryReceiptPurchaseDtls.map(
        (item, index) => ({
          index: convertToFarsiDigits(index + 1),
          pCode: convertToFarsiDigits(item.pCode),
          pName: convertToFarsiDigits(item.pName),
          cnt: convertToFarsiDigits(item.cnt),
          consumerPrice: convertToFarsiDigits(item.consumerPrice),
          stock: convertToFarsiDigits(item.stock),
          pOffer: convertToFarsiDigits(item.pOffer),
          tax: "%" + convertToFarsiDigits(item.tax),
          perm: item.perm,
          permImage: item.perm ? <Check sx={{ color: "green" }} /> : null,
          graceDays:
            item.graceDays > 0 ? convertToFarsiDigits(item.graceDays) : null,
          regCnt: convertToFarsiDigits(item.regCnt),
          regOffer: convertToFarsiDigits(item.regOffer),
          tCost: convertToFarsiDigits(formatNumberWithCommas(item.tCost)),
          rCnt: convertToFarsiDigits(item.rCnt),
          rCost: convertToFarsiDigits(formatNumberWithCommas(item.rCost)),
          tCnt: convertToFarsiDigits(item.tCnt),
          tOffer: convertToFarsiDigits(item.tOffer),
          salePrice: convertToFarsiDigits(0),
          iocId: item.iocId,
          sC: item.sC===-1 ? null : convertToFarsiDigits(item.sC),
          cC: item.cC===-1 ? null : convertToFarsiDigits(item.cC),
        })
      );
    setBaseData(tempData);
  }, [
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
      .warehouseTemporaryReceiptPurchaseDtls,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    if (permissionOffer) {
      setSelectedProductOffer(null);
    }
    if (permissionPerm) {
      setSelectedProductPerm(null);
    }
    if (permissionGrace) {
      setSelectedProductGrace(null);
    }
    if (permissionPrice) {
      setSelectedProductPrice(null);
    }
  }, [permissionOffer, permissionPerm, permissionGrace, permissionPrice]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    if (isLoadingWarehouseTemporaryReceiptSalesPrices) {
      return;
    }
    const updatedData = baseData.map((item) => {
      if (salesPrice?.id !== 0 && salesPrice !== null) {
        const newSalePrice =
          warehouseTemporaryReceiptSalesPricesResponse?.data?.result?.salesPrices?.find(
            (b) => b.id === item.iocId
          );
        if (newSalePrice) {
          return {
            ...item,
            salePrice: convertToFarsiDigits(
              formatNumberWithCommas(newSalePrice.price)
            ),
          };
        }
      }
      return item; // Always return the item, even if no newSalePrice is found
    });

    setProcessedData(updatedData);
  }, [
    salesPrice,
    warehouseTemporaryReceiptSalesPricesResponse,
    isLoadingWarehouseTemporaryReceiptSalesPrices,
  ]);
  //////////////////////////////////////////////////////////////
  const handleSubmit = () => {
    setWarehouseTemporaryReceiptPurchaseRegField(
      "idReg",
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
        .warehouseTemporaryReceiptMst.id
    );
    setWarehouseTemporaryReceiptPurchaseRegField(
      "salesPriceIdReg",
      salesPrice?.id ?? 0
    );
    setIsModalOpen(true);
  };

  return (
    <>
      <ReceiptPurchaseShowTableHeader
        columns={columns}
        warehouseTemporaryReceiptPurchaseShowResponse={
          warehouseTemporaryReceiptPurchaseShowResponse
        }
        salesPrice={salesPrice}
        setSalesPrice={setSalesPrice}
        setIsNewOffer={setIsNewOffer}
        setIsNewPerm={setIsNewPerm}
        setIsNewGrace={setIsNewGrace}
        setIsNewPrice={setIsNewPrice}
        permissionOffer={permissionOffer}
        permissionPerm={permissionPerm}
        permissionGrace={permissionGrace}
        permissionPrice={permissionPrice}
      />
      {isLoadingWarehouseTemporaryReceiptPurchaseShow ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <>
          <TTable
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            data={processedData}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            showHeader={false}
            //CellColorChange={handleCellColorChange}
          />
        </>
      )}

      <ReceiptPurchaseShowFooter
        isLoadingWarehouseTemporaryReceiptPurchaseReg={
          isLoadingWarehouseTemporaryReceiptPurchaseReg
        }
        handleSubmit={handleSubmit}
      />

      <ModalForm
        isOpen={isNewOffer && permissionOffer}
        onClose={() => {
          setIsNewOffer(false);
        }}
        title="آفرهای کالا"
        width="1"
      >
        <ProductOfferForm
          addProductList={addProductListOffer}
          productOfferDtlHistory={productOfferDtlHistory || []}
          isLoadingProductOfferDtlHistory={isLoadingProductOfferDtlHistory}
          productOfferSave={productOfferSave}
          isLoadingProductOfferSave={isLoadingProductOfferSave}
          selectedProductOffer={selectedProductOffer} //for check if selectedProductOffer.flwId===0 new else edit && sending selectedProductOffer.id in edit
          productOfferDtls={productOfferDtl}
          isNew={isNewOffer} //for check if isNew new else edit
          setIsNew={setIsNewOffer}
          setIsEdit={() => false}
          fromWorkFlow={false}
          canEditForm1={true}
          selectedId={0}
          definitionDateTime={definitionDateTime}
          isLoadingAddList={isLoadingAddList}
        />
      </ModalForm>
      <ModalForm
        isOpen={isNewPerm && permissionPerm}
        onClose={() => {
          setIsNewPerm(false);
        }}
        title="نیاز به مجوز"
        width="1"
      >
        <ProductPermForm
          addProductList={addProductListPerm}
          productPermDtlHistory={productPermDtlHistory || []}
          isLoadingDtlHistory={isLoadingDtlHistory}
          productPermSave={productPermSave}
          isLoadingProductPermSave={isLoadingProductPermSave}
          selectedProductPerm={selectedProductPerm} //for check if selectedProductPerm.flwId===0 new else edit && sending selectedProductPerm.id in edit
          productPermDtls={productPermDtl}
          isNew={isNewPerm} //for check if isNew new else edit
          setIsNew={setIsNewPerm}
          setIsEdit={() => false}
          fromWorkFlow={false} //for not going to editting in product perm form as default
          canEditForm1={true}
          selectedId={0}
          definitionDateTime={definitionDateTime}
        />
      </ModalForm>

      <ModalForm
        isOpen={isNewGrace && permissionGrace}
        onClose={() => {
          setIsNewGrace(false);
        }}
        title="فرجه"
        width="1"
      >
        <ProductGraceForm
          addProductList={addProductListGrace}
          productGraceDtlHistory={productGraceDtlHistory || []}
          isLoadingDtlHistory={isLoadingDtlHistoryGrace}
          productGraceSave={productGraceSave}
          isLoadingProductGraceSave={isLoadingProductGraceSave}
          selectedProductGrace={selectedProductGrace} //for check if selectedProductGrace.flwId===0 new else edit && sending selectedProductGrace.id in edit
          productGraceDtls={productGraceDtl}
          isNew={isNewGrace} //for check if isNew new else edit
          setIsNew={setIsNewGrace}
          setIsEdit={() => false}
          fromWorkFlow={false} //for not going to editting in product grace form as default
          canEditForm1={true}
          selectedId={0}
          definitionDateTime={definitionDateTime}
        />
      </ModalForm>

      <ModalForm
        isOpen={isNewPrice && permissionPrice}
        onClose={() => {
          setIsNewPrice(false);
        }}
        title="قیمت های کالا"
        width="1"
      >
        <ProductPriceForm
          addProductList={addProductListPrice}
          productPriceDtlHistory={productPriceDtlHistory || []}
          isLoadingDtlHistory={isLoadingDtlHistoryPrice}
          productPriceSave={productPriceSave}
          isLoadingProductPriceSave={isLoadingProductPriceSave}
          selectedProductPrice={selectedProductPrice} //for check if selectedProductPrice.flwId===0 new else edit && sending selectedProductPrice.id in edit
          productPriceDtls={productPriceDtl}
          isNew={isNewPrice} //for check if isNew new else edit
          isEdit={false}
          setIsNew={setIsNewPrice}
          setIsEdit={() => false}
          fromWorkFlow={false}
          canEditForm1={true}
          selectedId={0}
          definitionDateTime={definitionDateTime}
        />
      </ModalForm>
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor={
          warehouseTemporaryReceiptPurchaseRegResponse?.meta?.errorCode === -1
            ? "bg-green-200"
            : "bg-red-200"
        }
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={
          warehouseTemporaryReceiptPurchaseRegResponse?.meta?.message || ""
        }
        visibleButton={false}
      />
      {warehouseTemporaryReceiptPurchaseRegResponse.data.result.dtlErrMsgs
        .length > 0 && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="پیام ها"
          width="1/2"
          isCloseable={true}
        >
          <ShowMessages
            dtlErrMsgs={
              warehouseTemporaryReceiptPurchaseRegResponse.data.result
                .dtlErrMsgs
            }
            color={colors.red100}
            heightWindow={300}
          />
        </ModalForm>
      )}
    </>
  );
};

export default ReceiptPurchaseShowTable;
