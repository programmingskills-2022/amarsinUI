import InvoiceShow from "../invoice/InvoiceShow";
import WarehouseShow from "../warehouse/WarehouseShow";
import {
  WorkFlowDoFlowRequest,
  WorkflowResponse,
  WorkflowRowSelectResponse,
} from "../../types/workflow";
import RegRecievedCheque from "../cheque/RegRecievedCheque";
import PaymentInvoiceShow from "../paymentInvoices/PaymentInvoiceShow";
import OrderRegShow from "../order/OrderRegShow";
import ReceiptPurchaseShow from "../warehouseTemporarilyReceiptPurchase/ReceiptPurchaseShow";
import ProductGraceForWorkFlow from "../productGrace/ProductGraceForWorkFlow";
import ProductOfferForWorkFlow from "../productOffer/ProductOfferForWorkFlow";
import ProductPriceForWorkFlow from "../productPrice/ProductPriceForWorkFlow";
import ProductPermForWorkFlow from "../productPerm/ProductPermForWorkFlow";
import WarehouseTemporaryReceiptShow from "../preInvoiceReturn/WarehouseTemporaryReceiptShow";
import BankAssignShow from "../bankAssign/BankAssignShow";
import DeliveryShow from "../delivery/DeliveryShow";
import InventoryDetailShow from "../inventory/inventoryDetail/InventoryDetailShow";
import PreProcurementShow from "../preProcurement/PreProcurementShow";
import DocumentChangeDate from "../../pages/workflow/DocumentChangeDate";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
//import { useWorkflowStore } from "../../store/workflowStore";
import InvoicePaymentShow from "../invoicePayment/InvoicePaymentShow";
import InvoiceReturnRequestShow from "../invoiceReturnRequest/InvoiceReturnRequestShow";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../types/definitionInvironment";
import { SearchItem } from "../../types/general";
import InvoiceReceiptShowForWorkflow from "../invoiceReceipt/InvoiceReceiptShowForWorkflow";
import PayRequestShowForWorkFlow from "../payRequest/PayRequestShowForWorkFlow";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  doFlow: UseMutateAsyncFunction<any, Error, WorkFlowDoFlowRequest, unknown>;
  //isLoadingdoFlow: boolean;
  //refetchWorkTable: () => void;
  //refetchWorkTableRowSelect: () => void;
  dsc?: string; // for  هامش
  flowMapId?: number;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpenMessage?: React.Dispatch<React.SetStateAction<boolean>>;
  definitionInvironment: DefinitionInvironment;
  definitionDateTime: DefinitionDateTime;
  isLoadingBanks: boolean;
  banks: SearchItem[];
  cashPosSystemSearch: SearchItem[];
  currentWorkTableRowId?: number;
  setWorkFlowResponse: React.Dispatch<React.SetStateAction<WorkflowResponse>>;
  //setWorkFlowRowSelectResponse: React.Dispatch<React.SetStateAction<WorkflowRowSelectResponse>>;
};

