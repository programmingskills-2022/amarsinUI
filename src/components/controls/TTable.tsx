import React, { useCallback, useEffect, useRef, useState } from "react";
import { Column, DefaultOptionType, TableColumns } from "../../types/general";
import { CellProps, useTable, useBlockLayout } from "react-table";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
  handleCurrencyInputChange,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import PersianDatePicker from "./PersianDatePicker";
import {
  parsePersianDateString,
  convertToPersianDate,
} from "../../utilities/general";
import AutoCompleteSearch from "./AutoCompleteSearch";
import { debounce } from "lodash";

type TableProps<T extends object> = {
  canEditForm?: boolean;
  columns: TableColumns;
  data: T[];
  originalData?: T[];
  /*calculatedFieldfns?: {
    calcField: string;
    calculateFn: (...args: any[]) => any;
    params: string[];
  }[];*/
  updateMyData?: (rowIndex: number, columnId: string, value: string) => void;
  updateMyRow?: (
    rowIndex: number,
    values: DefaultOptionType,
    columnId?: string
  ) => void;
  changeRowValues?: (value: string, rowIndex: number, columnId: string) => void;
  skipPageReset?: boolean;
  fontSize?: string;
  wordWrap?: boolean;
  hasSumRow?: boolean;
  changeRowSelectColor?: boolean;
  setSelectedId?: (value: number) => void;
  CellColorChange?: (row: any, columnId: string) => string | null;
  showToolTip?: boolean;
  showHeader?: boolean;
  selectedRowIndex?: number; // just for background color
  setSelectedRowIndex?: (value: number) => void; // just for background color
  maxVisibleColumns?: number; // Maximum number of columns to show before collapsing
  collapsedColumnWidth?: number;
  enableColumnResize?: boolean; // Enable column resizing feature
  onColumnResize?: (columnWidths: Record<string, number>) => void; // Callback when column widths change
  initialColumnWidths?: Record<string, number>; // Initial column widths from parent (takes precedence over column definitions)
};

// Create an editable cell renderer
interface EditableCellProps<T extends object> extends CellProps<T, any> {
  data: T[];
  originalData?: T[];
  /*calculatedFieldfns?: {
    calcField: string;
    calculateFn: (...args: any[]) => any;
    params: string[];
  }[];*/
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
  updateMyRow?: (
    rowIndex: number,
    newValue: DefaultOptionType | DefaultOptionType[] | null,
    columnId?: string
  ) => void;
  changeRowValues: (
    value: string | boolean,
    rowIndex: number,
    columnId: string
  ) => void;
  canEditForm?: boolean;
  selectedRowIndex?: number;
}

