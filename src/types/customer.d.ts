export interface CustomerSearchRequest{
    systemId: number
    yearId: number
    centerType: number
    search?:string
    page:number
    lastId:number
    usrPerm:boolean
}
export interface Customer{
    id:string,
    text:string
}

export interface CustomerState extends CustomerSearchRequest{
    customerSearchResponse:CustomerSearchResponse
    setField: (field: keyof CustomerSearchRequest, value: any) => void;
    setCustomerSearchResponse:(customerSearchResponse:CustomerSearchResponse) =>void
    
}

type CustomerSearchResponse = {
    meta: {
      errorCode: number;
      message: string | null;
      type: string;
    };
    data: {
      result: {
        total_count: number;
        err: number;
        msg: string | null;
        searchResults:Customer[]
      };
    };
  };