export default function WorkflowComponent({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  doFlow,
  //isLoadingdoFlow,
  //refetchWorkTable,
  //refetchWorkTableRowSelect,
  dsc,
  flowMapId,
  setIsModalOpen, //to open/close child form
  setIsModalOpenMessage, // to show/not show message after doflow
  definitionInvironment,
  definitionDateTime,
  isLoadingBanks,
  banks,
  cashPosSystemSearch,
  currentWorkTableRowId,
  setWorkFlowResponse,
}: //setWorkFlowRowSelectResponse
Props) {
  let componentToRender1: React.ReactNode | null = null;
  let componentToRender2: React.ReactNode | null = null;
  //const { workFlowDoFlowResponse } = useWorkflowStore();
  switch (workFlowRowSelectResponse.workTableForms.form1ViewPath) {
    case "Invoice/_Show":
    case "InvoiceBuy/_InvoiceBuy":
      componentToRender1 = (
        <InvoiceShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          caption={"اقلام"}
        />
      );
      break;
    case "InvoiceReturn/_InvoiceReturn":
      componentToRender1 = (
        <InvoiceShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          caption={"اقلام مرجوعی"}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceiptIndent": //کارشناس خرید => ثبت اولیه رسید موقت
      componentToRender1 = (
        <WarehouseShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Indent/_CreateIndent": //کارشناس خرید => دریافت پیش فاکتور
      componentToRender1 = (
        <InvoiceReceiptShowForWorkflow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
        />
        /*<InvoiceReceiptShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isNew={false}
          setIsNew={() => {}}
          setIsEdit={() => {}}
          definitionDateTime={definitionDateTime}
          isFromWorkFlow={true}
        />*/
      );
      break;
    case "Payment/_Cheque": //کمک حسابداری-> ثبت اولیه چک -دریافتی
      componentToRender1 = (
        <RegRecievedCheque
          canEditForm={workFlowRowSelectResponse.workTableForms.canEditForm1}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionInvironment={definitionInvironment}
          banks={banks}
          isLoadingBanks={isLoadingBanks}
          cashPosSystemSearch={cashPosSystemSearch}
        />
      );
      break;
    case "Payment/_PaymentInvoices": //کارشناس بازرگانی=>تایید اطلاعات چک دریافتی
      componentToRender1 = (
        <PaymentInvoiceShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Order/_Order": //کارشناس بازرگانی -> ثبت اولیه - سفارش
      componentToRender1 = (
        <OrderRegShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceiptPurchase": // کارشناس خرید -> تایید فاکتور خرید
      componentToRender1 = (
        <ReceiptPurchaseShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
        />
      );
      break;
    case "ProductGrace/_ProductGrace": // ثبت فرجه
      componentToRender1 = (
        <ProductGraceForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductOffer/_ProductOfferEdit": //ثیت آفر
    case "ProductOffer/_ProductOffer":
      componentToRender1 = (
        <ProductOfferForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductPrice/_ProductPrice": //ثبت لیست قیمت
      componentToRender1 = (
        <ProductPriceForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductPerm/_ProductPerm": //ثبت لیست نیاز به مجوز
      componentToRender1 = (
        <ProductPermForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "PreInvoiceReturn/_PreInvoiceReturnWareHouseTemporaryReceipt": //مدیر انبار / تایید و ارسال به انبار- پیش فاکتور مرجوعی
      //case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceipt":
      componentToRender1 = (
        <WarehouseTemporaryReceiptShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Payment/_BankAssign": //حسابدار -> عودت شد
      componentToRender1 = (
        <BankAssignShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Delivery/_Delivery": //تیتک -> ارسال به تیتک
    case "DeliveryReturn/_DeliveryReturn": //بازرگانی -> ثبت حواله مرجوعی
      componentToRender1 = (
        <DeliveryShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isDeliveryForm={true}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceipt": // کارشناس خرید -> تیتک
      componentToRender1 = (
        <DeliveryShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isDeliveryForm={false}
        />
      );
      break;
    case "Inventory/_Inventory": //کارشناس خرید -> ثبت شمارش
      componentToRender1 = (
        <InventoryDetailShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "PreProcurement/_PreProcurement": //کارشناس تدارکات -> ثبت پیش فاکتور کالا/خدمات
    case "Procurement/_Procurement": //خزانه دار-ثبت فاکتور خرید
      componentToRender1 = (
        <PreProcurementShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Invoice/_Payment":
      componentToRender1 = (
        <InvoicePaymentShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          banks={banks}
        />
      );
      break;
    case "InvoiceReturnRequest/_InvoiceReturnRequest": //کارشناس بازرگانی-> ثبت درخواست مرجوعی
      componentToRender1 = (
        <InvoiceReturnRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          formKind="isRequest" //for showing or hiding the "اطلاعات ثبت" column
        />
      );
      break;
    case "PreInvoiceReturn/_PreInvoiceReturn": //کارشناس بازرگانی -> ثبت پیش فاکتور مرجوعی
      componentToRender1 = (
        <InvoiceReturnRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          formKind="isPreInvoice" //for showing or hiding the "اطلاعات ثبت" column
        />
      );
      break;
    case "Account/_DocumentChangeDate": //تاریخ سند
      componentToRender1 = (
        <DocumentChangeDate
          flowMapId={flowMapId ?? -1}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          //isLoadingdoFlow={isLoadingdoFlow}
          doFlow={doFlow}
          //workFlowDoFlowResponse={workFlowDoFlowResponse}
          //refetchWorkTable={refetchWorkTable}
          //refetchWorkTableRowSelect={refetchWorkTableRowSelect}
          dsc={dsc ?? ""} // for  هامش
          setIsModalOpen={setIsModalOpen ?? (() => {})}
          setIsModalOpenMessage={setIsModalOpenMessage ?? (() => {})}
          currentWorkTableRowId={currentWorkTableRowId ?? 0}
          setWorkFlowResponse={setWorkFlowResponse}
          //setWorkFlowRowSelectResponse={setWorkFlowRowSelectResponse}
        />
      );
      break;
    case "PayRequest/_PayRequest": //کارشناس خرید -> ثبت اولیه
      componentToRender1 = (
        <PayRequestShowForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
          definitionInvironment={definitionInvironment}
        />
        /*<PayRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          isNew={false}
          setIsNew={() => {}}
          setIsEdit={() => {}}
          definitionDateTime={definitionDateTime}
          definitionInvironment={definitionInvironment}
          fromWorkFlow={true}
        />*/
      );
      break;
    default:
      componentToRender1 = null;
      break;
  }
  switch (workFlowRowSelectResponse.workTableForms.form2ViewPath) {
    case "Invoice/_Show":
    case "InvoiceBuy/_InvoiceBuy":
      componentToRender2 = (
        <InvoiceShow //کارشناس خرید-> دریافت اصل فاکتور*****************
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          caption={"اقلام"}
        />
      );
      break;
    case "InvoiceReturn/_InvoiceReturn": //****************
      componentToRender2 = (
        <InvoiceShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          caption={"اقلام مرجوعی"}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceiptIndent": //کارشناس خرید => ثبت اولیه رسید موقت
      componentToRender2 = (
        <WarehouseShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Indent/_CreateIndent": //کارشناس خرید => دریافت پیش فاکتور
      componentToRender2 = (
        <InvoiceReceiptShowForWorkflow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
        />
        /*<InvoiceReceiptShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isNew={false}
          setIsNew={() => {}}
          setIsEdit={() => {}}
          definitionDateTime={definitionDateTime}
          isFromWorkFlow={true}
        />*/
      );
      break;
    case "Payment/_Cheque": //کمک حسابداری***************
      componentToRender2 = (
        <RegRecievedCheque
          canEditForm={workFlowRowSelectResponse.workTableForms.canEditForm2}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionInvironment={definitionInvironment}
          banks={banks}
          isLoadingBanks={isLoadingBanks}
          cashPosSystemSearch={cashPosSystemSearch}
        />
      );
      break;
    case "Payment/_PaymentInvoices": //کارشناس بازرگانی=>تایید اطلاعات چک دریافتی
      componentToRender2 = (
        <PaymentInvoiceShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Order/_Order": //کارشناس بازرگانی -> ثبت اولیه - سفارش
      componentToRender2 = (
        <OrderRegShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceiptPurchase": //کارشناس خرید -> تایید فاکتور خرید
      componentToRender2 = (
        <ReceiptPurchaseShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
        />
      );
      break;
    case "ProductGrace/_ProductGrace": //ثبت فرجه***************
      componentToRender2 = (
        <ProductGraceForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductOffer/_ProductOfferEdit": //ثیت آفر***************
    case "ProductOffer/_ProductOffer":
      componentToRender2 = (
        <ProductOfferForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductPrice/_ProductPrice": //ثبت لیست قیمت***************
      componentToRender2 = (
        <ProductPriceForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "ProductPerm/_ProductPerm": //ثبت لیست نیاز به مجوز***************
      componentToRender2 = (
        <ProductPermForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          definitionDateTime={definitionDateTime}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "PreInvoiceReturn/_PreInvoiceReturnWareHouseTemporaryReceipt": //مدیر انبار / تایید و ارسال به انبار- پیش فاکتور مرجوعی
      //case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceipt":
      componentToRender2 = (
        <WarehouseTemporaryReceiptShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Payment/_BankAssign": //حسابدار -> عودت شد
      componentToRender2 = (
        <BankAssignShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Delivery/_Delivery": //تیتک -> ارسال به تیتک
    case "DeliveryReturn/_DeliveryReturn": //بازرگانی -> ثبت حواله مرجوعی
      componentToRender2 = (
        <DeliveryShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isDeliveryForm={true}
        />
      );
      break;
    case "WarehouseTemporaryReceipt/_WarehouseTemporaryReceipt": // کارشناس خرید -> تیتک
      componentToRender2 = (
        <DeliveryShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          isDeliveryForm={false}
        />
      );
      break;
    case "Inventory/_Inventory": //کارشناس خرید -> ثبت شمارش
      componentToRender2 = (
        <InventoryDetailShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "PreProcurement/_PreProcurement": //کارشناس تدارکات -> ثبت پیش فاکتور کالا/خدمات
    case "Procurement/_Procurement": //خزانه دار-ثبت فاکتور خرید
      componentToRender2 = (
        <PreProcurementShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "Invoice/_Payment":
      componentToRender2 = (
        <InvoicePaymentShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          banks={banks}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
        />
      );
      break;
    case "InvoiceReturnRequest/_InvoiceReturnRequest": //کارشناس بازرگانی-> ثبت درخواست مرجوعی
      componentToRender2 = (
        <InvoiceReturnRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          formKind="isRequest" //for showing or hiding the "اطلاعات ثبت" column
        />
      );
      break;
    case "PreInvoiceReturn/_PreInvoiceReturn": //کارشناس بازرگانی -> ثبت پیش فاکتور مرجوعی
      componentToRender2 = (
        <InvoiceReturnRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          formKind="isPreInvoice" //for showing or hiding the "اطلاعات ثبت" column
        />
      );
      break;
    case "Account/_DocumentChangeDate": //تاریخ سند
      componentToRender2 = (
        <DocumentChangeDate
          flowMapId={flowMapId ?? -1}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          //isLoadingdoFlow={isLoadingdoFlow}
          doFlow={doFlow}
          //workFlowDoFlowResponse={workFlowDoFlowResponse}
          //refetchWorkTable={refetchWorkTable}
          //refetchWorkTableRowSelect={refetchWorkTableRowSelect}
          dsc={dsc ?? ""} // for  هامش
          setIsModalOpen={setIsModalOpen ?? (() => {})}
          setIsModalOpenMessage={setIsModalOpenMessage ?? (() => {})}
          currentWorkTableRowId={currentWorkTableRowId ?? 0}
          setWorkFlowResponse={setWorkFlowResponse}
          //setWorkFlowRowSelectResponse={setWorkFlowRowSelectResponse}
        />
      );
      break;
    case "PayRequest/_PayRequest": //کارشناس خرید -> ثبت اولیه
      componentToRender2 = (
        <PayRequestShowForWorkFlow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          definitionDateTime={definitionDateTime}
          definitionInvironment={definitionInvironment}
        />
        /*<PayRequestShow
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          isNew={false}
          setIsNew={() => {}}
          setIsEdit={() => {}}
          definitionDateTime={definitionDateTime}
          definitionInvironment={definitionInvironment}
          fromWorkFlow={true}
        />*/
      );
      break;
    default:
      componentToRender2 = null;
      break;
  }

  return (
    <div>
      {componentToRender1}
      {componentToRender2}
    </div>
  );
}
