import { useAuthStore } from "../store/authStore";
import { convertToFarsiDigits } from "../utilities/general";

const PageTitle = () => {
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data.result.initData;

  return (
    <div className="flex text-xs sm:text-sm px-2">
      <div className="flex flex-col justify-end items-end">
        <div >سیستم:</div>
        <div className="whitespace-nowrap">سال مالی:</div>
      </div>
      <div className="flex flex-col items-start justify-center font-semibold px-2">
        <div >{initData?.systemTitle}</div>
        <div >{convertToFarsiDigits(initData?.yearTitle)}</div>
      </div>
    </div>
    
  )
}
export default PageTitle;
