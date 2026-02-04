///api/Delivery/1113081
interface DeliveryMst {
    id: number;
    formId: number;
    code: string;
    dat: string;
    tim: string;
    cId: number;
    srName: string;
    gln: string;
    blackList: boolean;
    exp: string;
    guid: string;
    status: number;
    msg: string;
  }
  
  interface DeliveryDtl {
    id: number;
    iocId: number;
    pCode: string;
    pName: string;
    cnt: number;
    cost: number;
    hasUID: boolean;
    uid: string;
    statusCode: number;
    code: string;
    expire: string;
  }
  
  interface ResultDeliveryShow {
    err: number;
    msg: string;
    wId: number;
    wName: string;
    deliveryMst: DeliveryMst;
    deliveryDtls: DeliveryDtl[];
  }
  
  interface DataDeliveryShow {
    result: ResultDeliveryShow;
  }
  
  interface DeliveryShowResponse {
    meta: Meta;
    data: DataDeliveryShow;
  }

  export interface DeliveryState extends DeliveryShowResponse{
    id:number // for Delivery/:id
    deliveryShowResponse:DeliveryShowResponse //for Delivery/:id
    setField: (field: string | number | symbol, value: any) => void;
    setDeliveryShowResponse:(deliveryShowResponse:DeliveryShowResponse) =>void // for Delivery/:id
}