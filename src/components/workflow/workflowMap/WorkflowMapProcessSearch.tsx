import { useEffect, useRef, useCallback, useState } from "react";
import { DefaultOptionType } from "../../../types/general";
import { WorkFlowFlowNosSearchResponse } from "../../../types/workflow";
import { convertToFarsiDigits } from "../../../utilities/general";
import AutoComplet from "../../controls/AutoComplet";
import { useWorkflowStore } from "../../../store/workflowStore";
import { useGeneralContext } from "../../../context/GeneralContext";
import { debounce } from "lodash";

type Props = {
  processTitle: DefaultOptionType;
  setProcessTitle: React.Dispatch<React.SetStateAction<DefaultOptionType>>;
  workFlowFlowNosSearchResponse: WorkFlowFlowNosSearchResponse;
};

const WorkFlowMapProcessSearch = ({
  processTitle,
  setProcessTitle,
  workFlowFlowNosSearchResponse,

}: Props) => {
  const { setField } = useWorkflowStore();
  const { systemId } = useGeneralContext();
  const [isEntered, setIsEntered] = useState(false);
  const [search, setSearch] = useState("");
  //for api/WFMS/flowNosSearch?SystemId=4&Search=
  useEffect(() => {
    //if user entered the search box, then call the api
    if (isEntered) {
      setField("systemIdFlowNosSearch", systemId);
      setField("pageFlowNosSearch", 1);
      setField("lastIdFlowNosSearch", 0);
      handleDebounceFilterChange("searchFlowNosSearch", search);
    }
  }, [systemId, search, isEntered]);

  ///////////////////////////////////////////////////////
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setField(field, value);
    }, 500),
    [setField]
  );
  ////////////////////////////////////////////////////////
  return (
    <div className="flex w-full justify-center items-center gap-2 text-sm px-2">
      <label htmlFor="processTitle" className="w-24 text-left">
        عنوان فرایند:
      </label>
      <AutoComplet
        options={workFlowFlowNosSearchResponse.data.result.map((b) => ({
          id: b.id,
          title: convertToFarsiDigits(b.text),
        }))}
        value={{
          id: processTitle?.id ?? "",
          title: convertToFarsiDigits(processTitle?.title ?? ""),
        }}
        handleChange={(_event, newValue) => {
          return setProcessTitle({
            id: (newValue as DefaultOptionType)?.id ?? "",
            title: convertToFarsiDigits(
              (newValue as DefaultOptionType)?.title ?? ""
            ),
          });
        }}
        setSearch={setSearch}
        showLabel={false}
        inputPadding="4px !important"
        backgroundColor="white"
        showClearIcon={false}
        setIsEntered={setIsEntered}
      />
    </div>
  );
};

export default WorkFlowMapProcessSearch;
