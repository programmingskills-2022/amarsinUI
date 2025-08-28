import OkForm from "../../assets/images/GrayThem/img24_3.png";
import CancelForm from "../../assets/images/GrayThem/img24_4.png";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { convertToFarsiDigits } from "../../utilities/general";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const WorkflowRowSelectHeader = ({ workFlowRowSelectResponse }: Props) => {
  const flowButtons = workFlowRowSelectResponse.flowButtons;
  const flowDescriptions = workFlowRowSelectResponse.flowDescriptions;

  return (
    <form className="p-1 gap-1 flex flex-col sm:flex-row bg-gray-200 border border-gray-300 rounded-md w-full">
      <div className="w-full sm:w-2/3 flex flex-col gap-1">
        <div className="flex w-full">
          <label className="text-sm">هامش:</label>
          <textarea className="p-1 text-sm border border-slate-300 rounded-md w-full" />
        </div>
        <div className="flex gap-1">
          {flowButtons.length > 0 &&
            flowButtons.map((fb) => {
              return (
                <div
                  className="flex justify-center p-1 text-sm border border-slate-300 rounded-md cursor-pointer hover:font-bold hover:bg-gray-100"
                  key={fb.id}
                >
                  <button
                    className="flex justify-center items-center gap-1"
                    title={String(fb.id)}
                  >
                    {fb.imageIndex === 3 ? (
                      <img src={OkForm} alt="ok" />
                    ) : (
                      <img src={CancelForm} alt="cancel" />
                    )}
                    {fb.name}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <div className="px-2 border text-gray-600 border-gray-300 rounded-md w-full md:w-1/3">
        {flowDescriptions.length > 0 &&
          flowDescriptions.map((fd,index) => {
            return (
              <p className="text-sm" key={index}>
                {convertToFarsiDigits(fd.usrName)}: {convertToFarsiDigits(fd.dsc)}
              </p>
            );
          })}
      </div>
    </form>
  );
};

export default WorkflowRowSelectHeader;
