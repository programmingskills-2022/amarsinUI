import PageTitle from "../components/layout/PageTitle";
import Add32 from "../assets/images/GrayThem/add32.png"
import FormFlow24 from "../assets/images/GrayThem/FormFlow24.png"
import SentForm24 from "../assets/images/GrayThem/SentForm24.png"
import Refresh32 from "../assets/images/GrayThem/rfrsh32.png"
//import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowForm from "../components/workflow/WorkflowForm";


export default function Workflow() {
//const {getWorkTable}=useWorkflow()

  return (
    <div className="h-[calc(100vh-72px)] overflow-y-scroll flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-2">
        <PageTitle />
        <div className="flex px-4 items-center gap-4">
          <div className="flex flex-col items-center cursor-pointer">
            <img src={Add32} alt="Add32" className="w-6 h-6" />
            <p className="text-xs">جدید</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <img src={SentForm24} alt="SentForm24" className="w-6 h-6" />
            <p className="text-xs">ارسال شده ها</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <img src={FormFlow24} alt="FormFlow24" className="w-6 h-6" />
            <p className="text-xs">گردش</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer"
          onClick={()=>console.log("object")}>
          {/*onClick={()=>getWorkTable()}>*/}
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
        </div>
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <WorkflowForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