export function EditableInput<T extends object>({
  data,
  originalData,
  //calculatedFieldfns,
  canEditForm,
  value: initialValue,
  row: { index },
  column,
  updateMyData,
  updateMyRow,
  changeRowValues,
  selectedRowIndex,
}: EditableCellProps<T>) {
  const {
    id,
    type,
    placeholder,
    isCurrency,
    backgroundColor: bgColor,
    options: autoOptions,
    setSearch,
    align,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    //search,
  } = column as any;
  // Initialize with default values to ensure controlled component
  const getInitialValue = () => {
    if (
      initialValue &&
      initialValue.props?.children?.props.type === "checkbox"
    ) {
      return initialValue.props.children.props.checked;
    } else if (typeof initialValue === "boolean") {
      return initialValue;
    } else if (type === "date") {
      return (initialValue as string) ?? "";
    } else if (isCurrency) {
      return initialValue !== undefined && initialValue !== null
        ? convertToFarsiDigits(formatNumberWithCommas(initialValue))
        : "";
    } else {
      return initialValue !== undefined && initialValue !== null
        ? convertToFarsiDigits(String(initialValue))
        : "";
    }
  };

  const [value, setValue] = React.useState<string | boolean>(getInitialValue());
  const [isFocused, setIsFocused] = React.useState(false);
  const [dateValue, setDateValue] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (
      initialValue &&
      initialValue.props?.children?.props.type === "checkbox"
    ) {
      setValue(initialValue.props.children.props.checked);
    } else if (typeof initialValue === "boolean") {
      setValue(initialValue);
    } else if (type === "date") {
      // Convert string date to Date object for date picker
      const date = parsePersianDateString((initialValue as string) ?? "");
      setDateValue(date);
      setValue((initialValue as string) ?? "");
    } else {
      const displayValue = isCurrency
        ? formatNumberWithCommas(initialValue ?? 0)
        : initialValue ?? "";
      setValue(convertToFarsiDigits(displayValue));
    }
  }, [initialValue, type, isCurrency]);

  // Handle date change from PersianDatePicker
  const handleDateChange = (event: {
    target: { name: string; value: Date | null };
  }) => {
    const date = event.target.value;
    setDateValue(date);

    // Convert Date to Persian date string format (YYYY/MM/DD)
    const dateString = date ? convertToPersianDate(date) : "";
    setValue(dateString);
    updateData(dateString);
    updateMyData(index, id as string, dateString);
  };

  // Handle change from AutoComplete
  const handleAutoCompleteChange = (
    event: any,
    newValue:
      | { id: string | number; title: string }
      | { id: string | number; title: string }[]
      | null
  ) => {
    console.log(event, "event in handleAutoCompleteChange");
    setValue((newValue as DefaultOptionType)?.title ?? "");
    if (updateMyRow) {
      updateMyRow(index, newValue as DefaultOptionType, id);
      setSearch?.("");
    }
    if (newValue) {
      //updateMyData(index, id, (newValue as DefaultOptionType)?.title ?? "");
      updateData((newValue as DefaultOptionType)?.title ?? "");
      updateMyData(index, id, (newValue as DefaultOptionType)?.title ?? "");
    }
  };

  // Helper function to update data directly (fast, no React state updates)
  const updateData = (newValue: any) => {
    // Update data immediately so calculateFn can read the new value
    console.log(index, id, newValue, "newValue in updateData");
    (data as any)[index][id as string] = newValue;
    if (originalData && originalData.length > 0) {
      const currentRow = data[index];
      console.log(currentRow)
      if (currentRow) {
        const rowInOriginal = originalData.find(
          (row) => (row as any).index === (currentRow as any).index
        );
        if (rowInOriginal) {
          (rowInOriginal as any)[id as string] = newValue;
        }
      }
    }
  };
  /////////
  const abortControllerRefUpdateData = useRef<AbortController | null>(null);
  const handleDebounceUpdateData = useCallback(
    debounce((value: string | number | boolean, updateData: (newValue: any) => void) => {
      console.log(value, "value");
      // Cancel any existing request
      if (abortControllerRefUpdateData.current) {
        abortControllerRefUpdateData.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRefUpdateData.current = new AbortController();

      updateData(value);
    }, 500),
    []
  );
  const abortControllerRefChangeRowValue = useRef<AbortController | null>(null);
  const handleDebounceChangeRowValue = useCallback(
    debounce((value: string | boolean, rowIndex: number, columnId: string, changeRowValues: (value: string | boolean, rowIndex: number, columnId: string) => void) => {
      console.log(value, "value");
      // Cancel any existing request
      if (abortControllerRefChangeRowValue.current) {
        abortControllerRefChangeRowValue.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRefChangeRowValue.current = new AbortController();

      changeRowValues(value, rowIndex, columnId);
    }, 500),
    []
  );
  const abortControllerRefUpdateMyData = useRef<AbortController | null>(null);
  const handleDebounceUpdateMyData = useCallback(
    debounce((value: string | boolean, rowIndex: number, columnId: string, updateMyData: (rowIndex: number, columnId: string, value: string) => void) => {
      console.log(value, "value");
      // Cancel any existing request
      if (abortControllerRefUpdateMyData.current) {
        abortControllerRefUpdateMyData.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRefChangeRowValue.current = new AbortController();

      updateMyData(rowIndex, columnId, value as string);
    }, 500),
    []
  );

  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: any
    if (isCurrency) {
      // Use handleCurrencyInputChange for currency fields
      val = handleCurrencyInputChange(e.target.value, setValue);
    } else {
      // Regular input handling
      val = convertToFarsiDigits(e.target.value);
      setValue(val);
    }
    handleDebounceUpdateData(val, updateData)
    handleDebounceUpdateMyData(String(val), index, id as string, updateMyData);

    if (changeRowValues)
      handleDebounceChangeRowValue(e.target.value, index, id, changeRowValues)
  };

  // Handle blur event
  const handleBlur = () => {
    (data as any)[index][id as string] = value as string;
    // Update originalData by finding matching row by id (not index, in case it's filtered)
    if (originalData && originalData.length > 0) {
      const currentRow = data[index];
      if (currentRow) {
        const rowInOriginal = originalData.find(
          (row) => (row as any).index === (currentRow as any).index
        );
        if (rowInOriginal) {
          (rowInOriginal as any)[id as string] = value as string;
        }
      }
    }
    // Notify parent (it handles the update efficiently with direct mutation)
    updateMyData(index, id, value as string);
    setIsFocused(false);
  };

  if (type === "date") {
    return (
      <div
        style={{
          backgroundColor:
            isFocused || selectedRowIndex === index
              ? "white"
              : !canEditForm
                ? "inherit"
                : bgColor || "white",
        }}
        className="w-full h-full"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <PersianDatePicker
          name={id as string}
          label=""
          value={dateValue}
          disabled={!canEditForm}
          fontSize="text-xs border-none"
          onChange={handleDateChange}
        />
      </div>
    );
  }
  if (type === "autoComplete") {
    // Map autoOptions to AutoCompleteSearch format (id, text)
    const mappedOptions = (autoOptions || []).map((opt: DefaultOptionType) => ({
      id: opt.id,
      text: opt.title ?? "",
    }));

    // Map current value to selectedOption format
    const selectedOption = value
      ? { id: String(value), title: value as string }
      : null;

    // Get column-specific props for AutoCompleteSearch
    const columnProps = column as any;
    const setField = columnProps.setField || (() => { });
    const fieldValues = columnProps.fieldValues || [];
    const fieldSearch = columnProps.fieldSearch || "search";
    const multiple = columnProps.multiple || false;
    const [isEntered, setIsEntered] = React.useState(false);

    return (
      <AutoCompleteSearch
        label=""
        labelWidth="w-0"
        setField={setField}
        fieldValues={fieldValues}
        fieldSearch={fieldSearch}
        selectedOption={selectedOption}
        setSelectedOption={(newValue) => {
          if (newValue && !Array.isArray(newValue)) {
            handleAutoCompleteChange(null, newValue);
          } else if (Array.isArray(newValue) && newValue.length > 0) {
            // For multiple mode, use the first item or handle accordingly
            handleAutoCompleteChange(null, newValue[0]);
          } else {
            handleAutoCompleteChange(null, null);
          }
        }}
        options={mappedOptions}
        disabled={!canEditForm}
        isEntered={isEntered}
        setIsEntered={setIsEntered}
        placeholder={placeholder}
        textAlign={align || "right"}
        multiple={multiple}
        isLoading={isLoading || false}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        desktopfontsize="12px"
      />
    );
  }
  if (type === "textArea") {
    return (
      <textarea
        disabled={!canEditForm}
        className="text-inherit p-0 m-0 border-0 w-full focus:outline-none"
        value={value as string}
        onChange={(e) => setValue(convertToFarsiDigits(e.target.value))}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        style={{
          backgroundColor:
            isFocused || selectedRowIndex === index
              ? "white"
              : !canEditForm
                ? "inherit"
                : bgColor || "white",
        }}
      />
    );
  }
  if (type === "checkbox") {
    return (
      <input
        type="checkbox"
        disabled={!canEditForm}
        className="text-inherit p-0 m-0 border-0 w-full focus:outline-none"
        checked={Boolean(value)}
        onChange={(e) => {
          setValue(e.target.checked);
          updateData(e.target.checked);
          changeRowValues(e.target.checked, index, id);
        }}
      />
    );
  }
  return (
    <input
      disabled={!canEditForm}
      className="text-inherit p-0 m-0 border-0 w-full focus:outline-none whitespace-pre-wrap text-wrap"
      style={{
        backgroundColor:
          isFocused || selectedRowIndex === index
            ? "white"
            : !canEditForm
              ? "inherit"
              : bgColor || "white",
      }}
      //style={{ backgroundColor: isFocused && canEditForm ? "white" :  "inherit" }}
      value={typeof value === "string" ? value : ""}
      onChange={handleChange} //changeRowValues(e.target.value, index, id);
      //onBlur={handleBlur}
      onFocus={() => {
        setIsFocused(true);
      }}
    />
  );
}

export default function TTable<T extends object>({
  canEditForm,
  columns,
  data,
  originalData,
  //calculatedFieldfns,
  updateMyData = () => { },
  updateMyRow = () => { },
  changeRowValues = () => { },
  //skipPageReset,
  fontSize = "0.75rem",
  wordWrap = true,
  hasSumRow = false,
  changeRowSelectColor = false,
  setSelectedId,
  CellColorChange,
  showToolTip = false,
  showHeader = true,
  selectedRowIndex,
  setSelectedRowIndex,
  maxVisibleColumns,
  collapsedColumnWidth = 15,
  enableColumnResize = false,
  onColumnResize,
  initialColumnWidths,
}: TableProps<T>) {
  //const [rowSelect, setRowSelect] = useState(0);

  const { width } = useCalculateTableHeight();
  const [showTableHeader, setShowTableHeader] = useState<boolean>(showHeader);

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizeStateRef = React.useRef<{
    isResizing: boolean;
    resizingColumn: string | null;
    startX: number;
    startWidth: number;
  }>({
    isResizing: false,
    resizingColumn: null,
    startX: 0,
    startWidth: 0,
  });
  const onColumnResizeRef = React.useRef(onColumnResize);

  // Update ref when callback changes
  useEffect(() => {
    onColumnResizeRef.current = onColumnResize;
  }, [onColumnResize]);

  useEffect(() => {
    if (!maxVisibleColumns || width > 768) {
      setShowTableHeader(showHeader);
    } else {
      setShowTableHeader(true);
    }
  }, [showHeader, width]);

  // Initialize column widths from parent or column definitions
  useEffect(() => {
    if (enableColumnResize && columns.length > 0) {
      setColumnWidths((prev) => {
        // If we already have widths set, don't reinitialize (preserve user resizes)
        if (Object.keys(prev).length > 0) {
          return prev;
        }

        const initialWidths: Record<string, number> = {};

        // First, use initialColumnWidths from parent if provided
        if (
          initialColumnWidths &&
          Object.keys(initialColumnWidths).length > 0
        ) {
          // Get visible columns to calculate total percentage
          const visibleColumns = columns.filter(
            (col: any) => (col as any).visible !== false
          );
          const totalVisiblePercentage = visibleColumns.reduce(
            (sum, col: any) => {
              const columnId = col.id ?? col.accessor;
              const value = initialColumnWidths[columnId];
              // Only count if it's a percentage (< 100) and column is visible
              if (value && value < 100 && (col as any).visible !== false) {
                return sum + value;
              }
              return sum;
            },
            0
          );

          // Convert percentages to pixels if values are small (likely percentages)
          // Assume values < 100 are percentages, values >= 100 are already pixels
          Object.keys(initialColumnWidths).forEach((key) => {
            const value = initialColumnWidths[key];
            // Find the column to check if it's visible
            const col = columns.find(
              (c: any) => (c.id ?? c.accessor) === key
            ) as any;
            if (value < 100) {
              // Treat as percentage and convert to pixels
              // If total percentage > 100, scale proportionally; otherwise use direct conversion
              if (
                totalVisiblePercentage > 100 &&
                col &&
                col.visible !== false
              ) {
                // Scale proportionally to fit table width
                initialWidths[key] = (width * value) / totalVisiblePercentage;
              } else {
                initialWidths[key] = (width * value) / 100;
              }
            } else {
              // Treat as pixels
              initialWidths[key] = value;
            }
          });
        }

        // Then, fill in missing widths from column definitions
        columns.forEach((col: any) => {
          const columnId = col.id ?? col.accessor;
          if (columnId && !initialWidths[columnId]) {
            // Parse width from string (e.g., "20%" or "200px") or use default
            const widthStr = col.width || col.totalWidth || "100px";
            if (typeof widthStr === "string") {
              if (widthStr.includes("%")) {
                // For percentage, calculate based on table width
                const percent = parseFloat(widthStr);
                initialWidths[columnId] = (width * percent) / 100;
              } else if (widthStr.includes("px")) {
                initialWidths[columnId] = parseFloat(widthStr);
              } else {
                initialWidths[columnId] = 100; // default
              }
            } else {
              initialWidths[columnId] = widthStr || 100;
            }
          }
        });
        return initialWidths;
      });
    }
  }, [columns, enableColumnResize, width, initialColumnWidths]);

  // Track previous columnWidths to only notify on actual changes
  const prevColumnWidthsRef = React.useRef<Record<string, number>>({});

  // Notify parent when column widths change (only on actual changes, not on every render)
  useEffect(() => {
    if (enableColumnResize && Object.keys(columnWidths).length > 0) {
      // Only notify if widths actually changed (not just a reference change)
      const prevWidths = prevColumnWidthsRef.current;
      const hasChanged =
        Object.keys(columnWidths).some(
          (key) => prevWidths[key] !== columnWidths[key]
        ) ||
        Object.keys(prevWidths).length !== Object.keys(columnWidths).length;

      if (hasChanged && onColumnResizeRef.current) {
        onColumnResizeRef.current(columnWidths);
        prevColumnWidthsRef.current = { ...columnWidths };
      }
    }
  }, [columnWidths, enableColumnResize]);

  // Handle column resize
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent, columnId: string) => {
      if (!enableColumnResize) return;
      e.preventDefault();
      e.stopPropagation();

      const currentWidth = columnWidths[columnId] || 100;
      resizeStateRef.current = {
        isResizing: true,
        resizingColumn: columnId,
        startX: e.clientX,
        startWidth: currentWidth,
      };

      // Add global mouse event listeners
      const handleMouseMove = (e: MouseEvent) => {
        const state = resizeStateRef.current;
        if (!state.isResizing || !state.resizingColumn) return;
        const diff = e.clientX - state.startX;
        const newWidth = Math.max(50, state.startWidth + diff); // Minimum width 50px
        setColumnWidths((prev) => {
          const updated = {
            ...prev,
            [state.resizingColumn!]: newWidth,
          };
          // Call callback with updated widths during resize (optional - can be removed if only want final value)
          // onColumnResize?.(updated);
          return updated;
        });
      };

      const handleMouseUp = () => {
        resizeStateRef.current = {
          isResizing: false,
          resizingColumn: null,
          startX: 0,
          startWidth: 0,
        };
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        // The useEffect will automatically call onColumnResize when columnWidths updates
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [enableColumnResize, columnWidths]
  );

  // Process columns for mobile/tablet responsiveness
  const processedColumns = React.useMemo(() => {
    // Only apply column collapsing on mobile/tablet
    if (!maxVisibleColumns || width > 768) {
      return columns;
    }
    //reduce invisible columns
    const tempColumns = (columns as Column[]).filter(
      (column) => column.visible !== false
    );
    const visibleColumns = tempColumns.slice(0, maxVisibleColumns - 1);
    const hiddenColumns = tempColumns.slice(maxVisibleColumns - 1);

    console.log(visibleColumns, hiddenColumns);
    const visibleColumnWidth =
      (100 - collapsedColumnWidth) / visibleColumns.length;
    const processedVisibleColumns = visibleColumns.map((vc) => {
      return { ...vc, width: visibleColumnWidth.toString() + "%" };
    });

    // Create a collapsed column for hidden columns
    const collapsedColumn = {
      Header: `سایر (${convertToFarsiDigits(hiddenColumns.length)})`,
      accessor: "collapsed",
      align: "center",
      width: collapsedColumnWidth.toString() + "%", //(100-totalVisibleWidth).toString()+"%",
      Cell: ({ row }: any) => {
        return (
          <div className="text-xs space-y-1 p-1">
            {hiddenColumns.map((col: any, index: number) => {
              const columnId = col.id ?? col.accessor;
              const key = `${String(columnId)}-${index}`;
              return (
                <div
                  key={key}
                  className="flex flex-col items-center border-b border-gray-200 pb-1 last:border-b-0"
                >
                  <div className="font-semibold text-gray-600 mb-1">
                    {col.Header}
                  </div>
                  <div className="flex justify-center">
                    {col.Cell
                      ? React.createElement(col.Cell as any, {
                        value: row.original[col.accessor],
                        row: { index: row.index, original: row.original },
                        column: { ...col, id: col.id ?? col.accessor },
                        updateMyData,
                        updateMyRow,
                        changeRowValues,
                        canEditForm,
                        selectedRowIndex,
                      })
                      : row.original[col.accessor] ?? "-"}
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    };

    console.log([...processedVisibleColumns, collapsedColumn]);
    return [...processedVisibleColumns, collapsedColumn];
  }, [columns, maxVisibleColumns, width]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows, // all rows, no pagination
  } = useTable(
    {
      columns: processedColumns,
      data: data ? data : [],
      originalData: originalData ? originalData : [],
      //calculatedFieldfns,
      updateMyData,
      updateMyRow,
      changeRowValues,
      canEditForm,
      selectedRowIndex,
      setSelectedRowIndex,
    } as any,
    useBlockLayout
  );

  const tHead = (
    <thead className="bg-gray-200 ">
      {headerGroups.map((headerGroup, i) => {
        const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
        return (
          <tr
            key={i}
            {...headerGroupProps}
            className="border-b border-gray-300 "
          >
            {headerGroup.headers.map((column: any) =>
              column.visible === false ? null : (
                <th
                  {...column.getHeaderProps()}
                  scope="col"
                  className="py-1 text-center font-semibold text-gray-500 uppercase tracking-wider bg-gray-300 relative"
                  key={String(column.id)}
                  style={{
                    borderLeft: column.noLeftBorder
                      ? "none"
                      : "1px solid #D0D0D0",
                    textAlign: column.align ?? "center",
                    width:
                      enableColumnResize &&
                        columnWidths[column.id ?? column.accessor]
                        ? `${columnWidths[column.id ?? column.accessor]}px`
                        : column.totalWidth || column.width,
                    backgroundColor: column.backgroundColor ?? colors.gray200,
                    position: "relative",
                  }}
                >
                  <div className="flex items-center justify-center">
                    {column.render("Header")}
                  </div>
                  {enableColumnResize && (
                    <div
                      onMouseDown={(e) =>
                        handleMouseDown(e, column.id ?? column.accessor)
                      }
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 bg-transparent z-10"
                      style={{
                        right: "-2px",
                        width: "4px",
                      }}
                      title="کشیدن برای تغییر عرض ستون"
                    />
                  )}
                </th>
              )
            )}
          </tr>
        );
      })}
    </thead>
  );

  const tBody = (
    <tbody {...getTableBodyProps()} className="bg-white">
      {rows.length > 0 ? (
        rows.map((row: any, i: number) => {
          //console.log(row,"row in tBody processedData");
          prepareRow(row);
          const { key, ...rowProps } = row.getRowProps();
          return (
            <tr
              key={i}
              {...rowProps}
              className="border-b border-gray-300 hover:cursor-pointer hover:bg-yellow-50"
              onMouseUp={() => {
                // Check if text was selected after mouse up
                const selection = window.getSelection();
                const hasTextSelection =
                  selection && selection.toString().length > 0;

                // Only trigger row selection if no text was selected
                if (!hasTextSelection) {
                  if (setSelectedId) {
                    //console.log(row.original["id" as keyof T],"row.original in TTable")
                    const itemId = Number(
                      convertToLatinDigits(row.original["id" as keyof T])
                    );
                    console.log("selected id in ttable", itemId);
                    setSelectedId?.(itemId);
                  }
                  //setRowSelect(i);
                  setSelectedRowIndex?.(i);
                }
              }}
            >
              {row.cells.map((cell: any) => {
                if (cell.column.visible === false) return null;
                //console.log(cell.column)
                return (
                  <td
                    {...cell.getCellProps()}
                    className="text-gray-500 flex justify-start items-center px-1 select-text"
                    key={cell.column.id}
                    title={showToolTip ? cell.value : ""}
                    style={{
                      borderLeft: cell.column.noLeftBorder
                        ? "none"
                        : "1px solid #e0e0e0",
                      width:
                        enableColumnResize &&
                          columnWidths[cell.column.id ?? cell.column.accessor]
                          ? `${columnWidths[
                          cell.column.id ?? cell.column.accessor
                          ]
                          }px`
                          : cell.column.totalWidth || cell.column.width,
                      backgroundColor: (() => {
                        // Priority 1: CellColorChange (if it returns a non-null value)
                        if (
                          CellColorChange &&
                          (!cell.column.backgroundColor ||
                            cell.column.except === true)
                        ) {
                          const cellColor = CellColorChange(
                            row,
                            cell.column.id
                          );
                          if (cellColor !== null && cellColor !== undefined) {
                            return cellColor;
                          }
                        }
                        // Priority 2: Selected row color
                        if (i === selectedRowIndex && changeRowSelectColor) {
                          return colors.blue50;
                        }
                        // Priority 3: Column background color or default
                        return cell.column.backgroundColor || "white";
                      })(),
                      whiteSpace: "pre-wrap",
                      textWrap: !wordWrap && width > 768 ? "nowrap" : "wrap",
                      overflow: !wordWrap && width > 768 ? "hidden" : "visible",
                      fontWeight: cell.column.isBold ? "bold" : "normal",
                      userSelect: "text",
                      WebkitUserSelect: "text",
                      ...(hasSumRow && i === rows.length - 1
                        ? {
                          backgroundColor: colors.gray200,
                          fontWeight: "bold",
                          textAlign: "right",
                        }
                        : {}),
                    }}
                  >
                    {hasSumRow &&
                      i === rows.length - 1 &&
                      cell.column.id === "index"
                      ? ""
                      : cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })
      ) : (
        <tr className="w-full">
          <td className="text-center py-4">هیچ رکوردی وجود ندارد</td>
        </tr>
      )}
    </tbody>
  );

  return (
    <table
      {...getTableProps()}
      className="table-fixed w-full border border-gray-300" // shadow-lg
      style={{ fontSize }}
    >
      {showTableHeader && tHead}
      {tBody}
    </table>
  );
}
