// http://apitest.dotis.ir/api/SaleReport/RpCustomerBills?SystemId=4&YearId=15&CustomerId=787&FDate=1404%2F02%2F06&TDate=1404%2F02%2F07

// for SaleReport/RpCustomerBills
export interface RpCustomerBillsRequest {
    customerIdRpCustomerBills: number;
    systemIdRpCustomerBills: number;
    yearIdRpCustomerBills: number;
    fDateRpCustomerBills: string;
    tDateRpCustomerBills: string;
  }

interface RpCustomerBillsResult {
    sl_Sanad: number;
    sanad: number;
    num: string;
    dat: string;
    exp: string;
    bed: string;
    bes: string;
    rem: number;
    bedBes: string;   
}

export interface RpCustomerBillsResultWithIndex extends RpCustomerBillsResult {
    index: number;
}

interface RpCustomerBillsResponse {
    meta: {
      errorCode: number;
      message: string;
      type: string;
    };
    data: {
      result: RpCustomerBillsResult[]
    };
  }