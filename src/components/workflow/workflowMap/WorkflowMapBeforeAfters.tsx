import { useEffect, useState } from "react";
import { TableColumns } from "../../../types/general";
import Card from "../../controls/Card";
import TTable from "../../controls/TTable";
import { convertToFarsiDigits } from "../../../utilities/general";
import { FlowMapResult } from "../../../types/workflow";
import PlusIcon from "../../../assets/images/GrayThem/plus24.png";

type Props = {
  columns: TableColumns;
  flowMapBeforesAfters: FlowMapResult[];
  title: string;
  borderColor: string;
  hoverBackgroundColor: string;
  backgroundColor: string;
};

const WorkflowMapBeforeAfters = ({
  columns,
  flowMapBeforesAfters,
  title,
  borderColor,
  hoverBackgroundColor,
  backgroundColor,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  useEffect(() => {
    const tempData = flowMapBeforesAfters.map((item, index) => ({
      index: convertToFarsiDigits(index + 1),
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
          style={{ backgroundColor: backgroundColor, borderColor: borderColor}}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBackgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = backgroundColor;
          }}
        >
          <img
            src={PlusIcon}
            alt="PlusIcon"
            className="cursor-pointer"
            onClick={() => console.log("add row")}
          />
        </div>
      </Card>
      <div className="h-56 overflow-y-auto">
        <TTable
          columns={columns}
          data={data}
          setSelectedRowIndex={setSelectedRowIndex}
          selectedRowIndex={selectedRowIndex}
          changeRowSelectColor={true}
        />
      </div>
    </Card>
  );
};

export default WorkflowMapBeforeAfters;
