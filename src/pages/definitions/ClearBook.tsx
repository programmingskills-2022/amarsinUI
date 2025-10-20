import PageTitle from "../../components/layout/PageTitle";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png"
import { useEffect } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { useClearBookStore } from "../../store/clearBookStore";
import { useClearBook } from "../../hooks/useClearBook";
import ClearBookShow from "../businessAccounting/operations/ClearBookShow";

export default function InventoryGoodList() {

  const { refetch} = useClearBook()
  const {setField}=useClearBookStore()
  const {systemId, yearId}=useGeneralContext()

  useEffect(()=>{
    setField("systemId",systemId)
    setField("yearId",yearId)
  },[])

  return (
    <div className="sm:h-[calc(100vh-72px)] w-full flex flex-col bg-gray-200 pt-2">
      {/* Top header */}
      <header className="flex items-center justify-between px-2 border-gray-300">
        <PageTitle />
        <div className="flex flex-col items-center cursor-pointer"
          onClick={()=>refetch()}>
          {/*onClick={()=>getWorkTable()}>*/}
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <ClearBookShow />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
