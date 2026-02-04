import PageTitle from "../../layout/PageTitle";
import Add32 from "../../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import Del24 from "../../../assets/images/GrayThem/del24.png";
import Edit24 from "../../../assets/images/GrayThem/edit24.png";
import { DefinitionInvironment } from "../../../types/definitionInvironment";
import WorkFlowMapReg from "./workflowMapReg/WorkFlowMapReg";
import ModalForm from "../../layout/ModalForm";
import { useEffect, useState } from "react";
import { DefaultOptionType, SearchItem } from "../../../types/general";
import {
  WorkFlowFlowMapLoadResponse,
  WorkFlowMapSaveRequest,
  WorkFlowMapSaveResponse,
} from "../../../types/workflow";
import { useWorkflowStore } from "../../../store/workflowStore";
import ModalMessage from "../../layout/ModalMessage";

type Props = {
  //setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  newEdit: number; // 1 for new, 0 for edit
  setNewEdit: React.Dispatch<React.SetStateAction<number>>;
  handleDelete: () => void;
  //handleEdit: () => void;
  refetch: () => void;
  definitionInvironment: DefinitionInvironment;
  processTitle: DefaultOptionType | null;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workFlowFlowMapCodeSearchResponse: SearchItem[]; //for نوع مقصد search
  workFlowFormSearchResponse: SearchItem[]; //for فرم 1/ فرم 2 search
  workFlowScriptSearchResponse: SearchItem[]; //for اسکریپت قبل اجرا search
  workFlowWebAPISearchResponse: SearchItem[]; //for ای پی آی search
  workFlowStatusSearchResponse: SearchItem[]; //for وضعیت search
  workFlowFlowMapLoadResponse: WorkFlowFlowMapLoadResponse; //for load edit data : /api/WFMS/flowMapLoad/205000020
  selectedId: number;
  workFlowFlowMapSave: (request: WorkFlowMapSaveRequest) => void; //for api/WFMS/flowMapSave
  isLoadingWorkFlowMapSave: boolean;
  workFlowMapSaveResponse: WorkFlowMapSaveResponse;
};

