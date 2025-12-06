import { useEffect, useState } from "react";
import { DefaultOptionType, TableColumns } from "../../../../types/general";
import Card from "../../../controls/Card";
import TTable from "../../../controls/TTable";
import { convertToFarsiDigits } from "../../../../utilities/general";
import { FlowMapResult, WorkFlowFlowMapsSearchResponse, WorkFlowIfOperationFlowMapAddRequest } from "../../../../types/workflow";
import PlusIcon from "../../../../assets/images/GrayThem/plus24.png";
import ModalForm from "../../../layout/ModalForm";
import WorkflowMapBeforeAfterAdd from "./WorkflowMapBeforeAfterAdd";

type Props = {
  columns: TableColumns;
  flowMapBeforesAfters: FlowMapResult[];
  title: string;
  borderColor: string;
  hoverBackgroundColor: string;
  backgroundColor: string;
  setIsOpenAdd: (isOpen: boolean) => void;
  isOpenAdd: boolean;
  workFlowFlowMapsSearchResponse: WorkFlowFlowMapsSearchResponse; //for عنوان فرایند search IN ADD MODAL
  flowMapId: number;
  processTitle: DefaultOptionType | null;
  workFlowIfOperationFlowMapAdd: (request: WorkFlowIfOperationFlowMapAddRequest) => void; //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  isPrev: boolean;
  setIsPrev: (isPrev: boolean) => void;
};

const WorkflowMapBeforeAfters = ({
  columns,
  flowMapBeforesAfters,
  title,
  borderColor,
  hoverBackgroundColor,
  backgroundColor,
  setIsOpenAdd,
  isOpenAdd,
  workFlowFlowMapsSearchResponse,
  flowMapId,
  processTitle,
  workFlowIfOperationFlowMapAdd,
  isPrev,
  setIsPrev,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  useEffect(() => {
    const tempData = flowMapBeforesAfters.map((item, index) => ({
      index: convertToFarsiDigits(index + 1),
      ifId: item.ifId,
      id: convertToFarsiDigits(item.id),
      name: convertToFarsiDigits(item.name),
      fChartName: convertToFarsiDigits(item.fChartName),
      tChartName: convertToFarsiDigits(item.tChartName),
      f1Title: convertToFarsiDigits(item.f1Title),
      f2Title: convertToFarsiDigits(item.f2Title),
      sbTitle: convertToFarsiDigits(item.sbTitle),
      sTitle: convertToFarsiDigits(item.sTitle),
      waTitle: convertToFarsiDigits(item.waTitle),
      svTitle: convertToFarsiDigits(item.svTitle),
    }));
    setData(tempData);
  }, [flowMapBeforesAfters]);

  const handleAdd = () => {
    if (title === "مراحل قبل") {
      setIsPrev(true);
    } else {
      setIsPrev(false);
    }
    setIsOpenAdd(true);
  };
  return (
    <Card className="flex flex-col px-2 w-1/2 h-56" borderColor="gray-300">
      <Card
        backgroundColor={backgroundColor}
        className="flex justify-between items-center w-full"
        borderColor={borderColor}
        padding="xs"
        rounded="none"
        shadow="none"
      >
        <p className="text-white text-center w-full">{title}</p>
        <div
          className="flex items-center justify-start border rounded-lg p-1 shadow-lg w-8 text-sm transition-colors duration-200"
          style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBackgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = backgroundColor;
          }}
          onClick={handleAdd}
        >
          <img
            src={PlusIcon}
            alt="PlusIcon"
            className="cursor-pointer"
            //onClick={() => console.log("add row")}
          />
        </div>
      </Card>
      { (<div className="h-56 overflow-y-auto">
        <TTable
          columns={columns}
          data={data}
          setSelectedRowIndex={setSelectedRowIndex}
          selectedRowIndex={selectedRowIndex}
          changeRowSelectColor={true}
        />
      </div >)}
      <ModalForm
        isOpen={isOpenAdd}
        onClose={() => setIsOpenAdd(false)}
        title="پیام"
        width="1/2"
      >
        <WorkflowMapBeforeAfterAdd
          workFlowFlowMapsSearchResponse={workFlowFlowMapsSearchResponse}
          setIsOpenAdd={setIsOpenAdd}
          flowMapId={flowMapId}
          processTitle={processTitle}
          workFlowIfOperationFlowMapAdd={workFlowIfOperationFlowMapAdd}
          isPrev={isPrev}
        />
      </ModalForm>
    </Card>
  );
};

export default WorkflowMapBeforeAfters;
