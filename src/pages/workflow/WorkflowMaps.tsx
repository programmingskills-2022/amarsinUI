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
import WorkflowMapBeforeAftersDel from "../../components/workflow/workflowMap/workflowMapBeforeAfters/WorkflowMapBeforeAftersDel";
import AutoCompleteSearch from "../../components/workflow/workflowMap/AutoCompleteSearch";

type Props = {
  definitionInvironment: DefinitionInvironment;
};

const WorkflowMaps = ({ definitionInvironment }: Props) => {
  const {
    workFlowFlowNosSearchResponse,
    workFlowFlowMapsResponse,
    isLoadingWorkFlowFlowMaps,
    isRefetchingWorkFlowFlowMaps,
    workFlowFlowMapBeforeAftersResponse,
    workFlowFlowMapCodeSearchResponse, //for نوع مقصد search
    workFlowFormSearchResponse, //for فرم 1/ فرم 2 search
    workFlowScriptSearchResponse, //for اسکریپت قبل اجرا search
    workFlowWebAPISearchResponse, //for ای پی آی search
    workFlowStatusSearchResponse, //for وضعیت search
    workFlowFlowMapsSearchResponse, //for عنوان فرایند search
    workFlowIfOperationFlowMapAdd, //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  } = useWorkflow();
  const { systemId } = useGeneralContext();
  const { setField } = useWorkflowStore();
  //const [isNew, setIsNew] = useState(false);
  const [newEdit, setNewEdit] = useState(-1); // 1 for new, 0 for edit
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeletedProcess, setIsDeletedProcess] = useState(false);
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
  const [isOpenAdd, setIsOpenAdd] = useState(false);
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
            console.log("updateToDeleted", row.original.id);
            setIsDeletedProcess(true);
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

  //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  useEffect(() => {
    setField("flowMapIdBeforeAfters", selectedId);
    setField("systemIdBeforeAfters", systemId);
  }, [selectedId, systemId]);

  const handleDelete = () => {
    setIsDelete(true);
    console.log(isDelete);
  };

  const handleEdit = () => {
    setIsEdit(true);
    console.log(isEdit);
  };

  const refetch = () => {
    console.log("refetch");
  };

  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2 text-gray-800`}
    >
      {/* Top header */}
      <WorkflowMapHeader
        setNewEdit={setNewEdit}
        newEdit={newEdit}
        onCloseNewEdit={() => setNewEdit(-1)} // 0 for close
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        refetch={refetch}
        definitionInvironment={definitionInvironment}
        processTitle={processTitle as DefaultOptionType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        workFlowFlowMapCodeSearchResponse={
          workFlowFlowMapCodeSearchResponse.data.result
        }//just search items for نوع مقصد search
        workFlowFormSearchResponse={workFlowFormSearchResponse.data.result}//just search items for فرم 1/ فرم 2 search
        workFlowScriptSearchResponse={workFlowScriptSearchResponse.data.result} //just search items for اسکریپت قبل اجرا search
        workFlowWebAPISearchResponse={workFlowWebAPISearchResponse.data.result} //just search items for ای پی آی search
        workFlowStatusSearchResponse={workFlowStatusSearchResponse.data.result} //just search items for وضعیت search
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
          setIsOpenAdd={setIsOpenAdd}
          isOpenAdd={isOpenAdd}
          flowMapId={selectedId}
          processTitle={processTitle as DefaultOptionType}
          workFlowIfOperationFlowMapAdd={workFlowIfOperationFlowMapAdd}
          isPrev={true}
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
          setIsOpenAdd={setIsOpenAdd}
          isOpenAdd={isOpenAdd}
          flowMapId={selectedId}
          processTitle={processTitle as DefaultOptionType}
          workFlowIfOperationFlowMapAdd={workFlowIfOperationFlowMapAdd}
          isPrev={false}
        />
        <ModalForm
          isOpen={isDeletedProcess}
          onClose={() => setIsDeletedProcess(false)}
          title="پیام"
          width="1/3"
        >
          <WorkflowMapBeforeAftersDel
            label="فرایند انتخاب شده، از لیست فرایندهای بعد حذف شود؟"
            onConfirm={() => setIsDeletedProcess(false)}
            onCancel={() => setIsDeletedProcess(false)}
          />
        </ModalForm>
      </div>
    </div>
  );
};

export default WorkflowMaps;
