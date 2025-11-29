import { useCallback, useEffect, useRef, useState } from "react";
import WorkflowMapHeader from "../../components/workflow/workflowMap/WorkflowMapHeader";
import { useGeneralContext } from "../../context/GeneralContext";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import { useWorkflowStore } from "../../store/workflowStore";
import { useWorkflow } from "../../hooks/useWorkflow";
import AutoComplet from "../../components/controls/AutoComplet";
import { DefaultOptionType, TableColumns } from "../../types/general";
import WorkFlowMap from "../../components/workflow/workflowMap/WorkFlowMap";
import { debounce } from "lodash";
import { convertToFarsiDigits } from "../../utilities/general";
import WorkflowMapBeforeAfters from "../../components/workflow/workflowMap/WorkflowMapBeforeAfters";
import { colors } from "../../utilities/color";
import { FaTrash } from "react-icons/fa";
import ModalForm from "../../components/layout/ModalForm";
import WorkflowMapBeforeAftersDel from "../../components/workflow/workflowMap/WorkflowMapBeforeAftersDel";

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
  } = useWorkflow();
  const { systemId } = useGeneralContext();
  const { setField } = useWorkflowStore();
  //const [isNew, setIsNew] = useState(false);
  const [newEdit, setNewEdit] = useState(-1); // 1 for new, 0 for edit
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeletedProcess, setIsDeletedProcess] = useState(false);
  const [search, setSearch] = useState("");
  const [processTitle, setProcessTitle] = useState<DefaultOptionType | null>(
    null
  );
  // this is the id of the selected row in the workFlowMap
  const [selectedId, setSelectedId] = useState<number>(-1);
  //for before and after
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

  //for api/WFMS/flowNosSearch?SystemId=4&Search=
  useEffect(() => {
    setField("systemIdFlowNosSearch", systemId);
    setField("pageFlowNosSearch", 1);
    setField("lastIdFlowNosSearch", 0);
    handleDebounceFilterChange("searchFlowNosSearch", search);
  }, [systemId, search]);

  //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  useEffect(() => {
    setField("flowMapIdBeforeAfters", selectedId);
    setField("systemIdBeforeAfters", systemId);
  }, [selectedId, systemId]);

  ///////////////////////////////////////////////////////
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setField(field, value);
    }, 500),
    [setField]
  );
  ////////////////////////////////////////////////////////

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
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
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
      />
      {/* search */}
      <div className="flex w-full justify-center items-center gap-2 text-sm px-2">
        <label htmlFor="processTitle" className="w-24 text-left">
          عنوان فرایند:
        </label>
        <AutoComplet
          options={workFlowFlowNosSearchResponse.data.result.map((b) => ({
            id: b.id,
            title: convertToFarsiDigits(b.text),
          }))}
          value={{
            id: processTitle?.id ?? "",
            title: convertToFarsiDigits(processTitle?.title ?? ""),
          }}
          handleChange={(_event, newValue) => {
            return setProcessTitle({
              id: (newValue as DefaultOptionType)?.id ?? "",
              title: convertToFarsiDigits(
                (newValue as DefaultOptionType)?.title ?? ""
              ),
            });
          }}
          setSearch={setSearch}
          showLabel={false}
          inputPadding="4px !important"
          backgroundColor="white"
          showClearIcon={false}
        />
      </div>
      <WorkFlowMap
        processTitle={processTitle as DefaultOptionType}
        workFlowMapResponse={workFlowFlowMapsResponse}
        isLoading={isLoadingWorkFlowFlowMaps || isRefetchingWorkFlowFlowMaps}
        setSelectedId={setSelectedId}
      />
      <div className="flex justify-between items-start h-full w-full gap-2 px-2">
        <WorkflowMapBeforeAfters
          columns={columnsBeforeAfter}
          flowMapBeforesAfters={
            workFlowFlowMapBeforeAftersResponse.data.result.flowMapBefores
          }
          title="مراحل قبل"
          borderColor={colors.green100}
          hoverBackgroundColor={colors.green300}
          backgroundColor={colors.green200}
        />
        <WorkflowMapBeforeAfters
          columns={columnsBeforeAfter}
          flowMapBeforesAfters={
            workFlowFlowMapBeforeAftersResponse.data.result.flowMapAfters
          }
          title="مراحل بعد"
          borderColor={colors.blue200}
          hoverBackgroundColor={colors.blue200}
          backgroundColor={colors.blue300}
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
