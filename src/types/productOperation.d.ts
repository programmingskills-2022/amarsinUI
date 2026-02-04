export interface ProductOperationRequest {
    id: number;
    state: number;
    regFDate: string;
    regTDate: string;
    fDate: string;
    tDate: string;
    pageNumber:number;
    srchId:number;
    srchDate:string;
    srchTime:string;
    srchDsc:string;
    //srchAccepted:number;
    //sortAccepted:number;
    srchUsrName:string;
    srchStep:string;
    sortId:number;
    sortDat:number;
    sortTime:number;
    sortDsc:number;
    sortUsrName:number;
    sortStep:number; 
  
  }

  export interface ProductOperationRequest2 {
    id: number;
    state: number;
    regFDate: string;
    regTDate: string;
    fDate: string;
    tDate: string;

  }

  export interface ProductOperation {
    id: number;
    ordr: number;
    dat: string;
    tim: string;
    dsc: string;
    accepted: boolean;
    usrName: string;
    flwId: number;
    flowMapName: string;
  }

  export interface SaveRequest {
    chartId: number;
    id: number;
    dat: string;
    tim: string;
    dsc: string;
    saveAndSend: boolean;
  }

  interface ProductItem {
    id: number;
    pId: number;
    bName: string;
    product: string;
    lastDate: string;
    dtlDsc: string;
    deleted: boolean;
  }

  interface ShowProductListRequest {
    id: number;
    productId: number;
    acc_Year: number;
    brands: number[];
  }