import {
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useWarehouseStore } from "../store/warehouseStore";
import {
  WarehouseShowIdResponse,
  WarehouseIndentListResponse,
  SelectIndentsRequest,
  RegRequest,
  WarehouseSearchResponse,
  WarehouseTemporaryReceiptPurchaseShowResponse,
  WarehouseTemporaryReceiptSalesPricesResponse,
  WarehouseTemporaryReceiptPurchaseRegResponse,
  WarehouseTemporaryReceiptTitacShowResponse,
} from "../types/warehouse";

export function useWarehouse() {
  const {
    formIdWarehouseTemporaryReceipt,
    iocId,
    iocIdTrigger,
    //for api/Warehouse/Search?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
    search,
    page,
    pageSize,
    lastId,
    CustomerTypeId,
    PartKey,
    //end of api/Warehouse/Search?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
    receiptPurchaseId, //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
    id, //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
    salesPriceId, //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
    idReg, //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
    salesPriceIdReg, //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
    //end of api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
    formIdWarehouseTemporaryReceiptTitac, //for api/WarehouseTemporaryReceipt/Show/1135730
    setWarehouseTemporaryReceiptPurchaseShowResponse, //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
    setWarehouseShowIdResponse,
    setWarehouseIndentListResponse,
    setSelectIndentsResponse,
    setRegResponse,
    setWarehouseSearchResponse,
    setWarehouseTemporaryReceiptSalesPricesResponse, //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
    setWarehouseTemporaryReceiptPurchaseRegResponse, //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
    setWarehouseTemporaryReceiptTitacShowResponse, //for api/WarehouseTemporaryReceipt/Show/1135730
  } = useWarehouseStore();

  //api/WarehouseTemporaryReceipt/indentShow/1135730
  const warehouseShowIdQuery = useQuery<
    WarehouseShowIdResponse,
    Error,
    WarehouseShowIdResponse,
    unknown[]
  >({
    queryKey: ["warehouseShowId", formIdWarehouseTemporaryReceipt],
    queryFn: async () => {
      const url: string = `api/WarehouseTemporaryReceipt/indentShow/${formIdWarehouseTemporaryReceipt}`;
      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseShowIdResponse(data);
    },
    enabled: formIdWarehouseTemporaryReceipt !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<WarehouseShowIdResponse, Error, WarehouseShowIdResponse, unknown[]>);
  //for api/WarehouseTemporaryReceipt/Show/1135730
  const warehouseTemporaryReceiptTitacShowQuery = useQuery<
    WarehouseTemporaryReceiptTitacShowResponse,
    Error,
    WarehouseTemporaryReceiptTitacShowResponse,
    unknown[]
  >({
    queryKey: [
      "warehouseTemporaryReceiptTitacShow",
      formIdWarehouseTemporaryReceiptTitac,
    ],
    queryFn: async () => {
      const url: string = `api/WarehouseTemporaryReceipt/Show/${formIdWarehouseTemporaryReceiptTitac}`;
      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseTemporaryReceiptTitacShowResponse(data);
    },
    enabled: formIdWarehouseTemporaryReceiptTitac !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<WarehouseTemporaryReceiptTitacShowResponse, Error, WarehouseTemporaryReceiptTitacShowResponse, unknown[]>);

  //for warehouseSearchResponse
  const warehouseSearchQuery = useQuery<
    WarehouseSearchResponse,
    Error,
    WarehouseSearchResponse,
    unknown[]
  >({
    queryKey: [
      "warehouseSearch",
      search,
      page,
      pageSize,
      lastId,
      CustomerTypeId,
      PartKey,
    ],
    queryFn: async () => {
      const url: string = `/api/Warehouse/Search?search=${encodeURIComponent(
        search
      )}&page=${page}&pageSize=${pageSize}&lastId=${lastId}&CustomerTypeId=${CustomerTypeId}&PartKey=${PartKey}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseSearchResponse(data);
    },
    enabled: page !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<WarehouseSearchResponse, Error, WarehouseSearchResponse, unknown[]>);

  //for warehouseTemporaryReceiptIndentListResponse
  const warehouseIndentListQuery = useQuery<
    WarehouseIndentListResponse,
    Error,
    WarehouseIndentListResponse,
    unknown[]
  >({
    queryKey: ["warehouseIndentList", iocId, iocIdTrigger],
    queryFn: async () => {
      const url: string = `/api/WarehouseTemporaryReceipt/indentList/${iocId}`;
      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: iocId !== -1 && iocId !== undefined, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setWarehouseIndentListResponse(data);
    },
  } as UseQueryOptions<WarehouseIndentListResponse, Error, WarehouseIndentListResponse, unknown[]>);

  //for /api/WarehouseTemporaryReceipt/purchaseShow/1107390
  const warehouseTemporaryReceiptPurchaseShowQuery = useQuery<
    WarehouseTemporaryReceiptPurchaseShowResponse,
    Error,
    WarehouseTemporaryReceiptPurchaseShowResponse,
    unknown[]
  >({
    queryKey: ["warehouseTemporaryReceiptPurchaseShow", receiptPurchaseId],
    queryFn: async () => {
      const url: string = `/api/WarehouseTemporaryReceipt/purchaseShow/${receiptPurchaseId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseTemporaryReceiptPurchaseShowResponse(data);
    },
    enabled: receiptPurchaseId !== -1 && receiptPurchaseId !== undefined, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<WarehouseTemporaryReceiptPurchaseShowResponse, Error, WarehouseTemporaryReceiptPurchaseShowResponse, unknown[]>);

  //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
  const warehouseTemporaryReceiptSalesPricesQuery = useQuery<
    WarehouseTemporaryReceiptSalesPricesResponse,
    Error,
    WarehouseTemporaryReceiptSalesPricesResponse,
    unknown[]
  >({
    queryKey: ["warehouseTemporaryReceiptSalesPrices", id, salesPriceId],
    queryFn: async () => {
      const url: string = `/api/WarehouseTemporaryReceipt/salesPrices?id=${id}&salesPriceId=${salesPriceId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseTemporaryReceiptSalesPricesResponse(data);
    },
    enabled: id !== -1 && salesPriceId !== 0, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<WarehouseTemporaryReceiptSalesPricesResponse, Error, WarehouseTemporaryReceiptSalesPricesResponse, unknown[]>);

  //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
  const warehouseTemporaryReceiptPurchaseRegQuery = useQuery<
    WarehouseTemporaryReceiptPurchaseRegResponse,
    Error,
    WarehouseTemporaryReceiptPurchaseRegResponse,
    unknown[]
  >({
    queryKey: ["warehouseTemporaryReceiptPurchaseReg", idReg, salesPriceIdReg],
    queryFn: async () => {
      const url: string = `/api/WarehouseTemporaryReceipt/purchaseReg?id=${idReg}&salesPriceId=${salesPriceIdReg}`;
      console.log(url, "url");
      const response = await api.get(url);
      console.log(response.data, "response.data");
      return response.data;
    },
    enabled: idReg !== -1 && salesPriceIdReg !== -1, // Only fetch if param is available
    onSuccess: (data: any) => {
      setWarehouseTemporaryReceiptPurchaseRegResponse(data);
    },
  } as UseQueryOptions<WarehouseTemporaryReceiptPurchaseRegResponse, Error, WarehouseTemporaryReceiptPurchaseRegResponse, unknown[]>);
  // for editIndentsResponse
  const editIndentMutation = useMutation({
    mutationFn: async (request: SelectIndentsRequest) => {
      const url: string = `/api/WarehouseTemporaryReceipt/SelectIndents`;
      const response = await api.post(url, request);
      console.log(response.data, "response.data");
      return response.data;
    },
    onSuccess: (data: any) => {
      setSelectIndentsResponse(data);
      warehouseShowIdQuery.refetch();
    },
  });
  //for regResponse
  const regMutation = useMutation({
    mutationFn: async (request: RegRequest) => {
      const url: string = `/api/WarehouseTemporaryReceipt/Reg`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setRegResponse(data);
    },
  });
  return {
    //output for warehouseSearchResponse
    isLoadingWarehouseSearch: warehouseSearchQuery.isLoading,
    errorWarehouseSearch: warehouseSearchQuery.error,
    warehouseSearchResponse: warehouseSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: { total_count: 0, err: 0, msg: "", searchResults: [] },
      },
    },
    // output for warehouseShowId /api/WarehouseTemporaryReceipt/indentShow/1135730
    refetchWarehouseShowId: () => warehouseShowIdQuery.refetch(),
    isLoadingWarehouseShowId: warehouseShowIdQuery.isLoading,
    errorWarehouseShowId: warehouseShowIdQuery.error,
    warehouseShowIdResponse: warehouseShowIdQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          response: {
            wId: 0,
            wName: "",
            warehouseTemporaryReceiptMst: {
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
            warehouseTemporaryReceiptIndentDtls: [],
          },
        },
      },
    },
    //output for warehouseTemporaryReceiptTitacShowResponse /api/WarehouseTemporaryReceipt/Show/1135730
    refetchWarehouseTemporaryReceiptTitacShow: () =>
      warehouseTemporaryReceiptTitacShowQuery.refetch(),
    isLoadingWarehouseTemporaryReceiptTitacShow:
      warehouseTemporaryReceiptTitacShowQuery.isLoading,
    errorWarehouseTemporaryReceiptTitacShow:
      warehouseTemporaryReceiptTitacShowQuery.error,
    warehouseTemporaryReceiptTitacShowResponse:
      warehouseTemporaryReceiptTitacShowQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: {
            wId: 0,
            wName: "",
            warehouseTemporaryReceiptMst: {
              id: 0,
              formId: 0,
              code: "",
              dat: "",
              tim: "",
              cId: 0,
              srName: "",
              gln: "",
              exp: "",
              guid: "",
              status: 0,
              msg: "",
            },
            warehouseTemporaryReceiptDtls: [],
            totalCount: 0,
            hasMore: false,
          },
          total_count: 0,
        },
      },
    //output for WarehouseTemporaryReceiptIndentList
    RefetchWarehouseIndentList: () => warehouseIndentListQuery.refetch(), // Optional manual trigger
    isLoadingWarehouseIndentList: warehouseIndentListQuery.isLoading,
    errorWarehouseIndentList: warehouseIndentListQuery.error,
    warehouseIndentList: warehouseIndentListQuery.data ?? {
      meta: { errorCode: -1, message: "", type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          warehouseTemporaryReceiptIndentLists: [],
        },
      },
    },
    //output for warehouseTemporaryReceiptPurchaseShowResponse
    refetchWarehouseTemporaryReceiptPurchaseShow: () =>
      warehouseTemporaryReceiptPurchaseShowQuery.refetch(),
    isLoadingWarehouseTemporaryReceiptPurchaseShow:
      warehouseTemporaryReceiptPurchaseShowQuery.isLoading,
    errorWarehouseTemporaryReceiptPurchaseShow:
      warehouseTemporaryReceiptPurchaseShowQuery.error,
    warehouseTemporaryReceiptPurchaseShowResponse:
      warehouseTemporaryReceiptPurchaseShowQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: {
            err: 0,
            msg: "",
            result: {
              spId: 0,
              spTitle: "",
              wId: 0,
              wName: "",
              warehouseTemporaryReceiptMst: {
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
              warehouseTemporaryReceiptPurchaseDtls: [],
            },
          },
        },
      },
    //output for warehouseTemporaryReceiptSalesPricesResponse
    isLoadingWarehouseTemporaryReceiptSalesPrices:
      warehouseTemporaryReceiptSalesPricesQuery.isLoading,
    errorWarehouseTemporaryReceiptSalesPrices:
      warehouseTemporaryReceiptSalesPricesQuery.error,
    warehouseTemporaryReceiptSalesPricesResponse:
      warehouseTemporaryReceiptSalesPricesQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: { err: 0, msg: "", salesPrices: [] },
        },
      },
    //output for warehouseTemporaryReceiptPurchaseRegResponse
    isLoadingWarehouseTemporaryReceiptPurchaseReg:
      warehouseTemporaryReceiptPurchaseRegQuery.isLoading,
    errorWarehouseTemporaryReceiptPurchaseReg:
      warehouseTemporaryReceiptPurchaseRegQuery.error,
    warehouseTemporaryReceiptPurchaseRegResponse:
      warehouseTemporaryReceiptPurchaseRegQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: { result: { id: 0, err: 0, msg: "", dtlErrMsgs: [] } },
      },
    //output for selectIndentsResponse
    isLoadingEditIndents: editIndentMutation.isPending,
    errorEditIndents: editIndentMutation.error,
    editIndents: editIndentMutation.mutateAsync,
    //output for regResponse
    isLoadingReg: regMutation.isPending,
    errorReg: regMutation.error,
    reg: regMutation.mutateAsync,
  };
}
