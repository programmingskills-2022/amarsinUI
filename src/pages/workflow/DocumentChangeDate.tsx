import {  useState } from "react";
import Button from "../../components/controls/Button";
import PersianDatePicker from "../../components/controls/PersianDatePicker";
import { convertToPersianDate } from "../../utilities/general";
import {
  WorkFlowDoFlowRequest,
  WorkflowResponse,
  WorkflowRowSelectResponse,
} from "../../types/workflow";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useGeneralContext } from "../../context/GeneralContext";
//import ModalMessage from "../../components/layout/ModalMessage";
import { useWorkflowStore } from "../../store/workflowStore";

type Props = {
  doFlow: UseMutateAsyncFunction<any, Error, WorkFlowDoFlowRequest, unknown>;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  flowMapId: number;
  //isLoadingdoFlow: boolean;
  //workFlowDoFlowResponse: WorkFlowDoFlowResponse;
  //refetchWorkTable: () => void;
  //refetchWorkTableRowSelect: () => void;
  dsc: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; //to show DocumentChangeDate form or not
  setIsModalOpenMessage: React.Dispatch<React.SetStateAction<boolean>>; //to show DocumentChangeDate form or not
  currentWorkTableRowId: number;
  setWorkFlowResponse: React.Dispatch<React.SetStateAction<WorkflowResponse>>;
  //setWorkFlowRowSelectResponse: React.Dispatch<React.SetStateAction<WorkflowRowSelectResponse>>;
};

const DocumentChangeDate = ({
  doFlow,
  workFlowRowSelectResponse,
  flowMapId,
  //isLoadingdoFlow,
  //workFlowDoFlowResponse,
  //refetchWorkTable,
  //refetchWorkTableRowSelect,
  dsc,
  setIsModalOpen,
  setIsModalOpenMessage,
  currentWorkTableRowId,
  setWorkFlowResponse,
}: //setWorkFlowRowSelectResponse
Props) => {
  const { setField: setWorkFlowField } = useWorkflowStore();
  const { chartId, systemId, yearId } = useGeneralContext();
  //const [isModalOpenMessage, setIsModalOpenMessage] = useState(false);// to show modal messages
  const [date, setDate] = useState<Date | null>(new Date());
  const {
    page: pageNumber,
    dateTime,
    code,
    cost,
    name,
    flowMapId: flowMapIdStore,
    dsc: dscStore,
    title,
  } = useWorkflowStore();
  /////////////////////////////////////////////////////////////////
  /*useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpenMessage) {
      timeoutId = setTimeout(() => {
        console.log("come to setTimeout,", isModalOpenMessage);
        setIsModalOpenMessage(false); //close ModalMessage
        setIsModalOpen(false); // close DocumentChangeDate form
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpenMessage]);*/
  ////////////////////////////////////////////////////////////
  const handleDoFlow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    date: string
  ) => {
    e.preventDefault();
    //setIsModalOpen(false);
    setIsModalOpen(true);
    console.log(workFlowRowSelectResponse);
    const request: WorkFlowDoFlowRequest = {
      chartId,
      systemId,
      yearId,
      workTableId: workFlowRowSelectResponse.workTableRow.id,
      flowMapId,
      formId: workFlowRowSelectResponse.workTableRow.formId,
      flowNo: 0,
      flowId: workFlowRowSelectResponse.workTableRow.wfmS_FlowId,
      dsc,
      date,
      params: `{\"Date\":\"${date}\"}`,
      workQueueResult: true,
      idempotencyKey: uuidv4(),
      workTableParam: {
        flowMapId: flowMapIdStore ?? -1,
        title: title ?? "",
        dateTime: dateTime ?? "",
        code: code ?? "",
        cost: cost ?? "",
        name: name ?? "",
        dsc: dscStore ?? "",
        page: pageNumber ?? 1,
      },
    };
    console.log(request, "request");
    try {
      const response = await doFlow(request);
      setIsModalOpenMessage(true); // to show message
      if (response.meta.errorCode <= 0) {
        setWorkFlowResponse(response.data.result.workTable); // to refresh parent table in workflowForm
      } 
      if (
        currentWorkTableRowId ===
          response.data.result.workTableRowSelect.workTableRow.id &&
        response.meta.errorCode <= 0
      ){
        console.log(response.data.result.workTableRowSelect.workTableRow.id,"response.data.result.workTableRowSelect.workTableRow.id")
        setWorkFlowField("workTableIdTrigger", Date.now());
      }
      //refetchWorkTableRowSelect();
      //setWorkFlowResponse(response.data.result.workTable);
      //setWorkFlowRowSelectResponse(response.data.result.workTableRowSelect)
      console.log(response, "response for doFlow");
    } catch (error) {
    } finally {
      console.log("succeed");
      //setWorkFlowField("isPreventingRefetchWorkflow", false);
    }
  };
  return (
    <>
      <div className="w-full flex flex-col justify-end items-end gap-2">
        <div className="w-full flex items-center">
          <label className="p-1 w-32 text-left"> تاریخ:</label>
          <PersianDatePicker
            name="fDate"
            label="از:"
            value={date}
            onChange={(event) => setDate(event.target.value as Date | null)}
          />
        </div>
        <Button
          text="ثبت"
          onClick={(e) =>
            handleDoFlow(e, date ? convertToPersianDate(date) : "")
          }
          variant="shadow-lg w-48"
        />
      </div>
      {/*{isModalOpenMessage && <p>dhsjdhj</p>}*/}
      {/*!isLoadingdoFlow && (
        <ModalMessage
          isOpen={isModalOpenMessage}
          onClose={() => {
            setIsModalOpenMessage(false);
            setIsModalOpen(false);
          }}
          backgroundColor={
            workFlowDoFlowResponse?.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            workFlowDoFlowResponse?.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          color="text-white"
          message={workFlowDoFlowResponse?.meta.message || ""}
          visibleButton={false}
        />
      )*/}
    </>
  );
};

export default DocumentChangeDate;
