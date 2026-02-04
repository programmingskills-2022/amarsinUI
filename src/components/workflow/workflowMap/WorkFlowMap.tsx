import { useEffect, useState } from "react";
import { DefaultOptionType, TableColumns } from "../../../types/general";
import { WorkFlowFlowMapsResponse } from "../../../types/workflow";
import { convertToFarsiDigits } from "../../../utilities/general";
import Skeleton from "../../layout/Skeleton";
import TTable from "../../controls/TTable";
import { useWorkflowStore } from "../../../store/workflowStore";
import { useGeneralContext } from "../../../context/GeneralContext";
import Card from "../../controls/Card";

type Props = {
  workFlowMapResponse: WorkFlowFlowMapsResponse;
  isLoading: boolean;
  processTitle: DefaultOptionType;
  setSelectedId: React.Dispatch<React.SetStateAction<number>>;
};

const WorkFlowMap = ({
  workFlowMapResponse,
  isLoading,
  processTitle,
  setSelectedId,
}: Props) => {
  const { setField } = useWorkflowStore();
  const { systemId } = useGeneralContext();
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
    },
    {
      Header: "شناسه",
      accessor: "id",
      width: "6%",
    },
    {
      Header: "عنوان",
      accessor: "name",
      width: "27%",
    },
    {
      Header: "شرط سمت",
      accessor: "fChartName",
      width: "8%",
    },
    {
      Header: "واحد مقصد",
      accessor: "tChartName",
      width: "8%",
    },
    {
      Header: "فرم 1",
      accessor: "f1Title",
      width: "8%",
    },
    {
      Header: "فرم 2",
      accessor: "f2Title",
      width: "8%",
    },
    {
      Header: "اسکریپت قبل اجرا",
      accessor: "sbTitle",
      width: "8%",
    },
    {
      Header: "اسکریپت اجرا",
      accessor: "sTitle",
      width: "8%",
    },
    {
      Header: "ای پی آی",
      accessor: "waTitle",
      width: "8%",
    },
    {
      Header: "اسکریپت کنترل",
      accessor: "svTitle",
      width: "8%",
    },
  ];
  useEffect(() => {
    const tempData: any[] = workFlowMapResponse.data.result.map(
      (item, index) => ({
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
      })
    );
    setData(tempData);
    setSelectedId(workFlowMapResponse.data.result[0]?.id ?? -1);
  }, [workFlowMapResponse.data.result]);

  //for api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  useEffect(() => {
    if (processTitle) {
      setField("flowNoIdFlowMaps", processTitle?.id);
      setField("systemIdFlowMaps", systemId);
    }
  }, [processTitle, systemId]);
  return (
    <Card className="flex flex-col gap-2 px-2 mx-2 h-screen-minus-500" borderColor="gray-300">
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <div className="overflow-y-auto h-screen-minus-500">
          <TTable
            columns={columns}
            data={data}
            setSelectedRowIndex={setSelectedRowIndex}
            selectedRowIndex={selectedRowIndex}
            changeRowSelectColor={true}
            setSelectedId={setSelectedId}
          />
        </div>
      )}
    </Card>
  );
};

export default WorkFlowMap;
