import {
    useMutation,
    useQuery,
    useQueryClient,
    //useQueryClient,
    UseQueryOptions,
  } from "@tanstack/react-query";
  import api from "../api/axios";
  import { useProductPriceStore } from "../store/productPriceStore";
  import {
    ProductPriceDoFirstFlowRequest,
    ProductPriceDtlHistoryResponse,
    ProductPriceSaveRequest,
    ProductPriceResponse,
  } from "../types/productPrice";
import { ShowProductListRequest } from "../types/productOperation";
  
  export function useProductPrice() {
    const queryClient = useQueryClient();
  
    const {
      id,
      yearId,
      systemId,
      systemIdDtl,
      yearIdDtl,
      state,
      regFDate,
      regTDate,
      fDate,
      tDate,
      pageNumber,
      srchId,
      srchDate,
      srchTime,
      srchDsc,
      srchAccepted,
      srchUsrName,
      srchStep,
      sortId,
      sortDat,
      sortTime,
      sortDsc,
      sortAccepted,
      sortUsrName,
      sortStep,
      pId,
      pIdTrigger,
      //productPriceResponse,
      setProductPriceResponse,
      setProductPriceListResponse,
      //for productPrice/dtlHistory
      setProductPriceDtlHistoryResponse,
      //for productPrice/save
      setProductPriceSaveResponse,
      //for productPrice/del
      setProductPriceDelResponse,
      //for productPrice/doFirstFlow
      setProductPriceDoFirstFlowResponse,
    } = useProductPriceStore();
    //for productPrice
    const query = useQuery<
      ProductPriceResponse,
      Error,
      ProductPriceResponse,
      unknown[]
    >({
      queryKey: [
        "productPrice",
        yearId,
        systemId,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
        pageNumber,
        srchId,
        srchDate,
        srchTime,
        srchDsc,
        srchAccepted,
        srchUsrName,
        srchStep,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortAccepted,
        sortUsrName,
        sortStep,
      ],
      queryFn: async () => {
        const params = {
          yearId,
          systemId,
          state,
          regFDate,
          regTDate,
          fDate,
          tDate,
          pageNumber,
          srchId,
          srchDate,
          srchTime,
          srchDsc,
          srchAccepted,
          srchUsrName,
          srchStep,
          sortId,
          sortDat,
          sortTime,
          sortDsc,
          sortAccepted,
          sortUsrName,
          sortStep,
        };
        const url = `/api/ProductPrice?YearId=${
          params.yearId
        }&SystemId=${params.systemId}&State=${
          params.state
        }&RegFDate=${encodeURIComponent(
          params.regFDate ?? ""
        )}&RegTDate=${encodeURIComponent(
          params.regTDate ?? ""
        )}&FDate=${encodeURIComponent(
          params.fDate ?? ""
        )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
          params.pageNumber
        }&SrchId=${params.srchId}${
          params.srchDate
            ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
            : ""
        }${
          params.srchTime
            ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
            : ""
        }${
          params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
        }&SrchAccepted=${params.srchAccepted}${
          params.srchUsrName
            ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
            : ""
        }${
          params.srchStep
            ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
            : ""
        }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
          params.sortTime
        }&SortDsc=${params.sortDsc}&SortAccepted=${
          params.sortAccepted
        }&SortUsrName=${params.sortUsrName}&SortStep=${params.sortStep}`;
        console.log("ProductPrice url", url);   
        const response = await api.get(url);
        return response.data;
      },
      enabled: systemId!==-1 && yearId!== -1,
      refetchOnWindowFocus: false, // Refetch data when the window is focused
      refetchOnReconnect: false, // Refetch data when the network reconnects
      onSuccess: (data: any) => {
        setProductPriceResponse(data);
      },
    } as UseQueryOptions<ProductPriceResponse, Error, ProductPriceResponse, unknown[]>);
  
    //for productPriceDtl
    const queryDtl = useQuery<
      ProductPriceResponse,
      Error,
      ProductPriceResponse,
      unknown[]
    >({
      queryKey: [
        "productPriceDtl",  
        id,
        yearIdDtl,
        systemIdDtl,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
        pageNumber,
        srchId,
        srchDate,
        srchTime,
        srchDsc,
        srchAccepted,
        srchUsrName,
        srchStep,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortAccepted,
        sortUsrName,
        sortStep,
      ],
      queryFn: async () => {
        const params = {   
          id,
          yearIdDtl,
          systemIdDtl,
          state,
          regFDate,
          regTDate,
          fDate,
          tDate,
          pageNumber,
          srchId,
          srchDate,
          srchTime,
          srchDsc,
          srchAccepted,
          srchUsrName,
          srchStep,
          sortId,
          sortDat,
          sortTime,
          sortDsc,
          sortAccepted,
          sortUsrName,
          sortStep,
        };
        const url = `/api/ProductPrice?Id=${params.id}&Acc_Year=${
          params.yearIdDtl
        }&Acc_System=${params.systemIdDtl}&State=${
          params.state
        }&RegFDate=${encodeURIComponent(
          params.regFDate ?? ""
        )}&RegTDate=${encodeURIComponent(
          params.regTDate ?? ""
        )}&FDate=${encodeURIComponent(
          params.fDate ?? ""
        )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
          params.pageNumber
        }&SrchId=${params.srchId}${
          params.srchDate
            ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
            : ""
        }${
          params.srchTime
            ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
            : ""
        }${
          params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
        }&SrchAccepted=${params.srchAccepted}${
          params.srchUsrName
            ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
            : ""
        }${
          params.srchStep
            ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
            : ""
        }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
          params.sortTime
        }&SortDsc=${params.sortDsc}&SortAccepted=${
          params.sortAccepted
        }&SortUsrName=${params.sortUsrName}&SortStep=${params.sortStep}`;
        console.log("ProductPriceDtl url", url);
        const response = await api.get(url);
        return response.data;
      },
      enabled: systemIdDtl!==-1 && yearIdDtl!== -1,
      refetchOnWindowFocus: false, // Refetch data when the window is focused
      refetchOnReconnect: false, // Refetch data when the network reconnects
      onSuccess: (data: any) => {
        setProductPriceResponse(data);
      },
    } as UseQueryOptions<ProductPriceResponse, Error, ProductPriceResponse, unknown[]>);
  
    // for productPrice/showProductList 
    const addList = useMutation({
      mutationFn: async (request: ShowProductListRequest) => {
        const url: string = `api/ProductPrice/showProductList `;
        const response = await api.post(url, request);
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductPriceListResponse(data);
      },
    });
    // for productPrice/history
    const productPriceDtlHistory = useQuery<
      ProductPriceDtlHistoryResponse,
      Error,
      ProductPriceDtlHistoryResponse,
      unknown[]
    >({
      queryKey: ["productPriceDtlHistory", pId, pIdTrigger],
      queryFn: async () => {
        const url = `/api/ProductPrice/history/${pId}`;
        console.log(url, "url");
        const response = await api.get(url);
        return response.data;
      },
      enabled: pId!==-1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data: any) => {
            setProductPriceDtlHistoryResponse(data);
        },
    } as UseQueryOptions<ProductPriceDtlHistoryResponse, Error, ProductPriceDtlHistoryResponse, unknown[]>);
    // for productPrice/Save
    const productPriceSave = useMutation({
      mutationFn: async (request: ProductPriceSaveRequest) => { 
        const url: string = `api/ProductPrice/Save`;
        const response = await api.post(url, request);
  
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductPriceSaveResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productPrice"] });
        queryClient.invalidateQueries({ queryKey: ["productPriceDtl"] });
        //console.log(data, "data");

      },
    });
    //for productPrice/productPriceDoFirstFlow
    const productPriceDoFirstFlow = useMutation({
      mutationFn: async (request: ProductPriceDoFirstFlowRequest) => {
        const url: string = `api/ProductPrice/doFirstFlow?Acc_System=${request.acc_System}&Acc_Year=${request.acc_Year}&Id=${
          request.id
        }&Dsc=${encodeURIComponent(request.dsc)}`;
        console.log(request, "request", url, "url");
        const response = await api.post(url);
  
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductPriceDoFirstFlowResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productPrice"] });
      },
    });
    //for productPrice/Del
    const productPriceDel = useMutation({
      mutationFn: async (requestId: number) => {
        const response = await api.delete(`api/ProductPrice/${requestId}`, {
          params: {
            
          },
        });
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductPriceDelResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productPrice"] }); 
      },
    });
    return {
      //for productPrice
      refetch: query.refetch,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
      productPrice: query.data?.data.result.productPrices,
      productPriceMeta: query.data?.meta,
      productPriceTotalCount: query.data?.data.result.total_count,
      //for productPriceDtl
      refetchProductPriceDtl: queryDtl.refetch,
      isLoadingDtl: queryDtl.isLoading,
      errorDtl: queryDtl.error,
      productPriceDtl: queryDtl.data?.data.result.productPriceDtls,
      productPriceDtlData: queryDtl.data?.data.result,
      //for productPrice/showProductList
      isLoadingAddList: addList.isPending,
      errorAddList: addList.error,
      addProductList: addList.mutateAsync,
      //for productPrice/dtlHistory
      isLoadingDtlHistory: productPriceDtlHistory.isLoading,
      errorDtlHistory: productPriceDtlHistory.error,
      productPriceDtlHistory: productPriceDtlHistory.data?.data.result,
      //for productPrice/Save
      isLoadingProductPriceSave: productPriceSave.isPending,
      errorProductPriceSave: productPriceSave.error,
      productPriceSave: productPriceSave.mutateAsync,
      productPriceSaveResponse: productPriceSave.data,
      //for productPrice/Del
      isLoadingProductPriceDel: productPriceDel.isPending, 
      errorProductPriceDel: productPriceDel.error,
      productPriceDel: productPriceDel.mutateAsync,
      productPriceDelResponse: productPriceDel.data,
      //for productPrice/DoFirstFlow
      isLoadingProductPriceDoFirstFlow: productPriceDoFirstFlow.isPending,
      errorProductPriceDoFirstFlow: productPriceDoFirstFlow.error,
      productPriceDoFirstFlow: productPriceDoFirstFlow.mutateAsync,
      productPriceDoFirstFlowResponse: productPriceDoFirstFlow.data ?? {},
    };
  }
  