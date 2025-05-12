import { useEffect } from "react";
import Employees from "../components/employee/Employees";
import PageTitle from "../components/PageTitle";
import { useBrandStore } from "../store/brandStore";
import { useAuthStore } from "../store/authStore";
import { useBrand } from "../hooks/useBrands";

export default function Dashboard() {

  const {getBrands} = useBrand()
  const {setField} = useBrandStore()
  const {authApiResponse}=useAuthStore()

  const accSystem= authApiResponse?.data.result.initData.systemId
  useEffect(()=>{
    setField("accSystem",accSystem)
    getBrands()
  },[accSystem])

  return (
    <div className="h-[calc(100vh-72px)] overflow-y-auto flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex items-center justify-between border-b-2 border-gray-300">
        <PageTitle />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center">
        <Employees />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
