import React, { useEffect, useState } from "react";
import { Column, DefaultOptionType, TableColumns } from "../../types/general";
import { CellProps, useTable, useBlockLayout } from "react-table";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import AutoComplet from "./AutoComplet";

type TableProps<T extends object> = {
  canEditForm?: boolean;
  columns: TableColumns;
  data: T[];
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
  const [value, setValue] = React.useState<string | boolean>(initialValue);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (
      initialValue &&
      initialValue.props?.children?.props.type === "checkbox"
    ) {
      setValue(initialValue.props.children.props.checked);
    } else if (typeof initialValue === "boolean") {
      setValue(initialValue);
    } else {
      setValue(
        convertToFarsiDigits(
          isCurrency ? formatNumberWithCommas(initialValue) : initialValue
        )
      );
    }
  }, [initialValue]);

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
      updateMyData(index, id, (newValue as DefaultOptionType)?.title ?? "");
    }
  };

  if (type === "autoComplete") {
    return (
      <AutoComplet
        disabled={!canEditForm}
        options={autoOptions || []}
        value={value ? { id: 0, title: value as string } : null}
        handleChange={handleAutoCompleteChange}
        setSearch={setSearch}
        showLabel={false}
        inputPadding="0 !important"
        outlinedInputPadding="5px"
        placeholder={placeholder}
        showBold={false}
        desktopfontsize="12px"
        showClearIcon={false}
        showBorder={false}
        changeColorOnFocus={true}
        showBorderFocused={true}
        textColor={colors.gray_600}
        backgroundColor={!canEditForm ? "inherit" : "white"}
        textAlign={align}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
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
        onBlur={() => {
          updateMyData(index, id, value as string);
          setIsFocused(false);
        }}
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
          changeRowValues(
            e.target.checked,
            index,
            id ?? (column as any)?.accessor
          ); //rowIndex, columnId
        }}
      />
    );
  }

  return (
    <>
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
        value={value as string}
        onChange={(e) => {
          setValue(convertToFarsiDigits(e.target.value));
          changeRowValues(e.target.value, index, id);
        }}
        onBlur={() => {
          updateMyData(index, id, value as string);
          setIsFocused(false);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
      />
    </>
  );
}

export default function TTable<T extends object>({
  canEditForm,
  columns,
  data,
  updateMyData = () => {},
  updateMyRow = () => {},
  changeRowValues = () => {},
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
        if (initialColumnWidths && Object.keys(initialColumnWidths).length > 0) {
          // Get visible columns to calculate total percentage
          const visibleColumns = columns.filter((col: any) => (col as any).visible !== false);
          const totalVisiblePercentage = visibleColumns.reduce((sum, col: any) => {
            const columnId = col.id ?? col.accessor;
            const value = initialColumnWidths[columnId];
            // Only count if it's a percentage (< 100) and column is visible
            if (value && value < 100 && (col as any).visible !== false) {
              return sum + value;
            }
            return sum;
          }, 0);
          
          // Convert percentages to pixels if values are small (likely percentages)
          // Assume values < 100 are percentages, values >= 100 are already pixels
          Object.keys(initialColumnWidths).forEach((key) => {
            const value = initialColumnWidths[key];
            // Find the column to check if it's visible
            const col = columns.find((c: any) => (c.id ?? c.accessor) === key) as any;
            if (value < 100) {
              // Treat as percentage and convert to pixels
              // If total percentage > 100, scale proportionally; otherwise use direct conversion
              if (totalVisiblePercentage > 100 && col && col.visible !== false) {
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
      const hasChanged = Object.keys(columnWidths).some(
        (key) => prevWidths[key] !== columnWidths[key]
      ) || Object.keys(prevWidths).length !== Object.keys(columnWidths).length;
      
      if (hasChanged && onColumnResizeRef.current) {
        onColumnResizeRef.current(columnWidths);
        prevColumnWidthsRef.current = { ...columnWidths };
      }
    }
  }, [columnWidths, enableColumnResize]);

  // Handle column resize
  const handleMouseDown = React.useCallback((e: React.MouseEvent, columnId: string) => {
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
  }, [enableColumnResize, columnWidths]);

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
                  width: enableColumnResize && columnWidths[column.id ?? column.accessor]
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
                    onMouseDown={(e) => handleMouseDown(e, column.id ?? column.accessor)}
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
                      width: enableColumnResize && columnWidths[cell.column.id ?? cell.column.accessor]
                        ? `${columnWidths[cell.column.id ?? cell.column.accessor]}px`
                        : cell.column.totalWidth || cell.column.width,
                      backgroundColor: (() => {
                        // Priority 1: CellColorChange (if it returns a non-null value)
                        if (
                          CellColorChange &&
                          (!cell.column.backgroundColor ||
                            cell.column.except === true)
                        ) {
                          const cellColor = CellColorChange(row, cell.column.id);
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
