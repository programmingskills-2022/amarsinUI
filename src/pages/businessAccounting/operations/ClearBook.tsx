//خسابداری->حسابداری بازرگانی->عملیات-> کلیربوک
import PageTitle from "../../../components/layout/PageTitle";
import Refresh32 from "../../../assets/images/GrayThem/rfrsh32.png";
import { useEffect } from "react";
import { useGeneralContext } from "../../../context/GeneralContext";
import { useClearBookStore } from "../../../store/clearBookStore";
import { useClearBook } from "../../../hooks/useClearBook";
import ClearBookShow from "../../../components/clearbook/ClearBookShow";
import { DefinitionInvironment } from "../../../types/definitionInvironment";

type Props = {
  definitionInvironment: DefinitionInvironment;
};
export default function InventoryGoodList({ definitionInvironment }: Props) {
  const {
    clearBookProducts,
    error,
    isLoading,
    refetch,
    setProduct,
    isFetching,
  } = useClearBook();
  const { setField } = useClearBookStore();
  const { systemId, yearId } = useGeneralContext();

  useEffect(() => {
    setField("systemId", systemId);
    setField("yearId", yearId);
  }, []);

  return (
    <div className="sm:h-[calc(100vh-72px)] w-full flex flex-col bg-gray-200 pt-2">
      {/* Top header */}
      <header className="flex items-center justify-between px-2 border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => refetch()}
        >
          {/*onClick={()=>getWorkTable()}>*/}
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <ClearBookShow
          isFetching={isFetching}
          clearBookProducts={clearBookProducts}
          error={error}
          isLoading={isLoading}
          refetch={refetch}
          setProduct={setProduct}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
