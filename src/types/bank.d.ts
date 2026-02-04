import { SearchItem } from "./general";

export type BankSearchRequest = {
    page: number;
    lastId: number;
    search: string;
  };
  
  /*export type Bank = {
    id: number;
    text: string;
  };*/
  
  export type BankSearchResponse = {
    total_count: number;
    results: SearchItem[];
  };

  export interface BankState extends BankSearchRequest{
    banks:BankSearchResponse
    setField: (field: string | number | symbol, value: any) => void;
    setBanks:(banks:BankSearchResponse) =>void
    
}