import { useEffect, useState } from "react";
import { WorkFlowFlowsResponse } from "../../types/workflow";
import { convertToFarsiDigits } from "../../utilities/general";
import { TableColumns } from "../../types/general";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";

type Props = {
  workFlowFlowsResponse: WorkFlowFlowsResponse;
  isLoadingWorkFlowFlows: boolean;
  refetchWorkFlowFlows: () => void;
};

const WorkFlowFlows = ({
  workFlowFlowsResponse,
  isLoadingWorkFlowFlows,
  refetchWorkFlowFlows,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "زمان",
      accessor: "dateTime",
      width: "10%",
    },
    {
      Header: "کاربر",
      accessor: "usrName",
      width: "10%",
    },
    {
      Header: "ارسال کننده",
      accessor: "fChartName",
      width: "30%",
    },
    {
      Header: "عنوان",
      accessor: "flowMapName",
      width: "20%",
    },
    {
      Header: "دریافت کننده",
      accessor: "tChartName",
      width: "10%",
    },
    {
      Header: "هامش",
      accessor: "dsc",
      width: "15%",
    },
  ];

  useEffect(() => {
    const temp = workFlowFlowsResponse.data.result.map((item, index) => {
      return {
        ...item,
        index: convertToFarsiDigits(index + 1),
        dateTime: convertToFarsiDigits(item.dateTim),
        usrName: convertToFarsiDigits(item.usrName),
        fChartName: convertToFarsiDigits(item.fChartName),
        flowMapName: convertToFarsiDigits(item.flowMapName),
        tChartName: convertToFarsiDigits(item.tChartName),
        dsc: convertToFarsiDigits(item.dsc),
      };
    });
    setData(temp);
  }, [workFlowFlowsResponse]);

  const { height } = useCalculateTableHeight();
  return (
    <div className="overflow-y-auto" style={{ height: height }}>
      <div className="flex px-4 items-center justify-end w-full bg-gray-200 rounded-md">
        <div
          className="flex flex-col items-center cursor-pointer border-2 hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => refetchWorkFlowFlows()}
        >
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </div>
      {isLoadingWorkFlowFlows ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : workFlowFlowsResponse.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {workFlowFlowsResponse.meta.message}
        </p>
      ) : (
        <div className="w-full mt-2">
          <TTable
            columns={columns}
            data={data}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            showToolTip={true}
          />
        </div>
      )}
    </div>
  );
};

export default WorkFlowFlows;
