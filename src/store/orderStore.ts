import { create } from "zustand";
import { OrderState } from "../types/order";
export const useOrderStore = create<OrderState>()((set) => ({
  orderId: -1,
  orderIdForSalesPrice:-1,
  orderRegShowResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        defaultWarehouseId: 0,
        warehouseName: "",
        defaultPriceId: 0,
        priceTitle: "",
        orderMst: {
          id: 0,
          dat: "",
          tim: "",
          cId: 0,
          srName: "",
          blackList: false,
          exp: "",
          footerDescTxt: "",
          dsc: "",
          cash: false,
          customerDcrmntPrcnt: 0,
          byPhone: false,
          urgency: false,
        },
        orderDtls: [],
      },
    },
  },
  orderRegResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        id: 0,
        err: 0,
        msg: "",
        dtlErrMsgs: [],
      },
    },
  },
  salesPriceId: -1,
  orderSalesPricesResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        orderSalesPrices: [],
      },
    },
  },
  //for Order/orderCupList
  orderCupListResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        orderCupLists: [],
      },
    },
  },
  OrderDtlId: -1,
  OrderDtlIdTrigger: 0,
  WarehauseId: -1,
  //end for Order/orderCupList
  // for api/Order/DtlUpdate
  dtlUpdateResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: { result: 0 },
  },
  setDtlUpdateResponse: (dtlUpdateResponse) => set({ dtlUpdateResponse }), //for api/Order/DtlUpdate
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setOrderRegShowResponse: (orderRegShowResponse) =>
    set({ orderRegShowResponse }),
  setOrderRegResponse: (orderRegResponse) => set({ orderRegResponse }),
  setOrderSalesPricesResponse: (orderSalesPricesResponse) =>
    set({ orderSalesPricesResponse }),
  setOrderCupListResponse: (orderCupListResponse) =>
    set({ orderCupListResponse }),
}));
