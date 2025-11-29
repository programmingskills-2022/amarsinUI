import { useCallback, useEffect, useRef, useState } from "react";
import { useDefinition } from "../../../hooks/useDefinition";
import { WorkFlowMapSaveRequest } from "../../../types/workflow";
import AutoComplet from "../../controls/AutoComplet";
import AutoComplete from "../../controls/AutoComplete";
import Input from "../../controls/Input";
import { DefaultOptionType } from "../../../types/general";
import { Process } from "./WorkflowMapHeader";
import { useDefinitionStore } from "../../../store/definitionStore";
import { useGeneralContext } from "../../../context/GeneralContext";
import { convertToFarsiDigits } from "../../../utilities/general";
import { debounce } from "lodash";
import ConfirmCancel from "./ConfirmCancel";

type Props = {
  NewEdit: number; // 1 for new, 0 for edit
  process: Process;
  setProcess: React.Dispatch<React.SetStateAction<Process>>;
};
const WorkFlowMapReg = ({ NewEdit, process, setProcess }: Props) => {
  const { chartSearchResponse } = useDefinition();
  const { setField } = useDefinitionStore();
  const { systemId } = useGeneralContext();
  const [chartSearch, setChartSearch] = useState("");
  const [isChartChecked, setIsChartChecked] = useState(false);

  useEffect(() => {
    setField("systemIdChartSearch", systemId ?? 0);
    setField("pageChartSearch", 1);
    setField("lastIdChartSearch", 0);
    handleDebounceFilterChange("searchChartSearch", chartSearch);
  }, [chartSearch, systemId]);

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
          widthInput="50-minus-32"
          widthLabel="w-32"
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
        <label className="w-28 text-left"> شرط سمت:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          outlinedInputPadding="0px"
        />
      </div>
      {/* نوع مقصد/ واحد مقصد */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-1/2 flex flex-row items-center justify-between">
          <label className="w-36 text-left"> نوع مقصد:</label>
          <AutoComplet
            disabled={!isChartChecked}
            options={chartSearchResponse.data.result.map((item) => ({
              id: item.id,
              title: convertToFarsiDigits(item.text ?? ""),
            }))}
            value={{
              id: process.fChart?.id ?? "",
              title: convertToFarsiDigits(process.fChart?.title ?? ""),
            }}
            setSearch={setChartSearch}
            handleChange={(_e, newValue) =>
              setProcess({
                ...process,
                fChart: {
                  id: (newValue as DefaultOptionType)?.id ?? "",
                  title: convertToFarsiDigits(
                    (newValue as DefaultOptionType)?.title ?? ""
                  ),
                },
              })
            }
            showClearIcon={false}
            desktopfontsize="12px"
            outlinedInputPadding="0px"
          />
        </div>
        <div className="w-1/2 flex flex-row items-center justify-between">
          <label className="w-32 text-left"> واحد مقصد:</label>
          <AutoComplet
            disabled={!isChartChecked}
            options={chartSearchResponse.data.result.map((item) => ({
              id: item.id,
              title: convertToFarsiDigits(item.text ?? ""),
            }))}
            value={{
              id: process.fChart?.id ?? "",
              title: convertToFarsiDigits(process.fChart?.title ?? ""),
            }}
            setSearch={setChartSearch}
            handleChange={(_e, newValue) =>
              setProcess({
                ...process,
                fChart: {
                  id: (newValue as DefaultOptionType)?.id ?? "",
                  title: convertToFarsiDigits(
                    (newValue as DefaultOptionType)?.title ?? ""
                  ),
                },
              })
            }
            showClearIcon={false}
            desktopfontsize="12px"
            outlinedInputPadding="0px"
          />
        </div>
      </div>
      {/* فرم 1/ فرم 2 */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-1/2 flex flex-row items-center justify-between">
          <label className="w-36 text-left"> فرم 1:</label>
          <AutoComplet
            disabled={!isChartChecked}
            options={chartSearchResponse.data.result.map((item) => ({
              id: item.id,
              title: convertToFarsiDigits(item.text ?? ""),
            }))}
            value={{
              id: process.fChart?.id ?? "",
              title: convertToFarsiDigits(process.fChart?.title ?? ""),
            }}
            setSearch={setChartSearch}
            handleChange={(_e, newValue) =>
              setProcess({
                ...process,
                fChart: {
                  id: (newValue as DefaultOptionType)?.id ?? "",
                  title: convertToFarsiDigits(
                    (newValue as DefaultOptionType)?.title ?? ""
                  ),
                },
              })
            }
            showClearIcon={false}
            desktopfontsize="12px"
            outlinedInputPadding="0px"
          />
        </div>
        <div className="w-1/2 flex flex-row items-center justify-between">
          <label className="w-32 text-left"> فرم 2:</label>
          <AutoComplet
            disabled={!isChartChecked}
            options={chartSearchResponse.data.result.map((item) => ({
              id: item.id,
              title: convertToFarsiDigits(item.text ?? ""),
            }))}
            value={{
              id: process.fChart?.id ?? "",
              title: convertToFarsiDigits(process.fChart?.title ?? ""),
            }}
            setSearch={setChartSearch}
            handleChange={(_e, newValue) =>
              setProcess({
                ...process,
                fChart: {
                  id: (newValue as DefaultOptionType)?.id ?? "",
                  title: convertToFarsiDigits(
                    (newValue as DefaultOptionType)?.title ?? ""
                  ),
                },
              })
            }
            showClearIcon={false}
            desktopfontsize="12px"
            outlinedInputPadding="0px"
          />
        </div>
      </div>
      {/* اسکریپت قبل اجرا */}
      <div className="w-full flex flex-row items-center justify-between">
        <label className="w-32 text-left"> اسکریپت قبل اجرا:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          desktopfontsize="12px"
          outlinedInputPadding="0px"
        />
      </div>
      {/* اسکریپت اجرا */}
      <div className="w-full flex flex-row items-center justify-between">
        <label className="w-32 text-left"> اسکریپت اجرا:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          desktopfontsize="12px"
          outlinedInputPadding="0px"
        />
      </div>
      {/*  ای پی آی */}
      <div className="w-full flex flex-row items-center justify-between">
        <label className="w-32 text-left"> ای پی آی:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          desktopfontsize="12px"
          outlinedInputPadding="0px"
        />
      </div>
      {/* اسکریپت کنترل */}
      <div className="w-full flex flex-row items-center justify-between">
        <label className="w-32 text-left"> اسکریپت کنترل:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          desktopfontsize="12px"
          outlinedInputPadding="0px"
        />
      </div>
      {/*  وضعیت */}
      <div className="w-full flex flex-row items-center justify-between">
        <label className="w-32 text-left"> وضعیت:</label>
        <AutoComplet
          disabled={!isChartChecked}
          options={chartSearchResponse.data.result.map((item) => ({
            id: item.id,
            title: convertToFarsiDigits(item.text ?? ""),
          }))}
          value={{
            id: process.fChart?.id ?? "",
            title: convertToFarsiDigits(process.fChart?.title ?? ""),
          }}
          setSearch={setChartSearch}
          handleChange={(_e, newValue) =>
            setProcess({
              ...process,
              fChart: {
                id: (newValue as DefaultOptionType)?.id ?? "",
                title: convertToFarsiDigits(
                  (newValue as DefaultOptionType)?.title ?? ""
                ),
              },
            })
          }
          showClearIcon={false}
          desktopfontsize="12px"
          outlinedInputPadding="0px"
        />
      </div>
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
