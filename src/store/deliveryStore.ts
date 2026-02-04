import { create } from "zustand";
import { DeliveryState } from "../types/delivery";
export const useDeliveryStore = create<DeliveryState>()((set) => ({
  //Delivery/:id
  id: -1,
  meta: { errorCode: 0, message: null, type: "" },
  data: {
    result: {
      err: 0,
      msg: "",
      wId: 0,
      wName: "",
      deliveryMst: {
        id: 0,
        formId: 0,
        code: "",
        dat: "",
        tim: "",
        cId: 0,
        srName: "",
        gln: "",
        blackList: false,
        exp: "",
        guid: "",
        status: 0,
        msg: "",
      },
      deliveryDtls: [],
    },
  },
  deliveryShowResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        wId: 0,
        wName: "",
        deliveryMst: {
          id: 0,
          formId: 0,
          code: "",
          dat: "",
          tim: "",
          cId: 0,
          srName: "",
          gln: "",
          blackList: false,
          exp: "",
          guid: "",
          status: 0,
          msg: "",
        },
        deliveryDtls: [],
      },
    },
  },
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setDeliveryShowResponse: (deliveryShowResponse) =>
    set({ deliveryShowResponse }),
}));
