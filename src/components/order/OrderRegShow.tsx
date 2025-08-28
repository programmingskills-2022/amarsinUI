import OrderRegShowHeader from "./OrderRegShowHeader";

import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useEffect, useState } from "react";
import OrderRegShowTable from "./OrderRegShowTable";
import { useOrderStore } from "../../store/orderStore";
import { useOrders } from "../../hooks/useOrders";
import { DefaultOptionType } from "../../types/general";


type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const OrderRegShow = ({
  workFlowRowSelectResponse,
}: Props) => {
  const canEditForm1Mst1= workFlowRowSelectResponse.workTableForms.canEditForm1Mst1
  const [cash1, setCash1] = useState(false);
  const [byPhone, setByPhone] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const [dsc, setDsc] = useState("");
  const [footerDescTxt, setFooterDescTxt] = useState("");
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const { setField: setOrderField } = useOrderStore();
  const {
    orderRegShowResponse,
    isLoadingOrderRegShow,
    isLoadingOrderReg,
    orderSalesPricesResponse,
    isLoadingOrderSalesPrices,
  } = useOrders();

  useEffect(() => {
    //console.log(workFlowRowSelectResponse?.workTableRow.formId);
    setOrderField("orderId", workFlowRowSelectResponse?.workTableRow.formId);
  }, [workFlowRowSelectResponse?.workTableRow.formId]);


  return (
    <div className="w-full flex flex-col">
      <OrderRegShowHeader
        orderRegShowResponse={orderRegShowResponse}
        cash1={cash1}
        setCash1={setCash1}
        byPhone={byPhone}
        setByPhone={setByPhone}
        urgency={urgency}
        setUrgency={setUrgency}
        customer={customer}
        setCustomer={setCustomer}
        canEditForm1Mst1={canEditForm1Mst1}
      />
      <p className="mt-2 px-2 text-sm">اقلام</p>
      <OrderRegShowTable
        orderRegShowResponse={orderRegShowResponse}
        isLoadingOrderRegShow={isLoadingOrderRegShow}
        orderSalesPricesResponse={orderSalesPricesResponse}
        isLoadingOrderSalesPrices={isLoadingOrderSalesPrices}
        isLoadingOrderReg={isLoadingOrderReg}
        dsc={dsc}
        setDsc={setDsc}
        cash1={cash1}
        byPhone={byPhone}
        urgency={urgency}
        footerDescTxt={footerDescTxt}
        setFooterDescTxt={setFooterDescTxt}
      />


    </div>
  );
};

export default OrderRegShow;
