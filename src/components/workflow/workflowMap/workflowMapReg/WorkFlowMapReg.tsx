import { useEffect, useState } from "react";
import { useDefinition } from "../../../../hooks/useDefinition";
import Input from "../../../controls/Input";
import { DefaultOptionType, SearchItem } from "../../../../types/general";
import { Process } from "../WorkflowMapHeader";
import { useDefinitionStore } from "../../../../store/definitionStore";
import { useGeneralContext } from "../../../../context/GeneralContext";
import ConfirmCancel from "../../../controls/ConfirmCancel";
import AutoCompleteSearch from "../../../controls/AutoCompleteSearch";
import { useWorkflowStore } from "../../../../store/workflowStore";
import { convertToFarsiDigits } from "../../../../utilities/general";
import {
  WorkFlowFlowMapLoadResponse,
  WorkFlowMapSaveRequest,
} from "../../../../types/workflow";
import { v4 as uuidv4 } from "uuid";

type Props = {
  newEdit: number; // 1 for new, 0 for edit
  setNewEdit: React.Dispatch<React.SetStateAction<number>>;
  processTitle: DefaultOptionType | null;
  process: Process;
  setProcess: React.Dispatch<React.SetStateAction<Process>>;
  workFlowFlowMapCodeSearchResponse: SearchItem[];
  workFlowFormSearchResponse: SearchItem[];
  workFlowScriptSearchResponse: SearchItem[];
  workFlowWebAPISearchResponse: SearchItem[];
  workFlowStatusSearchResponse: SearchItem[];
  workFlowFlowMapLoadResponse: WorkFlowFlowMapLoadResponse; //for load edit data : /api/WFMS/flowMapLoad/205000020
  workFlowFlowMapSave: (request: WorkFlowMapSaveRequest) => void; //for api/WFMS/flowMapSave
  setIsModalOpenSave: React.Dispatch<React.SetStateAction<boolean>>;
};
const WorkFlowMapReg = ({
  newEdit,
  setNewEdit,
  processTitle,
  process,
  setProcess,
  workFlowFlowMapCodeSearchResponse,
  workFlowFormSearchResponse,
  workFlowScriptSearchResponse,
  workFlowWebAPISearchResponse,
  workFlowStatusSearchResponse,
  workFlowFlowMapLoadResponse,
  workFlowFlowMapSave,
  setIsModalOpenSave,
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
  const [errorMessage, setErrorMessage] = useState(""); //for error message
  /////////////////////////////////////////////////////////////
  const newProcessData = {
    usrId: 0,
    id: 0,
    name: "",
    flowNo: null,
    fChart: null,
    codeId: null,
    tChart: null,
    formNo1: null,
    formNo2: null,
    scriptBeforeId: null,
    scriptId: null,
    webAPIId: null,
    scriptValidatorId: null,
    statusId: null,
    idempotencyKey: "",
  };
  useEffect(() => {
    //console.log(newEdit,"newEdit");
    //console.log(workFlowFlowMapLoadResponse,"workFlowFlowMapLoadResponse");
    if (newEdit === 1) {
      setProcess(newProcessData);
    } else if (newEdit === 0) {
      // for edit
      console.log(workFlowFlowMapLoadResponse);
      const workFlowFlowMapLoadResponseData =
        workFlowFlowMapLoadResponse.data.result;
      if (workFlowFlowMapLoadResponseData) {
        setProcess({
          ...process,
          name: workFlowFlowMapLoadResponseData.name,
          id: workFlowFlowMapLoadResponseData.id,
          flowNo: {
            id: processTitle?.id ?? 0,
            title: processTitle?.title ?? "",
          },
          fChart: {
            id: workFlowFlowMapLoadResponseData.fChart,
            title: workFlowFlowMapLoadResponseData.fChartName,
          },
          codeId: {
            id: workFlowFlowMapLoadResponseData.codeId,
            title: workFlowFlowMapLoadResponseData.codeTitle,
          },
          tChart: {
            id: workFlowFlowMapLoadResponseData.tChart,
            title: workFlowFlowMapLoadResponseData.tChartName,
          },
          formNo1: {
            id: workFlowFlowMapLoadResponseData.formNo1,
            title: workFlowFlowMapLoadResponseData.form1Title,
          },
          formNo2: {
            id: workFlowFlowMapLoadResponseData.formNo2,
            title: workFlowFlowMapLoadResponseData.form2Title,
          },
          scriptBeforeId: {
            id: workFlowFlowMapLoadResponseData.scriptBeforeId,
            title: workFlowFlowMapLoadResponseData.scriptBeforeTitle,
          },
          scriptId: {
            id: workFlowFlowMapLoadResponseData.scriptId,
            title: workFlowFlowMapLoadResponseData.scriptTitle,
          },
          webAPIId: {
            id: workFlowFlowMapLoadResponseData.webAPIId,
            title: workFlowFlowMapLoadResponseData.webAPITitle,
          },
          scriptValidatorId: {
            id: workFlowFlowMapLoadResponseData.scriptValidatorId,
            title: workFlowFlowMapLoadResponseData.scriptValidatorTitle,
          },
          statusId: {
            id: workFlowFlowMapLoadResponseData.statusId,
            title: workFlowFlowMapLoadResponseData.statusTitle,
          },
          idempotencyKey: workFlowFlowMapLoadResponseData.idempotencyKey,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEdit, workFlowFlowMapLoadResponse.data.result.id]);

  const handleConfirm = () => {
    const request: WorkFlowMapSaveRequest = {
      usrId: process.usrId,
      id: process.id,
      name: process.name,
      flowNo: processTitle?.id ?? 0,
      fChart: process.fChart?.id ?? 0,
      codeId: process.codeId?.id ?? 0,
      tChart: process.tChart?.id ?? 0,
      formNo1: process.formNo1?.id ?? 0,
      formNo2: process.formNo2?.id ?? 0,
      scriptBeforeId: process.scriptBeforeId?.id ?? 0,
      scriptId: process.scriptId?.id ?? 0,
      webAPIId: process.webAPIId?.id ?? 0,
      scriptValidatorId: process.scriptValidatorId?.id ?? 0,
      statusId: process.statusId?.id ?? 0,
      idempotencyKey: uuidv4(),
    };
    console.log(request);
    console.log(process.formNo1,"process.formNo1");
    if (!process.formNo1) {
      setErrorMessage("فرمی جهت نمایش انتخاب نشده!");
      return;
    }
    workFlowFlowMapSave(request);
    setIsModalOpenSave(true);
    setNewEdit(-1);
  };

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
          value={convertToFarsiDigits(process.id)}
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
          Number(process.codeId?.id ?? 0) === 1 && ( // only for codeId = 1 show
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
            label={convertToFarsiDigits("فرم 1")}
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
          setProcess({
            ...process,
            scriptBeforeId: scriptBeforeId as DefaultOptionType,
          })
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
          setProcess({
            ...process,
            scriptValidatorId: scriptValidatorId as DefaultOptionType,
          })
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
        errorMessage={errorMessage}
        onConfirm={handleConfirm}
        onCancel={() => {
          setNewEdit(-1);
        }}
      />
    </div>
  );
};

export default WorkFlowMapReg;
