import { useEffect, useState } from "react";
import WorkflowMapHeader from "../../components/workflow/workflowMap/WorkflowMapHeader";
import { useGeneralContext } from "../../context/GeneralContext";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import { useWorkflowStore } from "../../store/workflowStore";
import { useWorkflow } from "../../hooks/useWorkflow";
import { DefaultOptionType, TableColumns } from "../../types/general";
import WorkFlowMap from "../../components/workflow/workflowMap/WorkFlowMap";
import WorkflowMapBeforeAfters from "../../components/workflow/workflowMap/workflowMapBeforeAfters/WorkflowMapBeforeAfters";
import { colors } from "../../utilities/color";
import { FaTrash } from "react-icons/fa";
import ModalForm from "../../components/layout/ModalForm";
import AutoCompleteSearch from "../../components/controls/AutoCompleteSearch";
import { v4 as uuidv4 } from "uuid";
import {
  WorkFlowFlowMapBeforeAfterDeleteRequest,
  WorkFlowFlowMapDeleteRequest,
} from "../../types/workflow";
import ModalMessage from "../../components/layout/ModalMessage";
import ConfirmCancelModalForm from "../../components/controls/ConfirmCancelModalForm";

type Props = {
  definitionInvironment: DefinitionInvironment;
};

const WorkflowMaps = ({ definitionInvironment }: Props) => {
  const {
    workFlowFlowNosSearchResponse,
    workFlowFlowMapsResponse,
    isLoadingWorkFlowFlowMaps,
    isRefetchingWorkFlowFlowMaps,
    refetchWorkFlowFlowMaps,
    workFlowFlowMapBeforeAftersResponse,
    refetchWorkFlowFlowMapBeforeAfters,
    workFlowFlowMapCodeSearchResponse, //for نوع مقصد search
    workFlowFormSearchResponse, //for فرم 1/ فرم 2 search
    workFlowScriptSearchResponse, //for اسکریپت قبل اجرا search
    workFlowWebAPISearchResponse, //for ای پی آی search
    workFlowStatusSearchResponse, //for وضعیت search
    workFlowFlowMapsSearchResponse, //for عنوان فرایند search
    workFlowIfOperationFlowMapAdd, //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
    workFlowFlowMapBeforeAfterDelete, //for api/WFMS/flowMapBeforeAfter/734
    workFlowFlowMapDelete, //for api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
    isLoadingWorkFlowFlowMapDelete,
    workFlowFlowMapDeleteResponse, //for delete process api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
    workFlowFlowMapLoadResponse, //for load edit data : /api/WFMS/flowMapLoad/205000020
    workFlowFlowMapSave, //for api/WFMS/flowMapSave
    isLoadingWorkFlowMapSave, //for api/WFMS/flowMapSave
    workFlowFlowMapSaveResponse, //for api/WFMS/flowMapSave
  } = useWorkflow();
  const { systemId } = useGeneralContext();
  const { setField } = useWorkflowStore();
  //const [isNew, setIsNew] = useState(false);
  const [newEdit, setNewEdit] = useState(-1); // 1 for new, 0 for edit
  const [isDeletedProcess, setIsDeletedProcess] = useState(false);
  //to show message if process is deleted
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  //to show message if no process title is selected
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processTitle, setProcessTitle] = useState<DefaultOptionType | null>(
    null
  );
  //for isEntered
  const [isProcessTitleEntered, setIsProcessTitleEntered] = useState(false);
  // this is the id of the selected row in the workFlowMap
  const [selectedId, setSelectedId] = useState<number>(-1);
  //for before and after
  const [isOpenAddBefore, setIsOpenAddBefore] = useState(false);
  const [isOpenAddAfter, setIsOpenAddAfter] = useState(false);
  const [isPrev, setIsPrev] = useState(true);
  const [ifIdToDelete, setIfIdToDelete] = useState<number>(-1);
  const [isDeletedBeforeAfter, setIsDeletedBeforeAfter] = useState(false);
  const columnsBeforeAfter: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "شناسه",
      accessor: "id",
      width: "15%",
    },
    {
      Header: "عنوان",
      accessor: "name",
      width: "30%",
    },
    {
      Header: "شرط سمت",
      accessor: "fChartName",
      width: "23%",
    },
    {
      Header: "واحد مقصد",
      accessor: "tChartName",
      width: "23%",
    },
    {
      Header: " ",
      accessor: "del",
      width: "4%",
      Cell: ({ row }: any) => (
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIfIdToDelete(row.original.ifId);
            setIsDeletedBeforeAfter(true);
          }}
        >
          <FaTrash
            style={{ width: "16px", height: "16px", color: colors.red200 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.red300;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.red200;
            }}
          />
        </button>
      ),
    },
  ];

  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpenDelete) {
      timeoutId = setTimeout(() => {
        setIsModalOpenDelete(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpenDelete]);

  //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  useEffect(() => {
    console.log("selectedId", selectedId);
    setField("flowMapIdBeforeAfters", selectedId);
    setField("systemIdBeforeAfters", systemId);
  }, [selectedId, systemId]);
  // refetch after delete process
  useEffect(() => {
    if (
      !isLoadingWorkFlowFlowMapDelete &&
      workFlowFlowMapDeleteResponse.meta.errorCode <= 0
    ) {
      setField("flowNoIdFlowMaps", processTitle?.id ?? -1);
      setField("systemIdFlowMaps", systemId);
      refetch();
    }
  }, [
    isLoadingWorkFlowFlowMapDelete,
    workFlowFlowMapDeleteResponse.meta.errorCode,
  ]);
  //refetch after save process
  useEffect(() => {
    if (
      !isLoadingWorkFlowMapSave &&
      workFlowFlowMapSaveResponse.meta.errorCode <= 0
    ) {
      setField("flowNoIdFlowMaps", processTitle?.id ?? -1);
      setField("systemIdFlowMaps", systemId);
      refetch();
    }
  }, [isLoadingWorkFlowMapSave, workFlowFlowMapSaveResponse.meta.errorCode]);
  //handle delete process
  const handleDelete = () => {
    setIsDeletedProcess(true);
  };

  const handleDeleteConfirmProcess = () => {
    const request: WorkFlowFlowMapDeleteRequest = {
      flowMapIdDelete: selectedId,
      systemIdDelete: systemId,
      idempotencyKeyDelete: uuidv4(),
    };
    console.log(request, "request");
    workFlowFlowMapDelete(request);
    setIsDeletedProcess(false);
    setIsModalOpenDelete(true);
  };

  const refetch = () => {
    console.log("refetch");
    refetchWorkFlowFlowMaps();
    refetchWorkFlowFlowMapBeforeAfters();
  };
  // to delete before after
  const handleDeleteConfirmBeforeAfter = () => {
    const request: WorkFlowFlowMapBeforeAfterDeleteRequest = {
      flowMapIdBeforeAfterDelete: ifIdToDelete,
      idempotencyKey: crypto.randomUUID(),
    };
    console.log(request, "request");
    workFlowFlowMapBeforeAfterDelete(request);
    setIsDeletedBeforeAfter(false);
  };

  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2 text-gray-800`}
    >
      {/* Top header */}
      <WorkflowMapHeader
        setNewEdit={setNewEdit}
        newEdit={newEdit}
        handleDelete={handleDelete}
        refetch={refetch}
        definitionInvironment={definitionInvironment}
        processTitle={processTitle as DefaultOptionType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        workFlowFlowMapCodeSearchResponse={
          workFlowFlowMapCodeSearchResponse.data.result
        } //just search items for نوع مقصد search
        workFlowFormSearchResponse={workFlowFormSearchResponse.data.result} //just search items for فرم 1/ فرم 2 search
        workFlowScriptSearchResponse={workFlowScriptSearchResponse.data.result} //just search items for اسکریپت قبل اجرا search
        workFlowWebAPISearchResponse={workFlowWebAPISearchResponse.data.result} //just search items for ای پی آی search
        workFlowStatusSearchResponse={workFlowStatusSearchResponse.data.result} //just search items for وضعیت search
        workFlowFlowMapLoadResponse={workFlowFlowMapLoadResponse} //for load edit data : /api/WFMS/flowMapLoad/205000020
        selectedId={selectedId}
        workFlowFlowMapSave={workFlowFlowMapSave} //for api/WFMS/flowMapSave
        isLoadingWorkFlowMapSave={isLoadingWorkFlowMapSave} //for api/WFMS/flowMapSave
        workFlowMapSaveResponse={workFlowFlowMapSaveResponse} //for api/WFMS/flowMapSave
      />
      {/* search process title*/}
      <AutoCompleteSearch
        label="عنوان فرایند"
        setField={setField}
        fieldValues={[
          { field: "systemIdFlowNosSearch", value: systemId },
          { field: "pageFlowNosSearch", value: 1 },
          { field: "lastIdFlowNosSearch", value: 0 },
        ]}
        fieldSearch="searchFlowNosSearch"
        selectedOption={processTitle as DefaultOptionType}
        setSelectedOption={(processTitle) =>
          setProcessTitle(processTitle as DefaultOptionType)
        }
        options={workFlowFlowNosSearchResponse.data.result} //just search items for process title
        isEntered={isProcessTitleEntered}
        setIsEntered={setIsProcessTitleEntered}
      />
      <WorkFlowMap
        processTitle={processTitle as DefaultOptionType}
        workFlowMapResponse={workFlowFlowMapsResponse}
        isLoading={isLoadingWorkFlowFlowMaps || isRefetchingWorkFlowFlowMaps}
        setSelectedId={setSelectedId}
      />
      <div className="flex justify-between items-start h-full w-full gap-2 px-2">
        <WorkflowMapBeforeAfters
          workFlowFlowMapsSearchResponse={workFlowFlowMapsSearchResponse}
          columns={columnsBeforeAfter}
          flowMapBeforesAfters={
            workFlowFlowMapBeforeAftersResponse.data.result.flowMapBefores
          }
          title="مراحل قبل"
          borderColor={colors.green100}
          hoverBackgroundColor={colors.green300}
          backgroundColor={colors.green200}
          setIsOpenAdd={setIsOpenAddBefore}
          isOpenAdd={isOpenAddBefore}
          flowMapId={selectedId}
          processTitle={processTitle as DefaultOptionType}
          workFlowIfOperationFlowMapAdd={workFlowIfOperationFlowMapAdd}
          isPrev={isPrev}
          setIsPrev={setIsPrev}
        />
        <WorkflowMapBeforeAfters
          workFlowFlowMapsSearchResponse={workFlowFlowMapsSearchResponse}
          columns={columnsBeforeAfter}
          flowMapBeforesAfters={
            workFlowFlowMapBeforeAftersResponse.data.result.flowMapAfters
          }
          title="مراحل بعد"
          borderColor={colors.blue200}
          hoverBackgroundColor={colors.blue200}
          backgroundColor={colors.blue300}
          setIsOpenAdd={setIsOpenAddAfter}
          isOpenAdd={isOpenAddAfter}
          flowMapId={selectedId}
          processTitle={processTitle as DefaultOptionType}
          workFlowIfOperationFlowMapAdd={workFlowIfOperationFlowMapAdd}
          isPrev={isPrev}
          setIsPrev={setIsPrev}
        />
        <ModalForm
          isOpen={isDeletedBeforeAfter}
          onClose={() => setIsDeletedBeforeAfter(false)}
          title="پیام"
          width="1/3"
        >
          <ConfirmCancelModalForm
            label="فرایند انتخاب شده، از لیست فرایندهای بعد حذف شود؟"
            onConfirm={handleDeleteConfirmBeforeAfter}
            onCancel={() => setIsDeletedBeforeAfter(false)}
          />
        </ModalForm>
        <ModalForm
          isOpen={isDeletedProcess}
          onClose={() => setIsDeletedProcess(false)}
          title="پیام"
          width="1/3"
        >
          <ConfirmCancelModalForm
            label="سطر فرایند انتخاب شده، حذف شود؟"
            onConfirm={handleDeleteConfirmProcess}
            onCancel={() => setIsDeletedProcess(false)}
          />
        </ModalForm>
        {!isLoadingWorkFlowFlowMapDelete && (
          <ModalMessage
            isOpen={isModalOpenDelete}
            backgroundColor={
              workFlowFlowMapDeleteResponse.meta.errorCode <= 0
                ? "bg-green-200"
                : "bg-red-200"
            }
            bgColorButton={
              workFlowFlowMapDeleteResponse.meta.errorCode <= 0
                ? "bg-green-500"
                : "bg-red-500"
            }
            bgColorButtonHover={
              workFlowFlowMapDeleteResponse.meta.errorCode <= 0
                ? "bg-green-600"
                : "bg-red-600"
            }
            color="text-white"
            onClose={() => setIsModalOpenDelete(false)}
            message={workFlowFlowMapDeleteResponse.meta.message}
            visibleButton={false}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowMaps;
