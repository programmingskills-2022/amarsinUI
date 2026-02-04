import { SearchItem } from "./general"

export interface CustomerSearchRequest{
    systemIdCustomerSearch: number
    yearIdCustomerSearch: number
    centerType: number
    search?:string
    page:number
    lastId:number
    usrPerm:boolean
}

export interface CustomerState extends CustomerSearchRequest{
    customerSearchResponse:CustomerSearchResponse
    setField: (field: string | number | symbol, value: any) => void;
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
        searchResults:SearchItem[]
      };
    };
  };