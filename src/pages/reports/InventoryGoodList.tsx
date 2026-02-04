import PageTitle from "../../components/layout/PageTitle";
import  InventoryGoodListForm, { columns } from "../../components/inventory/InventoryGoodListForm";
import ExcelExport from "../../utilities/ExcelExport";
import { useBrandStore } from "../../store/brandStore";
import { useEffect } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { useInventory } from "../../hooks/useInventory";
import { DefinitionInvironment } from "../../types/definitionInvironment";

type Props = {
  definitionInvironment: DefinitionInvironment;
};
export default function InventoryGoodList({ definitionInvironment }: Props) {

  const {inventoryList} = useInventory()
  const {setField}=useBrandStore()
  const {systemId}=useGeneralContext()

  useEffect(()=>{
    setField("accSystem",systemId)
    
  },[])

  return (
    <div className="sm:h-[calc(100vh-72px)] w-full flex flex-col bg-gray-200 pt-2">
      {/* Top header */}
      <header className="flex items-center justify-between border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <ExcelExport data={inventoryList.rpProviderInventories} headCells={columns}  />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <InventoryGoodListForm/>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
