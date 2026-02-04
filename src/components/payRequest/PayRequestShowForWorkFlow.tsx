import { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useGeneralContext } from "../../context/GeneralContext";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../types/definitionInvironment";
import { useProductStore } from "../../store/productStore";
import { useBrandStore } from "../../store/brandStore";
import { usePayRequest } from "../../hooks/usePayRequest";
import { PayRequest } from "../../types/payRequest";
import PayRequestShow1 from "./PayRequestShow1";
import { usePayRequestStore } from "../../store/payRequestStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const PayRequestShowForWorkFlow = ({
  workFlowRowSelectResponse,
  definitionDateTime,
  definitionInvironment,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const {
    refetchPayRequestDtl,
    //payRequestDtl,
    payRequestDtlData,
    payRequestSave,
    isLoadingPayRequestSave,
    payRequestSaveResponse,
    //for tab 2
    payRequestResponse,
    chequeBookSearchResponse,
    chequeBookDtlSearchResponse,
    chequeBookDtlByIdResponse,
    payRequestInvoicesWorkFlowResponse,
    //for tab 0
    payRequestInvoicesResponse: payRequestInvoices,
    isLoadingPayRequestInvoices,
    //for tab 1
    rpCustomerBillsResponse,
    isLoadingRpCustomerBills,
    //for PayRequest/DtlRemoveInvoice
    payRequestDtlRemoveInvoice,
    payRequestDtlRemoveInvoiceResponse,
    //for PayRequest/DtlAddInvoice
    payRequestDtlAddInvoice,
    payRequestDtlAddInvoiceResponse,
  } = usePayRequest();

  const { setField, id } = usePayRequestStore();
  const { setField: setProductField } = useProductStore();
  const { setField: setBrandField } = useBrandStore();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedPayRequest, setSelectedPayRequest] =
    useState<PayRequest | null>(null);

  const { yearId, systemId } = useGeneralContext();

  if (id !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("yearId", -1);
    setField("systemId", -1);
    setField("yearIdDtl", yearId);
    setField("systemIdDtl", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
    setField("yearIdRpCustomerBills", -1);
  }

  /*useEffect(() => {
    if (workFlowRowSelectResponse.workTableRow.formId!==id && workFlowRowSelectResponse.workTableRow.formId!==0){
      console.log("hello")
      setField("yearId", -1);
      setField("systemId", -1);
      setField("yearIdDtl", yearId);
      setField("systemIdDtl", systemId);
      setField("id", workFlowRowSelectResponse.workTableRow.formId);
    }
  },[workFlowRowSelectResponse.workTableRow.formId, yearId, systemId]);*/

  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductGraceDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchPayRequestDtl();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(selectedPayRequest)
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
      setSelectedPayRequest(
        payRequestDtlData?.payRequest?.payRequests?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId,
        ) || null,
      );
      setSelectedId(workFlowRowSelectResponse.workTableRow.formId);
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setBrandField("accSystem", -1);
    }
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    payRequestDtlData?.payRequest?.payRequests,
  ]);

  return (
    <div className="w-full h-full py-2">
      <PayRequestShow1
        definitionInvironment={definitionInvironment}
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        payRequestSave={payRequestSave}
        isLoadingPayRequestSave={isLoadingPayRequestSave}
        //selectedPayRequest={selectedPayRequest} //for check if selectedPayRequest.flwId===0 new else edit && sending selectedPayRequest.id in edit
        //payRequestDtls={payRequestDtl}
        isNew={false} //for check if isNew new else edit
        setIsNew={() => false}
        setIsEdit={() => true}
        fromWorkFlow={true} //for going to editting in product grace form as default
        selectedId={selectedId}
        definitionDateTime={definitionDateTime}
        payRequestSaveResponse={payRequestSaveResponse}
        //for tab 2
        payRequestResponse={payRequestResponse}
        chequeBookSearchResponse={chequeBookSearchResponse}
        chequeBookDtlSearchResponse={chequeBookDtlSearchResponse}
        chequeBookDtlByIdResponse={chequeBookDtlByIdResponse}
        payRequestInvoicesWorkFlowResponse={payRequestInvoicesWorkFlowResponse}
        //for tab 0
        payRequestInvoices={payRequestInvoices}
        isLoadingPayRequestInvoices={isLoadingPayRequestInvoices}
        //for tab 1
        rpCustomerBillsResponse={rpCustomerBillsResponse}
        isLoadingRpCustomerBills={isLoadingRpCustomerBills}
        //for PayRequest/DtlRemoveInvoice
        payRequestDtlRemoveInvoice={payRequestDtlRemoveInvoice}
        payRequestDtlRemoveInvoiceResponse={payRequestDtlRemoveInvoiceResponse}
        //for PayRequest/DtlAddInvoice
        payRequestDtlAddInvoice={payRequestDtlAddInvoice}
        payRequestDtlAddInvoiceResponse={payRequestDtlAddInvoiceResponse}
        canEditForm1Dtl1={workFlowRowSelectResponse.workTableForms.canEditForm1Dtl1}
        canEditForm1Dtl2={workFlowRowSelectResponse.workTableForms.canEditForm1Dtl2}
        canEditForm1Mst1={workFlowRowSelectResponse.workTableForms.canEditForm1Mst1}
        canEditForm1Mst2={workFlowRowSelectResponse.workTableForms.canEditForm1Mst2}
      />
    </div>
  );
};

export default PayRequestShowForWorkFlow;
