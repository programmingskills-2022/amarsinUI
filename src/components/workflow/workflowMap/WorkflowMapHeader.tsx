import PageTitle from "../../layout/PageTitle";
import Add32 from "../../../assets/images/GrayThem/add32.png";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import Del24 from "../../../assets/images/GrayThem/del24.png";
import Edit24 from "../../../assets/images/GrayThem/edit24.png";
import { DefinitionInvironment } from "../../../types/definitionInvironment";
import WorkFlowMapReg from "./WorkFlowMapReg";
import ModalForm from "../../layout/ModalForm";
import { useState } from "react";
import { DefaultOptionType } from "../../../types/general";

type Props = {
  //setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  NewEdit: number; // 1 for new, 0 for edit
  setNewEdit: React.Dispatch<React.SetStateAction<number>>;
  onCloseNewEdit: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  refetch: () => void;
  definitionInvironment: DefinitionInvironment;
};

export type Process = {
  usrId: number
  id: number,
  name: string,
  flowNo: DefaultOptionType | null,
  fChart: DefaultOptionType | null,
  codeId: DefaultOptionType | null,
  tChart: DefaultOptionType | null,
  formNo1: DefaultOptionType | null,
  formNo2: DefaultOptionType | null,
  scriptBeforeId: DefaultOptionType | null,
  scriptId: DefaultOptionType | null,
  webAPIId: DefaultOptionType | null,
  scriptValidatorId: DefaultOptionType | null,
  statusId: DefaultOptionType | null,
  idempotencyKey: string,
}
const WorkflowMapHeader = ({
  //setIsNew,
  NewEdit,
  setNewEdit,
  onCloseNewEdit,
  handleDelete,
  handleEdit,
  refetch,
  definitionInvironment,
}: Props) => {
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
  return (
    <header className="flex flex-col gap-2 md:flex-row items-center justify-between border-gray-300 border-b pb-2">
      <PageTitle definitionInvironment={definitionInvironment} />
      <div className="flex px-4 items-center gap-4">
        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => {
            console.log("new");
            setNewEdit(1); // 1 for new
          }} // for new
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
          onClick={() => setNewEdit(0)} // 0 for edit
        >
          <img
            src={
              Edit24
            }
            alt="Edit24"
            className="w-6 h-6"
          />
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
        isOpen={NewEdit === 1 || NewEdit === 0} // 1 for new, 0 for edit
        onClose={() => setNewEdit(-1)} // 0 for close
        title={NewEdit === 1 ? "جدید" : "ویرایش"}
        width="1/2"
      >
        <WorkFlowMapReg NewEdit={NewEdit} process={process} setProcess={setProcess} />
      </ModalForm>
    </header>
  );
};

export default WorkflowMapHeader;
