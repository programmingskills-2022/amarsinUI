import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { convertToFarsiDigits } from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import { useGeneralContext } from "../../context/GeneralContext";
import { useDefinitionInvironment } from "../../hooks/useDefinitionInvironment";
import { DefaultOptionType } from "../../types/general";



const PageTitle = () => {
  const { setSystemId, setYearId } = useGeneralContext();
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data.result.initData;
  const { definitionInvironment } = useDefinitionInvironment();

  const [search, setSearch] = useState<string>("");
  const [system, setSystem] = useState<{ id: number; title: string } | null>({
    id: initData?.systemId ?? 0,
    title: convertToFarsiDigits(initData?.systemTitle) ?? "",
  });
  const [year, setYear] = useState<{ id: number; title: string } | null>({
    id: initData?.yearId ?? 0,
    title: convertToFarsiDigits(initData?.yearTitle) ?? "",
  });

  useEffect(() => {
    console.log(search);
  }, []);

  useEffect(() => {
    if (year?.id !== undefined && year.id !== 0) {
      setYearId(Number(year.id));
    }
  }, [year]);

  useEffect(() => {
    if (system?.id !== undefined && system.id !== 0) {
      setSystemId(Number(system.id));
    }
  }, [system]);

  return (
    <div className="flex justify-center items-center w-80 md:flex-row px-4 gap-2 text-xs md:text-sm">
      <div className="flex flex-col justify-evenly items-end text-center w-20">
        <label htmlFor="system" >سیستم:</label>
        <label htmlFor="year" >
          سال مالی:
        </label>
      </div>
      <div className="flex flex-col justify-center items-end w-60 pt-4 md:pt-0">
        {/* for system */}
        <AutoComplete
          options={definitionInvironment?.systems ?? []}
          value={system}
          handleChange={(_event, newValue) => {
            return setSystem(newValue as DefaultOptionType);
          }}
          setSearch={setSearch}
          className="w-2/3 md:w-1/5"
          showLabel={false}
          showBorder={false}
          showClearIcon={false}
          outlinedInputPadding="0 !important"
          inputPadding="0 !important"
          showPopupIcon={false}
        />
        {/* for year */}
        <AutoComplete
          options={
            definitionInvironment?.years !== undefined
              ? definitionInvironment?.years.map((b) => ({
                  id: b.id,
                  title: convertToFarsiDigits(b.code),
                }))
              : []
          }
          value={year}
          handleChange={(_event, newValue) => {
            return setYear(newValue as DefaultOptionType) ;
          }}
          setSearch={setSearch}
          className="w-2/3 md:w-1/5"
          showLabel={false}
          showBorder={false}
          showClearIcon={false}
          outlinedInputPadding="0 !important"
          inputPadding="0 !important"
          showPopupIcon={false}
        />

      </div>
    </div>
  );
};

export default PageTitle;
