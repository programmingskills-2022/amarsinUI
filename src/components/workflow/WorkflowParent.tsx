import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Paper } from "@mui/material";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
import { useGeneralContext } from "../../context/GeneralContext";
import { useWorkflowStore } from "../../store/workflowStore";
import AutoComplete from "../controls/AutoComplete";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
  convertPixelWidthsToPercentages,
} from "../../utilities/general";
import { debounce } from "lodash";
import TTable from "../controls/TTable";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import { TablePaginationActions } from "../controls/TablePaginationActions";
import { WorkflowResponse } from "../../types/workflow";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";

type Props = {
  selectedId: number;
  setSelectedId: (value: number) => void;
  workFlowResponse: WorkflowResponse;
  error: Error | null;
  isLoading: boolean;
  isRefetchingWorkTable: boolean;
  isRefetchingWorkTableRowSelect: boolean;
  data: any[];
  setData: (value: any[]) => void;
};

export default function WorkflowParent({
  selectedId,
  setSelectedId,
  workFlowResponse,
  error,
  isLoading,
  isRefetchingWorkTable,
  //isRefetchingWorkTableRowSelect,
  data,
  setData,
}: Props) {
  const { flowMapId: flowMapIdStore, setField } = useWorkflowStore();
  const { systemId, chartId, defaultRowsPerPage } = useGeneralContext();
  const { width: tableWidth } = useCalculateTableHeight();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultRowsPerPage);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in workflowParent table
  //const { workTableId } = useWorkflowRowSelectStore();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  //to save column widths if user changes them (stored as percentages)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    index: 3,
    id: 5,
    regDateTime: 10,
    formTitle: 27,
    formCode: 10,
    formCost: 10,
    flowMapTitle: 10,
    fChartName: 10,
    dsc: 20,
  });

  const columns: TableColumns = useMemo(() => {
    // Note: columnWidths contains percentages, TTable will convert them to pixels
    return [
      {
        Header: "ردیف",
        accessor: "index",
        width: columnWidths.index + "%",
      },
      {
        //define for selectedId
        Header: "شناسه",
        accessor: "id",
        width: columnWidths.id + "%",
        visible: false,
      },
      {
        Header: "زمان",
        accessor: "regDateTime",
        width: columnWidths.regDateTime + "%",
      },
      {
        Header: "فرم",
        accessor: "formTitle",
        width: columnWidths.formTitle + "%",
      },
      {
        Header: "کد",
        accessor: "formCode",
        width: columnWidths.formCode + "%",
      },
      {
        Header: "مقدار",
        accessor: "formCost",
        width: columnWidths.formCost + "%",
      },
      {
        Header: "مرحله",
        accessor: "flowMapTitle",
        width: columnWidths.flowMapTitle + "%",
      },
      {
        Header: "فرستنده",
        accessor: "fChartName",
        width: columnWidths.fChartName + "%",
      },
      {
        Header: "شرح",
        accessor: "dsc",
        width: columnWidths.dsc + "%",
      },
    ];
  }, [columnWidths]);

  // Convert pixels back to percentages when saving (only for visible columns)
  const handleColumnResize = useCallback(
    (pixelWidths: Record<string, number>) => {
      if (tableWidth > 0) {
        const percentageWidths = convertPixelWidthsToPercentages(
          pixelWidths,
          columns,
          columnWidths
        );
        setColumnWidths(percentageWidths);
      }
    },
    [tableWidth, columns, columnWidths]
  );

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/login");
    }
  }, [error, navigate]);

  useEffect(() => {
    /* console.log(
      "one of these were changed:" + systemId,
      chartId,
      pageNumber,
      pageSize
    );*/
    setField("systemId", systemId);
    setField("chartId", chartId);
    setField("page", pageNumber);
    setField("pageSize", pageSize);
  }, [systemId, chartId, pageNumber, pageSize]);
  ////////////////////////////////////////////////
  useEffect(() => {
    setField("flowMapId", "-1");
  }, [chartId]);
  ////////////////////////////////////////////////
  //initialize
  useEffect(() => {
    setField("title", "");
    setField("code", "");
    setField("cost", "");
    setField("name", "");
    setField("dsc", "");
    setField("flowMapId", "-1");
    setField("page", 1);
  }, []);
  //define flowMapTitles
  const [flowMapTitle, setFlowMapTitle] = useState<{
    id: string;
    title: string;
  } | null>({
    id: "-1",
    title: "همه",
  });
  //add filter options
  const [dateTime, setDateTime] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [cost, setCost] = useState("");
  const [flowMapId, setFlowMapId] = useState("-1");
  const [name, setName] = useState("");
  const [dsc, setDsc] = useState("");

  useEffect(() => {
    //console.log(flowMapIdStore, "flowMapIdStore in WorkflowParent");
    setPageNumber(1);
  }, [
    flowMapIdStore,
    dateTime,
    title,
    code,
    cost,
    name,
    dsc,
    chartId,
    systemId,
  ]);

  useEffect(() => {
    console.log(flowMapId); //just for handling warning of unused flowMapId
    if (
      flowMapIdStore?.toString() === "-1" &&
      workFlowResponse?.totalCount > 0
    ) {
      setFlowMapTitle({
        id: "-1",
        title:
          workFlowResponse.flowMapTitles?.length > 0
            ? `${
                workFlowResponse.flowMapTitles[0]?.name ?? ""
              } (${convertToFarsiDigits(
                workFlowResponse.flowMapTitles[0]?.count ?? 0
              )})`
            : "",
      });
    } else if (
      flowMapIdStore?.toString() === "-1" &&
      workFlowResponse?.totalCount === 0
    )
      setFlowMapTitle({
        id: "-1",
        title: "",
      });
  }, [chartId, flowMapIdStore, workFlowResponse?.totalCount]);

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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Only set first record as selected if there's no current selection
    // This prevents losing selection when data is refetched
    if (workFlowResponse?.workTables?.length > 0) {
      // Only reset if selectedId doesn't exist in current data
      const selectedExists = workFlowResponse.workTables.some(
        (table) => table.id === selectedId
      );
      if (!selectedExists) {
        setSelectedId(workFlowResponse.workTables[0].id);
        setSelectedRowIndex(0);
      } else {
        setSelectedRowIndex(
          workFlowResponse.workTables.findIndex(
            (table) => table.id === selectedId
          ) ?? 0
        );
      }
      // If selectedId exists, don't reset selectedRowIndex - preserve user's selection
    } else {
      setSelectedId(0);
      setSelectedRowIndex(0);
    }
  }, [workFlowResponse]);

  if (error) return <div>Error: {error.message} </div>;

  //console.log(data, "data");
  const [skipPageReset, setSkipPageReset] = useState(false);

  useEffect(() => {
    if (workFlowResponse?.workTables)
      setData(
        workFlowResponse.workTables.map((item, idx) => ({
          ...item,
          index: convertToFarsiDigits((pageNumber - 1) * pageSize + idx + 1),
          id: convertToFarsiDigits(item.id),
          regDateTime: convertToFarsiDigits(item.regDateTime),
          formTitle: convertToFarsiDigits(item.formTitle),
          formCode: convertToFarsiDigits(item.formCode),
          formCost: convertToFarsiDigits(formatNumberWithCommas(item.formCost)),
          flowMapTitle: convertToFarsiDigits(item.flowMapTitle),
          fChartName: convertToFarsiDigits(item.fChartName),
          dsc: convertToFarsiDigits(item.dsc),
        }))
      );
  }, [workFlowResponse?.workTables]);

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  useEffect(() => {
    console.log(columnWidths, "columnWidths");
  }, [columnWidths]);
  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        <div className="w-full flex justify-center md:justify-end items-center ">
          <div style={{ width: columnWidths.index + "%" }}></div>
          <input
            name="dateTime"
            value={convertToFarsiDigits(dateTime ?? "")}
            onChange={(e) => {
              handleDebounceFilterChange(
                "dateTime",
                convertToLatinDigits(e.target.value)
              );
              setDateTime(convertToLatinDigits(e.target.value));
            }}
            className={`border p-1 text-sm rounded-sm`}
            style={{ width: columnWidths.regDateTime + "%" }}
          />
          <input
            name="title"
            value={title ?? ""}
            onChange={(e) => {
              handleDebounceFilterChange("title", e.target.value);
              setTitle(e.target.value);
            }}
            className={`border p-1 text-sm rounded-sm`}
            style={{ width: columnWidths.formTitle + "%" }}
          />
          <input
            name="code"
            value={convertToFarsiDigits(code ?? "")}
            onChange={(e) => {
              handleDebounceFilterChange(
                "code",
                convertToLatinDigits(e.target.value)
              );
              setCode(convertToLatinDigits(e.target.value));
            }}
            className="border p-1 text-sm rounded-sm"
            style={{ width: columnWidths.formCode + "%" }}
          />
          <input
            name="cost"
            value={convertToFarsiDigits(cost ?? "")}
            onChange={(e) => {
              handleDebounceFilterChange(
                "cost",
                convertToLatinDigits(e.target.value)
              );
              setCost(convertToLatinDigits(e.target.value));
            }}
            className="border p-1 text-sm rounded-sm"
            style={{ width: columnWidths.formCost + "%" }}
          />
          {/*<AutoCompleteSearch
            label=""
            labelWidth={columnWidths.flowMapTitle + "%"}
            setField={setField}
            fieldValues={[{ field: "flowMapId", value: flowMapId }]}
            fieldSearch="searchFlowMapId"
            selectedOption={flowMapTitle as DefaultOptionTypeStringId}
            setSelectedOption={(option) => setFlowMapTitle(option as DefaultOptionTypeStringId)}
            options={workFlowResponse.flowMapTitles.map((b) => ({
              id: b.id.toString(),
              text: `${b.name} (${convertToFarsiDigits(b.count)})`,
            }))}
            isEntered={isFlowMapIdEntered}
            setIsEntered={setIsFlowMapIdEntered}
          />*/}
          <div style={{ width: columnWidths.flowMapTitle + "%" }}>
            <AutoComplete
              options={
                workFlowResponse?.flowMapTitles?.map((b) => ({
                  id: b.id.toString(),
                  title: `${b.name} (${convertToFarsiDigits(b.count)})`,
                })) ?? []
              }
              value={flowMapTitle}
              handleChange={(_event, newValue) => {
                setField(
                  "flowMapId",
                  (newValue as DefaultOptionTypeStringId)?.id ?? "-1"
                );
                return setFlowMapTitle(newValue as DefaultOptionTypeStringId);
              }}
              setSearch={setFlowMapId}
              showLabel={false}
              inputPadding="0 !important"
              mobilefontsize="0.6rem"
              desktopfontsize="0.7rem"
              showClearIcon={false}
              textAlign="center"
            />
          </div>
          <input
            name="name"
            value={name ?? ""}
            onChange={(e) => {
              handleDebounceFilterChange("name", e.target.value);
              setName(e.target.value);
            }}
            className="border p-1 text-sm rounded-sm"
            style={{ width: columnWidths.fChartName + "%" }}
          />
          <input
            name="dsc"
            value={dsc ?? ""}
            onChange={(e) => {
              handleDebounceFilterChange("dsc", e.target.value);
              setDsc(e.target.value);
            }}
            className="border p-1 text-sm rounded-sm"
            style={{ width: columnWidths.dsc + "%" }}
          />
        </div>
        {isLoading ||
        isRefetchingWorkTable /*|| isRefetchingWorkTableRowSelect*/ ? (
          <div className="w-full text-center">{<Skeleton />}</div>
        ) : workFlowResponse?.err !== 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {workFlowResponse?.msg}
          </p>
        ) : (
          <div
            className="w-full"
            //style={{ height: parentHeight }}
          >
            <TTable
              columns={columns}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              data={data}
              //updateMyData={updateMyData}
              skipPageReset={skipPageReset}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              setSelectedId={setSelectedId}
              wordWrap={false}
              showToolTip={true}
              //maxVisibleColumns={7}
              enableColumnResize={true}
              initialColumnWidths={columnWidths}
              onColumnResize={handleColumnResize}
            />
            <TablePaginationActions
              page={pageNumber - 1}
              setPage={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={workFlowResponse?.totalCount ?? 0}
              setSelectedRowIndex={setSelectedRowIndex}
              showPagination={true}
            />
          </div>
        )}
      </Paper>
    </>
  );
}
