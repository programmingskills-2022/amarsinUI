import { Meta } from "./general";
//http://apitest.dotis.ir/api/ClearBook/clearBooksProducts?SystemId=4&YearId=15&BrandId=606
export interface ClearBookProductsRequest {
  systemId: number;
  yearId: number;
  brandId: number;
}
export interface ClearBookProductsName {
  pId: number;
  code: string;
  name: string;
  bName: string;
  imgUrl: string;
}

interface ClearBook {
  id: number;
  name: string;
  pIds: number[];
}

interface Data {
  result: {
    err: number;
    msg: string;
    clearBookProductsName: ClearBookProductsName[];
    clearBooks: ClearBook[];
  };
}

export interface ClearBookProductsResponse {
  meta: Meta;
  data: Data;
}

//http://apitest.dotis.ir/api/ClearBook/setProduct?ClearBookId=64&ProductId=11131&check=false
export interface ClearBookProductsSetProductRequest {
  clearBookId: number;
  productId: number;
  check: boolean;
}
export interface ClearBookProductsSetProductResponse {
  meta: Meta;
  data: { result: any };
}
export interface ClearBookProductsState extends ClearBookProductsRequest {
  clearBookProductsResponse: ClearBookProductsResponse;
  clearBookProductsSetProductResponse: ClearBookProductsSetProductResponse;
  setField: (field: keyof ClearBookProductsRequest, value: any) => void;
  setClearBookProductsResponse: (
    clearBookProductsResponse: ClearBookProductsResponse
  ) => void;
  setClearBookProductsSetProductResponse: (
    clearBookProductsSetProductResponse: ClearBookProductsSetProductResponse
  ) => void;
}
