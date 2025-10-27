//کارشناس بازرگانی -> ثبت اولیه - سفارش
import OrderRegShowHeader from "./OrderRegShowHeader";
import EditIcon from "../../assets/images/GrayThem/edit_gray16.png";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import TaxIcon from "../../assets/images/GrayThem/Tax24.png";
import { FaCheck } from "react-icons/fa";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useEffect, useState } from "react";
import OrderRegShowTable from "./OrderRegShowTable";
import { useOrderStore } from "../../store/orderStore";
import { useOrders } from "../../hooks/useOrders";
import { DefaultOptionType, TableColumns } from "../../types/general";
import { DtlsItem, InOutsItem, orderRegRequest } from "../../types/order";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
  parsePersianNumerals,
} from "../../utilities/general";
import OrderRegShowFooter from "./OrderRegShowFooter";
import { useAuthStore } from "../../store/authStore";
import ModalForm from "../layout/ModalForm";
import ModalMessage from "../layout/ModalMessage";
import ShowMessages from "../controls/ShowMessages";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import OrderRegShowMobileTable from "./OrderRegShowMobileTable";
import OrderEdit from "./OrderEdit";
import OrderCupboardList from "./OrderCupboardList";
import { useWarehouse } from "../../hooks/useWarehouse";
import { useProducts } from "../../hooks/useProducts";
import ProductOfferFormListHistory from "../productOffer/ProductOfferFormListHistory";
import { useProductOfferStore } from "../../store/productOfferStore";
import { useProductOffer } from "../../hooks/useProductOffer";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrderRegShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const canEditForm1Mst1 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Mst1;
  const [cash1, setCash1] = useState(false);
  const [byPhone, setByPhone] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const [dsc, setDsc] = useState("");
  const [footerDescTxt, setFooterDescTxt] = useState("");
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const [baseData, setBaseData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]); //data for OrderCupboardList
  const [product, setProduct] = useState<DefaultOptionType | null>(null);
  const [cnt, setCnt] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const { setField: setOrderField } = useOrderStore();
  const {
    orderRegShowResponse,
    isLoadingOrderRegShow,
    isLoadingOrderReg,
    orderSalesPricesResponse,
    isLoadingOrderSalesPrices,

    orderCupListResponse,
    isLoadingOrderCupList,
    orderReg,
    orderRegResponse,
    refetchOrderRegShow,
  } = useOrders();

  const { orderId } = useOrderStore();
  const { setField: setOrderCupListField } = useOrderStore();
  const [warehouse, setWarehouse] = useState<DefaultOptionType | null>(null);
  const { authApiResponse } = useAuthStore();
  const usrId = authApiResponse?.data?.result?.login?.usrId ?? 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesPrice, setSalesPrice] = useState<DefaultOptionType | null>(null);
  const [editClicked1, setEditClicked1] = useState(false);
  const [editClicked2, setEditClicked2] = useState(false);
  const [otId, setOtId] = useState<number>(0);
  const [checkSum, setCheckSum] = useState<number>(0);
  //for showing  سوابق آفر
  const [showHistory, setShowHistory] = useState(false);
  const { setField: setProductOfferDtlHistoryField } = useProductOfferStore();
  const { productOfferDtlHistory, isLoadingProductOfferDtlHistory } =
    useProductOffer();
  const columns: TableColumns = [
    {
      Header: "اطلاعات سفارش",
      width: "44%",
      columns: [
        {
          Header: "ردیف",
          accessor: "index",
          width: "3%",
        },
        {
          Header: "کالا",
          accessor: "pName",
          width: "19%",
        },
        {
          Header: "قیمت",
          accessor: "cost",
          width: "5%",
        },
        {
          Header: "تخفیف",
          accessor: "dcrmnt",
          width: "5%",
        },
        {
          Header: "تعداد",
          accessor: "cnt",
          width: "5%",
        },
        {
          Header: "آفر",
          accessor: "oCnt",
          width: "5%",
        },
        {
          Header: " ",
          accessor: "editIcon1",
          width: "2%",
        },
      ],
    },

    {
      Header: "کنترل",
      width: "14%",
      backgroundColor: colors.orang100,
      columns: [
        {
          Header: "نیاز به مجوز",
          accessor: "needPerm",
          width: "2%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "سقف آفر",
          accessor: "offerNo",
          width: "5%",
          backgroundColor: colors.orang100,
        },
        {
          Header: "موجودی پخش",
          accessor: "stock",
          width: "4%",
          backgroundColor: colors.orang100,
        },
        {
          Header: " ",
          accessor: "historyIcon",
          width: "3%",
          backgroundColor: colors.orang100,
          Cell: ({ row }: any) => {
            return (
              <div className="flex w-full">
                <img
                  src={HistoryIcon}
                  onClick={() => handleShowHistory(row)}
                  className="cursor-pointer"
                  alt="HistoryIcon"
                />
              </div>
            );
          },
        },
      ],
    },

    {
      Header: "اطلاعات ثبت",
      width: "42%",
      backgroundColor: colors.indigo50,
      columns: [
        {
          Header: "بچ",
          accessor: "cupCode",
          width: "5%",
          backgroundColor: colors.indigo50,
          except: true,
        },
        {
          Header: "انقضا",
          accessor: "cupEDate",
          width: "5%",
          backgroundColor: colors.indigo50,
          except: true,
        },
        {
          Header: "تعداد",
          accessor: "cupCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
          except: true,
        },
        {
          Header: "آفر",
          accessor: "cupOCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
          except: true,
        },
        {
          Header: " ",
          accessor: "editIcon2",
          width: "2%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "تعداد",
          accessor: "rCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "آفر",
          accessor: "roCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "قیمت",
          accessor: "salePrice",
          width: "8%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: " ",
          accessor: "historyIcon2",
          width: "2%",
          backgroundColor: colors.indigo50,
        },
      ],
    },
  ];
  ////////////////////////////////////////////////////////
  const handleShowHistory = (row: any) => {
    if (row.original.pId !== 0) {
      setProductOfferDtlHistoryField("pId", row.original.pId);
      setShowHistory(true);
    }
  };
  //////////////////////////////////////////////////////////////
  const handleEditClick1 = (dtl: any) => {
    setEditClicked1(true);
    console.log(dtl, "first");
  };
  const handleEditClick2 = (dtl: any) => {
    //console.log(warehouse,dtl.otId,dtl,"warehouse?.id, dtl.otId in order reg show table");
    setCheckSum(dtl.rCnt + dtl.roCnt);
    setOtId(dtl.otId); // select a row in orderRegShowTable
    setEditClicked2(true);
    //console.log(dtl, "second");
  };
  ////////////////////////////////////////////////////////////////////////
  const handleEditClickClose1 = () => {
    setEditClicked1(false);
  };
  ////////////////////////////////////////////////////////////////////////
  const handleEditClickClose2 = () => {
    setEditClicked2(false);
    setOtId(0);
  };
  ////////////////////////////////////////////////////////////////////////
  // refetch orderRegShow if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchOrderRegShow();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log(workFlowRowSelectResponse?.workTableRow.formId);
    setOrderField("orderId", workFlowRowSelectResponse?.workTableRow.formId);
  }, [workFlowRowSelectResponse?.workTableRow.formId]);
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    if (editClicked2) {
      setOrderCupListField("OrderDtlId", otId);
      setOrderCupListField("WarehauseId", warehouse?.id ?? 0);
    }
  }, [editClicked2, otId, warehouse]);
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
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    setSalesPrice({
      id: orderRegShowResponse.data.result.defaultPriceId,
      title: convertToFarsiDigits(orderRegShowResponse.data.result.priceTitle),
    });
    setWarehouse({
      id: orderRegShowResponse.data.result.defaultWarehouseId,
      title: convertToFarsiDigits(
        orderRegShowResponse.data.result.warehouseName
      ),
    });
  }, [orderRegShowResponse]);
  //////////////////////////////////////////////////////////////////
  //for initializing data for OrderCupboardList
  useEffect(() => {
    if (
      otId === 0 ||
      orderCupListResponse.data.result.orderCupLists.length === 0
    ) {
      return;
    }
    const cupData = processedData.find((item: any) => item.otId === otId);
    const cupCnt = parsePersianNumerals(cupData?.cupCnt);
    const cupOCnt = parsePersianNumerals(cupData?.cupOCnt);
    setData(
      orderCupListResponse.data.result.orderCupLists.map((item, idx) => ({
        ...item,
        index: convertToFarsiDigits(idx + 1),
        iocId: item.iocId,
        fCode: convertToFarsiDigits(item.fCode),
        fDate: convertToFarsiDigits(item.fDate),
        cCode: convertToFarsiDigits(item.cCode),
        eDate: convertToFarsiDigits(item.eDate),
        cAmnt: convertToFarsiDigits(item.cAmnt), // Keep as number for type compatibility
        //for register
        cnt: cupCnt[idx] || 0,
        oCnt: cupOCnt[idx] || 0,
      }))
    );
  }, [orderCupListResponse]);
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log(salesPrice, "salesPrice in order reg show table useEffect");
    const tempData = orderRegShowResponse.data.result.orderDtls.map(
      (item, index) => ({
        index: convertToFarsiDigits(index + 1),
        pId: item.pId,
        pName: convertToFarsiDigits(item.pName),
        cost: convertToFarsiDigits(formatNumberWithCommas(item.cost)),
        dcrmnt: convertToFarsiDigits(item.dcrmnt),
        cnt: convertToFarsiDigits(item.cnt),
        oCnt: convertToFarsiDigits(item.oCnt),
        editIcon1: item.rEdt ? (
          <img
            src={EditIcon}
            onClick={() => handleEditClick1(item)}
            className="cursor-pointer"
            alt="edit1"
          />
        ) : null,
        needPerm: item.needPerm ? <FaCheck className="text-green-500" /> : null,
        offerNo: convertToFarsiDigits(item.offerNo),
        stock: convertToFarsiDigits(item.stock),
        historyIcon: (
          <div className="flex justify-center items-center cursor-pointer">
            <img src={HistoryIcon} alt="history" />
            {item.tax > 0 ? <img src={TaxIcon} alt="tax" /> : null}
          </div>
        ),
        cupId: item.cups
          .map((cup) => {
            return convertToFarsiDigits(cup.id);
          })
          .join("\n"),
        cupCode: item.cups
          .map((cup) => {
            return convertToFarsiDigits(cup.code);
          })
          .join("\n"),
        cupEDate: item.cups
          .map((cup) => {
            return convertToFarsiDigits(cup.eDate);
          })
          .join("\n"),
        cupCnt: item.cups
          .map((cup) => {
            return convertToFarsiDigits(cup.cnt);
          })
          .join("\n"),
        cupOCnt: item.cups
          .map((cup) => {
            return convertToFarsiDigits(cup.oCnt);
          })
          .join("\n"),
        editIcon2: item.rEdt ? (
          <img
            src={EditIcon}
            onClick={() => handleEditClick2(item)}
            alt="edit2"
          />
        ) : null,
        rCnt: convertToFarsiDigits(item.rCnt),
        roCnt: convertToFarsiDigits(item.roCnt),
        salePrice: convertToFarsiDigits(formatNumberWithCommas(item.salePrice)),
        historyIcon2: (
          <img src={HistoryIcon} className="cursor-pointer" alt="report" />
        ),
        otId: item.otId,
      })
    );
    setBaseData(tempData);
  }, [orderRegShowResponse]);
  useEffect(() => {
    if (isLoadingOrderSalesPrices) {
      return;
    }
    const updatedData = baseData.map((item) => {
      if (salesPrice?.id !== 0 && salesPrice !== null) {
        const newSalePrice =
          orderSalesPricesResponse?.data?.result?.orderSalesPrices?.find(
            (b) => b.id === item.otId
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

    //console.log(updatedData,"updatedData in order reg show table");
    setProcessedData(updatedData);
  }, [salesPrice, orderRegShowResponse, isLoadingOrderSalesPrices]);
  //////////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let request: orderRegRequest;
    let dtls: DtlsItem[] = [];
    let inOuts: InOutsItem[] = [];

    processedData.map((item) => {
      dtls.push({
        id: item.otId,
        cnt: Number(convertToLatinDigits(item.cnt)),
        oCnt: Number(convertToLatinDigits(item.oCnt)),
        cost: convertToLatinDigits(item.cost),
      });
      //console.log(item);
      const cupCnt = parsePersianNumerals(item.cupCnt);
      const cupOCnt = parsePersianNumerals(item.cupOCnt);
      const cupIds = parsePersianNumerals(item.cupId);
      for (let i = 0; i < cupCnt.length; i++) {
        if (cupCnt[i] > 0) {
          inOuts.push({
            id: cupIds[i],
            otId: item.otId,
            cnt: cupCnt[i],
            oCnt: cupOCnt[i],
          });
        }
      }
    });

    request = {
      usrId,
      orderId,
      cash: cash1,
      byPhone,
      urgency,
      footerDescTxt,
      dsc,
      dtls,
      inOuts,
      autoRegistered: true,
    };

    try {
      console.log(request);
      await orderReg(request);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const { width } = useCalculateTableHeight();

  const [salesPriceSearch, setSalesPriceSearch] = useState<string>("");
  const [warehouseSearch, setWarehouseSearch] = useState<string>("");
  const { setField: setSalesPriceField, setField: setWarehouseField } =
    useOrderStore();
  const { salesPricesSearchResponse } = useProducts();
  const { warehouseSearchResponse } = useWarehouse();
  useEffect(() => {
    setSalesPriceField("salesPricesSearch", salesPriceSearch);
    setSalesPriceField("salesPricesSearchPage", 1);
    setSalesPriceField("lastId", 0);
  }, [salesPriceSearch]);

  useEffect(() => {
    //console.log(convertToLatinDigits(warehouseSearch),"warehouseSearch");
    setWarehouseField(
      "search",
      convertToLatinDigits(warehouseSearch) ? null : "ا"
    );
    setWarehouseField("page", 1);
    setWarehouseField("pageSize", 30);
    setWarehouseField("lastId", 0);
    setWarehouseField("CustomerTypeId", -1);
    setWarehouseField("PartKey", 0);
  }, [warehouseSearch]);
  //change order sales price
  const changeSalesPrice = (newValue: DefaultOptionType) => {
    //console.log(newValue);
    setSalesPriceField(
      "orderIdForSalesPrice",
      orderRegShowResponse.data.result.orderMst.id
    );
    setSalesPriceField("salesPriceId", newValue.id);
    setSalesPrice(newValue);
    setSalesPriceSearch(newValue.title);
  };
  //change warehouse
  const changeWarehouse = (newValue: DefaultOptionType) => {
    //console.log(newValue);
    setWarehouse(newValue);
    setWarehouseSearch(newValue?.title ?? "ا");
  };

  return (
    <div className="w-full flex flex-col">
      <OrderRegShowHeader
        orderRegShowResponse={orderRegShowResponse}
        cash1={cash1}
        setCash1={setCash1}
        byPhone={byPhone}
        setByPhone={setByPhone}
        urgency={urgency}
        setUrgency={setUrgency}
        customer={customer}
        setCustomer={setCustomer}
        salesPrice={salesPrice}
        warehouse={warehouse}
        setSalesPriceSearch={setSalesPriceSearch}
        setWarehouseSearch={setWarehouseSearch}
        canEditForm1Mst1={canEditForm1Mst1}
        salesPricesSearchResponse={salesPricesSearchResponse}
        warehouseSearchResponse={warehouseSearchResponse}
        changeSalesPrice={changeSalesPrice}
        changeWarehouse={changeWarehouse}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      {width > 640 ? (
        <OrderRegShowTable
          processedData={processedData}
          isLoadingOrderRegShow={isLoadingOrderRegShow}
          warehouse={warehouse}
          salesPrice={salesPrice}
          columns={columns}
          setSalesPriceSearch={setSalesPriceSearch}
          setWarehouseSearch={setWarehouseSearch}
          changeSalesPrice={changeSalesPrice}
          changeWarehouse={changeWarehouse}
          salesPricesSearchResponse={salesPricesSearchResponse}
          warehouseSearchResponse={warehouseSearchResponse}
        />
      ) : (
        <OrderRegShowMobileTable
          processedData={processedData}
          columns={columns}
          salesPrice={salesPrice}
        />
      )}
      <OrderRegShowFooter
        isLoadingOrderReg={isLoadingOrderReg}
        dsc={dsc}
        setDsc={setDsc}
        footerDescTxt={footerDescTxt}
        setFooterDescTxt={setFooterDescTxt}
        handleSubmit={handleSubmit}
      />
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor={
          orderRegResponse?.meta?.errorCode === -1
            ? "bg-green-200"
            : "bg-red-200"
        }
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={orderRegResponse?.meta?.message || ""}
        visibleButton={false}
      />
      {/*open ShowMessages if تایید is clicked with errors*/}
      {orderRegResponse.data.result.dtlErrMsgs.length > 0 && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="پیام ها"
          width="1/2"
        >
          <ShowMessages
            dtlErrMsgs={orderRegResponse.data.result.dtlErrMsgs}
            color={colors.red100}
            heightWindow={300}
          />
        </ModalForm>
      )}
      {/*open order edit if editIcon is clicked*/}
      <ModalForm
        isOpen={editClicked1}
        onClose={handleEditClickClose1}
        title="ویرایش سفارش"
        width="1/2"
      >
        <OrderEdit
          product={product}
          setProduct={setProduct}
          cnt={cnt}
          setCnt={setCnt}
          cost={cost}
          setCost={setCost}
        />
      </ModalForm>
      {/*open order cup list if editIcon is clicked*/}
      <ModalForm
        isOpen={editClicked2}
        onClose={handleEditClickClose2}
        title="لیست قفسه ها"
        width="1/2"
      >
        <OrderCupboardList
          orderCupListResponse={orderCupListResponse}
          isLoadingOrderCupList={isLoadingOrderCupList}
          orderDtlId={otId}
          checkSum={checkSum}
          processedData={processedData} // data for orderRegShowTable
          setProcessedData={setProcessedData}
          setBaseData={setBaseData}
          handleOrderCupboardListClose={handleEditClickClose2}
          data={data} //data for OrderCupboardList
          setData={setData}
        />
      </ModalForm>
      {/* open سوابق آفر */}
      <ProductOfferFormListHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtlHistoryLoading={isLoadingProductOfferDtlHistory}
        productOfferDtlHistory={productOfferDtlHistory || []}
      />
    </div>
  );
};

export default OrderRegShow;
