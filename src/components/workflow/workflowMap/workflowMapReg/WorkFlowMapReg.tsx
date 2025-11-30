import {  useEffect,  useState } from "react";
import { useDefinition } from "../../../../hooks/useDefinition";
import Input from "../../../controls/Input";
import { DefaultOptionType, SearchItem } from "../../../../types/general";
import { Process } from "../WorkflowMapHeader";
import { useDefinitionStore } from "../../../../store/definitionStore";
import { useGeneralContext } from "../../../../context/GeneralContext";
import ConfirmCancel from "../ConfirmCancel";
import AutoCompleteSearch from "../AutoCompleteSearch";
import { useWorkflowStore } from "../../../../store/workflowStore";
import { convertToFarsiDigits } from "../../../../utilities/general";

type Props = {
  newEdit: number; // 1 for new, 0 for edit
  processTitle: DefaultOptionType | null;
  process: Process;
  setProcess: React.Dispatch<React.SetStateAction<Process>>;
  workFlowFlowMapCodeSearchResponse: SearchItem[];
  workFlowFormSearchResponse: SearchItem[];
  workFlowScriptSearchResponse: SearchItem[];
  workFlowWebAPISearchResponse: SearchItem[];
  workFlowStatusSearchResponse: SearchItem[];
};
const WorkFlowMapReg = ({
  newEdit,
  processTitle,
  process,
  setProcess,
  workFlowFlowMapCodeSearchResponse,
  workFlowFormSearchResponse,
  workFlowScriptSearchResponse,
  workFlowWebAPISearchResponse,
  workFlowStatusSearchResponse,
}: Props) => {
  const { chartSearchResponse } = useDefinition();
  const { setField } = useDefinitionStore();
  const { setField: setFieldWorkflow } = useWorkflowStore();
  const { systemId } = useGeneralContext();
  const [isChartChecked, setIsChartChecked] = useState(false);

  //for isEntered
  const [isChartEntered, setIsChartEntered] = useState(false); //for شرط سمت search
  const [isCodeIdEntered, setIsCodeIdEntered] = useState(false); //for نوع مقصد search
  const [isTChartEntered, setIsTChartEntered] = useState(false); //for واحد مقصد search
  const [isFormNo1Entered, setIsFormNo1Entered] = useState(false); //for فرم 1 search
  const [isFormNo2Entered, setIsFormNo2Entered] = useState(false); //for فرم 2 search
  const [isScriptBeforeIdEntered, setIsScriptBeforeIdEntered] = useState(false); //for اسکریپت قبلی search
  const [isScriptIdEntered, setIsScriptIdEntered] = useState(false); //for اسکریپت search
  const [isWebAPIIdEntered, setIsWebAPIIdEntered] = useState(false); //for ای پی آی search
  const [isScriptValidatorIdEntered, setIsScriptValidatorIdEntered] =
    useState(false); //for اسکریپت کنترل search
  const [isStatusIdEntered, setIsStatusIdEntered] = useState(false); //for وضعیت search

  useEffect(() => {
    console.log(newEdit);
  }, [newEdit]);

  return (
    <div className="w-full flex flex-col text-sm gap-2">
      <div className="w-full flex flex-row gap-2 items-center justify-between">
        <Input
          label="عنوان:"
          name="title"
          value={process.name}
          onChange={(e) => setProcess({ ...process, name: e.target.value })}
          widthInput="50-minus-32"
          widthLabel="w-36"
          widthDiv="w-1/2"
          className="w-full text-right mt-2 rounded-md border-gray-300 border-2 px-2 py-1"
        />
        <Input
          label="شناسه:"
          name="id"
          value={process.id}
          onChange={(e) =>
            setProcess({ ...process, id: parseInt(e.target.value) })
          }
          widthLabel="w-20"
          widthDiv="w-1/2"
          disabled={true}
          variant="outlined"
          className="w-full text-right mt-2 rounded-md border-gray-300 border-2 px-2 py-1"
        />
      </div>
      {/* شرط سمت */}
      <div className="w-full flex flex-row items-center justify-between">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={isChartChecked}
          onChange={() => setIsChartChecked(!isChartChecked)}
        />
        <div className="flex-1">
          <AutoCompleteSearch
            label="شرط سمت"
            labelWidth="w-28"
            setField={setField}
            fieldValues={[
              { field: "systemIdChartSearch", value: systemId },
              { field: "pageChartSearch", value: 1 },
              { field: "lastIdChartSearch", value: 0 },
            ]}
            fieldSearch="searchChartSearch"
            selectedOption={process.fChart as DefaultOptionType}
            setSelectedOption={(fChart: any) =>
              setProcess({ ...process, fChart: fChart as DefaultOptionType })
            }
            options={chartSearchResponse.data.result}
            disabled={!isChartChecked}
            isEntered={isChartEntered}
            setIsEntered={setIsChartEntered}
          />
        </div>
      </div>
      {/* نوع مقصد/ واحد مقصد */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-1/2">
          <AutoCompleteSearch
            label="نوع مقصد"
            labelWidth="w-32"
            setField={setFieldWorkflow}
            fieldValues={[
              { field: "systemIdFlowMapCodeSearch", value: systemId },
              { field: "pageFlowMapCodeSearch", value: 1 },
              { field: "lastIdFlowMapCodeSearch", value: 0 },
            ]}
            fieldSearch="searchFlowMapCodeSearch"
            selectedOption={process.codeId as DefaultOptionType}
            setSelectedOption={(codeId: any) =>
              setProcess({ ...process, codeId: codeId as DefaultOptionType })
            }
            options={workFlowFlowMapCodeSearchResponse}
            isEntered={isCodeIdEntered}
            setIsEntered={setIsCodeIdEntered}
          />
        </div>
        {process.codeId &&
          process.codeId?.id === 1 && ( // only for codeId = 1 show
            <div className="w-1/2">
              <AutoCompleteSearch
                label="واحد مقصد"
                labelWidth="w-20"
                setField={setField}
                fieldValues={[
                  { field: "systemIdChartSearch", value: systemId },
                  { field: "pageChartSearch", value: 1 },
                  { field: "lastIdChartSearch", value: 0 },
                ]}
                fieldSearch="searchChartSearch"
                selectedOption={process.tChart as DefaultOptionType}
                setSelectedOption={(tChart: any) =>
                  setProcess({
                    ...process,
                    tChart: tChart as DefaultOptionType,
                  })
                }
                options={chartSearchResponse.data.result}
                isEntered={isTChartEntered}
                setIsEntered={setIsTChartEntered}
              />
            </div>
          )}
      </div>
      {/* فرم 1/ فرم 2 */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-1/2">
          <AutoCompleteSearch
            label={convertToFarsiDigits("فرم 1") }
            labelWidth="w-32"
            setField={setFieldWorkflow}
            fieldValues={[
              { field: "systemIdFormSearch", value: systemId },
              { field: "pageFormSearch", value: 1 },
              { field: "lastIdFormSearch", value: 0 },
              { field: "flowNoIdFormSearch", value: processTitle?.id ?? -1 },
            ]}
            fieldSearch="searchFormSearch"
            selectedOption={process.formNo1 as DefaultOptionType}
            setSelectedOption={(formNo1: any) =>
              setProcess({ ...process, formNo1: formNo1 as DefaultOptionType })
            }
            options={workFlowFormSearchResponse}
            isEntered={isFormNo1Entered}
            setIsEntered={setIsFormNo1Entered}
          />
        </div>
        <div className="w-1/2">
          <AutoCompleteSearch
            label={convertToFarsiDigits("فرم 2")}
            labelWidth="w-20"
            setField={setField}
            fieldValues={[
              { field: "systemIdFormSearch", value: systemId },
              { field: "pageFormSearch", value: 1 },
              { field: "lastIdFormSearch", value: 0 },
              { field: "flowNoIdFormSearch", value: processTitle?.id ?? -1 },
            ]}
            fieldSearch="searchFormSearch"
            selectedOption={process.formNo2 as DefaultOptionType}
            setSelectedOption={(formNo2: any) =>
              setProcess({ ...process, formNo2: formNo2 as DefaultOptionType })
            }
            options={workFlowFormSearchResponse}
            isEntered={isFormNo2Entered}
            setIsEntered={setIsFormNo2Entered}
          />
        </div>
      </div>
      {/* اسکریپت قبل اجرا */}
      <AutoCompleteSearch
        label="اسکریپت قبل اجرا"
        labelWidth="w-32"
        setField={setFieldWorkflow}
        fieldValues={[
          { field: "systemIdScriptSearch", value: systemId },
          { field: "pageScriptSearch", value: 1 },
          { field: "lastIdScriptSearch", value: 0 },
          { field: "flowNoIdScriptSearch", value: processTitle?.id ?? -1 },
          { field: "kindScriptSearch", value: -1 },
        ]}
        fieldSearch="searchScriptSearch"
        selectedOption={process.scriptBeforeId as DefaultOptionType}
        setSelectedOption={(scriptBeforeId: any) =>
          setProcess({ ...process, scriptBeforeId: scriptBeforeId as DefaultOptionType })
        }
        options={workFlowScriptSearchResponse}
        isEntered={isScriptBeforeIdEntered}
        setIsEntered={setIsScriptBeforeIdEntered}
      />
      {/* اسکریپت اجرا */}
      <AutoCompleteSearch
        label="اسکریپت اجرا"
        labelWidth="w-32"
        setField={setFieldWorkflow}
        fieldValues={[
          { field: "systemIdScriptSearch", value: systemId },
          { field: "pageScriptSearch", value: 1 },
          { field: "lastIdScriptSearch", value: 0 },
          { field: "flowNoIdScriptSearch", value: processTitle?.id ?? -1 },
          { field: "kindScriptSearch", value: 0 },
        ]}
        fieldSearch="searchScriptSearch"
        selectedOption={process.scriptId as DefaultOptionType}
        setSelectedOption={(scriptId: any) =>
          setProcess({ ...process, scriptId: scriptId as DefaultOptionType })
        }
        options={workFlowScriptSearchResponse}
        isEntered={isScriptIdEntered}
        setIsEntered={setIsScriptIdEntered}
      />
      {/*  ای پی آی */}
      <AutoCompleteSearch
        label="ای پی آی"
        labelWidth="w-32"
        setField={setFieldWorkflow}
        fieldValues={[
          { field: "systemIdWebAPISearch", value: systemId },
          { field: "pageWebAPISearch", value: 1 },
          { field: "lastIdWebAPISearch", value: 0 },
          { field: "flowNoIdWebAPISearch", value: processTitle?.id ?? -1 },
        ]}
        fieldSearch="searchWebAPISearch"
        selectedOption={process.webAPIId as DefaultOptionType}
        setSelectedOption={(webAPIId: any) =>
          setProcess({ ...process, webAPIId: webAPIId as DefaultOptionType })
        }
        options={workFlowWebAPISearchResponse}
        isEntered={isWebAPIIdEntered}
        setIsEntered={setIsWebAPIIdEntered}
      />
      {/* اسکریپت کنترل */}
      <AutoCompleteSearch
        label="اسکریپت کنترل"
        labelWidth="w-32"
        setField={setFieldWorkflow}
        fieldValues={[
          { field: "systemIdScriptSearch", value: systemId },
          { field: "pageScriptSearch", value: 1 },
          { field: "lastIdScriptSearch", value: 0 },
          { field: "flowNoIdScriptSearch", value: processTitle?.id ?? -1 },
          { field: "kindScriptSearch", value: 1 },
        ]}
        fieldSearch="searchScriptSearch"
        selectedOption={process.scriptValidatorId as DefaultOptionType}
        setSelectedOption={(scriptValidatorId: any) =>
          setProcess({ ...process, scriptValidatorId: scriptValidatorId as DefaultOptionType })
        }
        options={workFlowScriptSearchResponse}
        isEntered={isScriptValidatorIdEntered}
        setIsEntered={setIsScriptValidatorIdEntered}
      />
      {/*  وضعیت */}
      <AutoCompleteSearch
        label="وضعیت"
        labelWidth="w-32"
        setField={setFieldWorkflow}
        fieldValues={[
          { field: "systemIdStatusSearch", value: systemId },
          { field: "pageStatusSearch", value: 1 },
          { field: "lastIdStatusSearch", value: 0 },
          { field: "flowNoIdStatusSearch", value: processTitle?.id ?? -1 },
        ]}
        fieldSearch="searchStatusSearch"
        selectedOption={process.statusId as DefaultOptionType}
        setSelectedOption={(statusId: any) =>
          setProcess({ ...process, statusId: statusId as DefaultOptionType })
        }
        options={workFlowStatusSearchResponse}
        isEntered={isStatusIdEntered}
        setIsEntered={setIsStatusIdEntered}
      />
      <ConfirmCancel
        onConfirm={() => {
          console.log("confirm");
        }}
        onCancel={() => {
          console.log("cancel");
        }}
      />
    </div>
  );
};

export default WorkFlowMapReg;
