import WorkflowRowSelectHeader from "./WorkflowRowSelectHeader";
import {Skeleton} from "@mui/material"
import { WorkflowRowSelectResponse } from "../../types/workflow";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  isLoading: boolean;
  error: Error | null;
};

const WorkflowRowSelect = ({ workFlowRowSelectResponse, isLoading, error }: Props) => {
  if (error) return <div>Error: {error.message} </div>;
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center">{<Skeleton/>}</div>
      ) : workFlowRowSelectResponse.err !== 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {workFlowRowSelectResponse.msg}
        </p>
      ) : (
        <div className="w-full mt-2">
          <WorkflowRowSelectHeader workFlowRowSelectResponse={workFlowRowSelectResponse} />
        </div>
      )}
    </div>
  );
};

export default WorkflowRowSelect;
