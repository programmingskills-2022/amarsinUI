import {
  DtlsItem,
  InOutsItem,
  OrderCupListTbl,
  orderRegRequest,
  OrderRegShowResponse,
  OrderSalesPricesResponse,
} from "../../types/order";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
  parsePersianNumerals,
} from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import OrderRegShowTableHeader from "./OrderRegShowTableHeader";
import { colors } from "../../utilities/color";
import { useEffect, useState } from "react";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import EditIcon from "../../assets/images/GrayThem/edit_gray16.png";
import TaxIcon from "../../assets/images/GrayThem/Tax24.png";
import { Check } from "@mui/icons-material";
import ModalForm from "../layout/ModalForm";
import OrderEdit from "./OrderEdit";
import OrderCupboardList from "./OrderCupboardList";
import { useOrderStore } from "../../store/orderStore";
import { useOrders } from "../../hooks/useOrders";
import OrderRegShowFooter from "./OrderRegShowFooter";
import { useAuthStore } from "../../store/authStore";
import ModalMessage from "../layout/ModalMessage";
import ShowMessages from "../controls/ShowMessages";

type Props = {
  orderRegShowResponse: OrderRegShowResponse;
  isLoadingOrderRegShow: boolean;
  orderSalesPricesResponse: OrderSalesPricesResponse;
  isLoadingOrderSalesPrices: boolean;
  isLoadingOrderReg: boolean;
  dsc: string;
  setDsc: (dsc: string) => void;
  footerDescTxt: string;
  setFooterDescTxt: (footerDescTxt: string) => void;
  cash1: boolean;
  byPhone: boolean;
  urgency: boolean;
};

const OrderRegShowTable = ({
  orderRegShowResponse,
  isLoadingOrderRegShow,
  orderSalesPricesResponse,
  isLoadingOrderSalesPrices,
  isLoadingOrderReg,
  dsc,
  cash1,
  byPhone,
  urgency,
  setDsc,
  footerDescTxt,
  setFooterDescTxt,
}: Props) => {
  const [editClicked1, setEditClicked1] = useState(false);
  const [editClicked2, setEditClicked2] = useState(false);
  const handleEditClickClose1 = () => {
    setEditClicked1(false);
  };
  const handleEditClickClose2 = () => {
    setEditClicked2(false);
    setOtId(0);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<DefaultOptionType | null>(null);
  const [cnt, setCnt] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [otId, setOtId] = useState<number>(0);
  const [checkSum, setCheckSum] = useState<number>(0);
  const {
    orderCupListResponse,
    isLoadingOrderCupList,
    orderReg,
    orderRegResponse,
  } = useOrders();
  const { setField: setOrderCupListField, orderId } = useOrderStore();

  const { authApiResponse } = useAuthStore();
  const usrId = authApiResponse?.data?.result?.login?.usrId ?? 0;
  const [data, setData] = useState<OrderCupListTbl[]>([]); //data for OrderCupboardList

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
          /*Cell: ({ row }: any) => (
            <img
              src={EditIcon}
              onClick={() => handleEditClick(row)}
              className="cursor-pointer"
              alt="report"
            />
          ),*/
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
          /*Cell: ({ value }: any) => (
            <img
              src={HistoryIcon}
              onClick={() => console.log(value)}
              className="cursor-pointer"
              alt="report"
            />
          ),*/
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
        },
        {
          Header: "انقضا",
          accessor: "cupEDate",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "تعداد",
          accessor: "cupCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: "آفر",
          accessor: "cupOCnt",
          width: "5%",
          backgroundColor: colors.indigo50,
        },
        {
          Header: " ",
          accessor: "editIcon2",
          width: "2%",
          backgroundColor: colors.indigo50,
          /*Cell: ({ row }: any) => (
            <img
              src={EditIcon}
              onClick={() => handleEditClick(row)}
              className="cursor-pointer"
              alt="report"
            />
          ),*/
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
          /*Cell: ({ value }: any) => (
            <img
              src={HistoryIcon}
              onClick={() => console.log(value)}
              className="cursor-pointer"
              alt="report"
            />
          ),*/
        },
      ],
    },
  ];
  const [salesPrice, setSalesPrice] = useState<DefaultOptionType | null>(null);
  const [warehouse, setWarehouse] = useState<DefaultOptionType | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [baseData, setBaseData] = useState<any[]>([]);

  //////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: number;
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
        cAmnt: item.cAmnt, // Keep as number for type compatibility
        //for register
        cnt: cupCnt[idx] || 0,
        oCnt: cupOCnt[idx] || 0,
      }))
    );
  }, [orderCupListResponse]);

  //////////////////////////////////////////////////////////////
  const handleEditClick1 = (dtl: any) => {
    setEditClicked1(true);
    console.log(dtl, "first");
  };
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    if (editClicked2) {
      setOrderCupListField("OrderDtlId", otId);
      setOrderCupListField("WarehauseId", warehouse?.id ?? 0);
    }
  }, [editClicked2, otId, warehouse]);

  const handleEditClick2 = (dtl: any) => {
    //console.log(warehouse,dtl.otId,dtl,"warehouse?.id, dtl.otId in order reg show table");
    setCheckSum(dtl.rCnt + dtl.roCnt);
    setOtId(dtl.otId); // select a row in orderRegShowTable
    setEditClicked2(true);
    //console.log(dtl, "second");
  };
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    //console.log(salesPrice, "salesPrice in order reg show table useEffect");
    const tempData = orderRegShowResponse.data.result.orderDtls.map(
      (item, index) => ({
        index: convertToFarsiDigits(index + 1),
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
        needPerm: item.needPerm ? <Check sx={{ color: "green" }} /> : null,
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
  //////////////////////////////////////////////////////////////
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
  return (
    <>
      <OrderRegShowTableHeader
        columns={columns}
        orderRegShowResponse={orderRegShowResponse}
        salesPrice={salesPrice}
        setSalesPrice={setSalesPrice}
        warehouse={warehouse}
        setWarehouse={setWarehouse}
      />
      {isLoadingOrderRegShow ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <TTable
          columns={columns}
          data={processedData}
          fontSize="0.75rem"
          changeRowSelectColor={true}
          wordWrap={true}
          showHeader={false}
        />
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
      <OrderRegShowFooter
        isLoadingOrderReg={isLoadingOrderReg}
        dsc={dsc}
        setDsc={setDsc}
        footerDescTxt={footerDescTxt}
        setFooterDescTxt={setFooterDescTxt}
        handleSubmit={handleSubmit}
      />
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
    </>
  );
};

export default OrderRegShowTable;
