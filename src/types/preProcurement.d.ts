// for /api/PreProcurement/924069
interface MstPreProcurement {
  id: number;
  systemId: number;
  systemTitle: string;
  factorNo: string;
  dat: string;
  customerId: number;
  customerName: string;
  exp: string;
  attachCount: number;
  canEdit: number;
}

interface DtlPreProcurement {
  id: number;
  serverId: number;
  pId: number;
  product: string;
  productExp: string;
  cnt: number;
  cntT: string;
  cost: number;
  costT: string;
  tax: number;
  taxT: string;
  dcrmnt: number;
  dcrmntT: string;
  total: number;
}

export interface DtlPreProcurementTable extends DtlPreProcurement {
  index: number;
  cntStr: string;
  costStr: string;
  dcrmntStr: string;
  totalStr: string;
  taxStr: string;
}

interface ResultPreProcurement {
  err: number;
  msg: string;
  mst: MstPreProcurement;
  dtls: DtlPreProcurement[];
  diagnosises: any[]; // Replace 'any' with a more specific type if diagnoses are known
}

interface DataPreProcurement {
  result: ResultPreProcurement;
}

interface PreProcurementResponse {
  meta: Meta;
  data: DataPreProcurement;
}

export interface PreProcurementState {
  id: number;
  preProcurementResponse: PreProcurementResponse;
  setField: (field: string, value: any) => void;
  setPreProcurementResponse: (
    preProcurementResponse: PreProcurementResponse
  ) => void;
}