export type Process = {
  usrId: number;
  id: number;
  name: string;
  flowNo: DefaultOptionType | null;
  fChart: DefaultOptionType | null; //شرط سمت
  codeId: DefaultOptionType | null; //نوع مقصد
  tChart: DefaultOptionType | null; //واحد مقصد
  formNo1: DefaultOptionType | null; //فرم 1
  formNo2: DefaultOptionType | null; //فرم 2
  scriptBeforeId: DefaultOptionType | null; //اسکریپت قبلی
  scriptId: DefaultOptionType | null; //اسکریپت
  webAPIId: DefaultOptionType | null;
  scriptValidatorId: DefaultOptionType | null;
  statusId: DefaultOptionType | null;
  idempotencyKey: string;
};
const WorkflowMapHeader = ({
  newEdit,
  setNewEdit,
  handleDelete,
  refetch,
  definitionInvironment,
  processTitle,
  isModalOpen,
  setIsModalOpen,
  workFlowFlowMapCodeSearchResponse,
  workFlowFormSearchResponse,
  workFlowScriptSearchResponse,
  workFlowWebAPISearchResponse,
  workFlowStatusSearchResponse,
  workFlowFlowMapLoadResponse,
  selectedId,
  workFlowFlowMapSave,
  isLoadingWorkFlowMapSave,
  workFlowMapSaveResponse,
}: Props) => {
  const { setField } = useWorkflowStore();
  const [process, setProcess] = useState<Process>({
    usrId: 0,
    id: 0,
    name: "",
    flowNo: null,
    fChart: null,
    codeId: null,
    tChart: null,
    formNo1: null,
    formNo2: null,
    scriptBeforeId: null,
    scriptId: null,
    webAPIId: null,
    scriptValidatorId: null,
    statusId: null,
    idempotencyKey: "",
  } as Process);
  //for show modal message after save api/WFMS/flowMapSave
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpenSave) {
      timeoutId = setTimeout(() => {
        setIsModalOpenSave(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpenSave]);
  /////////////////////////////////////////////////////////////////
  const handleNew = () => {
    console.log(processTitle);
    if (processTitle !== null) {
      setIsModalOpen(false);
      //setField("idFlowMapLoad", -1);
      setNewEdit(1); // 1 for new
    } else {
      setIsModalOpen(true);
    } // 1 for new}
  };
  //for load edit data : /api/WFMS/flowMapLoad/205000020
  const handleEdit = () => {
    console.log(selectedId, "selectedId");
    setField("idFlowMapLoad", selectedId);
    setField("idFlowMapLoadTrigger", Date.now());
    setNewEdit(0); // 0 for edit
  };

  return (
    <header className="flex flex-col gap-2 md:flex-row items-center justify-between border-gray-300 border-b pb-2">
      <PageTitle definitionInvironment={definitionInvironment} />
      <div className="flex px-4 items-center gap-4">
        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={handleNew} // for new
        >
          <img src={Add32} alt="Add32" className="w-6 h-6" />
          <p className="text-xs">جدید</p>
        </div>
        <div
          className={`flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 cursor-pointer
          }`}
          onClick={() => handleDelete()}
        >
          <img src={Del24} alt="Del24" className="w-6 h-6" />
          <p className="text-xs">حذف</p>
        </div>
        <div
          className={`flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 cursor-pointer`}
          onClick={handleEdit} // 0 for edit
        >
          <img src={Edit24} alt="Edit24" className="w-6 h-6" />
          <p className="text-xs">ویرایش</p>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => refetch()}
        >
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </div>
      <ModalForm
        isOpen={newEdit === 1 || newEdit === 0} // 1 for new, 0 for edit
        onClose={() => setNewEdit(-1)} // 0 for close
        title={newEdit === 1 ? "جدید" : "ویرایش"}
        width="1/2"
      >
        <WorkFlowMapReg
          newEdit={newEdit}
          setNewEdit={setNewEdit}
          processTitle={processTitle} // to pass to formNo1 and formNo2 search in AutoCompleteSearch
          process={process}
          setProcess={setProcess}
          workFlowFlowMapCodeSearchResponse={workFlowFlowMapCodeSearchResponse} //just search items for codeId
          workFlowFormSearchResponse={workFlowFormSearchResponse} //just search items for formNo1 and formNo2
          workFlowScriptSearchResponse={workFlowScriptSearchResponse} //just search items for scriptBeforeId
          workFlowWebAPISearchResponse={workFlowWebAPISearchResponse} //just search items for webAPIId
          workFlowStatusSearchResponse={workFlowStatusSearchResponse} //just search items for statusId
          workFlowFlowMapLoadResponse={workFlowFlowMapLoadResponse} //for load edit data : /api/WFMS/flowMapLoad/205000020
          workFlowFlowMapSave={workFlowFlowMapSave} //for api/WFMS/flowMapSave
          setIsModalOpenSave={setIsModalOpenSave} //for show modal message after save api/WFMS/flowMapSave
        />
      </ModalForm>
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="پیام"
        width="1/4"
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="w-full text-right">عنوان فرایند انتخاب نشده!</p>
          <div className="w-full flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-20 hover:bg-green-600 border-green-600 border-2  text-green-600 hover:text-white px-2 py-1 rounded-md"
            >
              تایید
            </button>
          </div>
        </div>
      </ModalForm>
      {!isLoadingWorkFlowMapSave && (
        <ModalMessage
          isOpen={isModalOpenSave}
          backgroundColor={
            workFlowMapSaveResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            workFlowMapSaveResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            workFlowMapSaveResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpenSave(false)}
          message={workFlowMapSaveResponse.meta.message ?? ""}
          visibleButton={false}
        />
      )}
    </header>
  );
};

export default WorkflowMapHeader;
