export type BankSearchRequest = {
    page: number;
    lastId: number;
    search: string;
  };
  
  export type Bank = {
    id: number;
    text: string;
  };
  
  export type BankSearchResponse = {
    total_count: number;
    results: Bank[];
  };

  export interface BankState extends BankSearchRequest{
    banks:BankSearchResponse
    setField: (field: keyof BankSearchRequest, value: any) => void;
    setBanks:(banks:BankSearchResponse) =>void
    
}