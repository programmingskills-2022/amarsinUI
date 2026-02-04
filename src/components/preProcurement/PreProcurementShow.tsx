//  کارشناس تدارکات -> ثبت پیش فاکتور کالا خدمات
import { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { usePreProcurementStore } from "../../store/preProcurementStore";
import { usePreProcurement } from "../../hooks/usePreProcurement";
import PreProcurementShowHeader from "./PreProcurementShowHeader";
import ModalForm from "../layout/ModalForm";
import PreProcurementShowTable from "./PreProcurementShowTable";
import { v4 as uuidv4 } from "uuid";
import PreProcurementAttachment from "./PreProcurementAttachment";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: (refetchSwitch: boolean) => void;
};

const PreProcurementShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const {
    refetchPreProcurement,
    preProcurementResponse,
    isLoadingPreProcurement,
  } = usePreProcurement();
  const { setField, id } = usePreProcurementStore();
  const [showAttachment, setShowAttachment] = useState(false);
  const [cnt, setCnt] = useState(0);
  const [guid, setGuid] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [prefix, setPrefix] = useState("Procurement");
  // for refetchPreProcurement if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchPreProcurement();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  if (id!==workFlowRowSelectResponse.workTableRow.formId)
  {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }
  /*useEffect(() => {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId]);*/
  ////////////////////////////////////////////////////////for defining guid
  /*useEffect(() => {
        if (isNew) {
          setGuid(uuidv4());
        } else {
          setGuid(
            payRequestResponse.data.result.payRequest.payRequests?.[0]?.guid ?? ""
          );
        }
      }, [isNew, payRequestResponse.data.result.payRequest.payRequests?.[0]?.guid]);
    */
  useEffect(() => {
    setGuid(uuidv4());
    console.log("cnt", cnt);
  }, []);
  ////////////////////////////////////////////////////////
  //for initializing attachment fields for api/Attachment/list
  /*useEffect(() => {
    //console.log("give attachment fields");
    setAttachmentField("systemId", systemId);
    setAttachmentField("yearId", yearId);
    setAttachmentField("formId", workFlowRowSelectResponse.workTableRow.formId);
    setAttachmentField("prefix", "PreProcurement");
    setAttachmentField("GUID", guid);
  }, [workFlowRowSelectResponse.workTableRow.formId, systemId, yearId, guid]);
*/
  return (
    <div>
      <PreProcurementShowHeader
        preProcurementResponse={preProcurementResponse}
        canEditForm={false}
        setShowAttachment={setShowAttachment}
        guid={guid}
        formId={workFlowRowSelectResponse.workTableRow.formId}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <PreProcurementShowTable
        preProcurementResponse={preProcurementResponse}
        isLoadingPreProcurement={isLoadingPreProcurement}
        canEditForm={false}
      />
      <ModalForm
        isOpen={showAttachment}
        onClose={() => setShowAttachment(false)}
        title="ضمائم فرآیند خرید کالا/خدمت"
        width="1/2"
        height="90vh"
      >
        <PreProcurementAttachment
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formId={workFlowRowSelectResponse.workTableRow.formId} //PreProcurementId
          prefix={prefix} //form
          setPrefix={setPrefix}
          setCnt={setCnt}
          guid={guid}
        />
      </ModalForm>
    </div>
  );
};

export default PreProcurementShow;
