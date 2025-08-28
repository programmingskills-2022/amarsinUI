import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import useTailwindTable, { HeadCell, HeaderGroup } from "../../hooks/useTailwindTable";

type TableProps<T> = {
  data: T[];
  headCells: HeadCell<T>[];
  headerGroups?: HeaderGroup[];
  pagination?: boolean;
  cellClickHandler?: (cell: HeadCell<T>, item: T) => void;
  cellColorChangeHandler?: (cell: HeadCell<T>, item: T) => string;
  rowClickHandler?: (
    item: T,
    setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  ) => void;
  hasSumRow?: boolean;
  page?: number;
  setPage?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  totalCount?: number;
  setSelectedId?: (value: number) => void;
  cellFontSize?: string;
  wordWrap?: boolean;
};

export function TailwindTable<T>({
  data,
  headCells,
  headerGroups,
  pagination = false,
  cellClickHandler,
  cellColorChangeHandler,
  rowClickHandler,
  hasSumRow = false,
  page = 0,
  setPage,
  pageSize = 10,
  setPageSize,
  totalCount,
  setSelectedId,
  cellFontSize,
  wordWrap,
}: TableProps<T>) {
  const [filterFn] = useState<{
    fn: (items: T[]) => T[];
  }>({
    fn: (items) => items,
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaging,
    recordsAfterSorting,
    mobileMainColumns,
    mobileRestColumns,
  } = useTailwindTable<T>(
    data,
    headCells,
    headerGroups ?? [],
    filterFn,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount
  );

  const navigate = useNavigate();
  const records = pagination ? recordsAfterPaging() : recordsAfterSorting();
  const inputRef = useRef<{ idx: number; i: number }>({ idx: 0, i: 0 });
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const renderInput = (item: T, cell: HeadCell<T>, i: number, idx: number) => {
    return (
      <input
        type="text"
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        autoFocus={
          i === inputRef.current.i && idx === inputRef.current.idx
            ? true
            : false
        }
        value={
          cell.val?.[idx] === "0"
            ? String(item[cell.id as keyof T])
            : cell.val?.[idx]
        }
        onChange={(e) => {
          cell.setVal?.(e, idx);
          inputRef.current = { idx: idx, i: i };
        }}
        style={{
          backgroundColor:
            selectedRowId === item["id" as keyof T]
              ? "#f5f5f5"
              : cell.backgroundColor || "transparent",
        }}
        onClick={() => {
          console.log("enter" + i);
          inputRef.current = { idx: idx, i: i };
        }}
        onKeyDown={() => {
          console.log("enter" + i);
          inputRef.current = { idx: idx, i: i };
        }}
        onMouseDown={() => {
          console.log("enter" + i);
          inputRef.current = { idx: idx, i: i };
        }}
      />
    );
  };

  const TblCell = ({
    displayValue,
    cell,
    item,
    lastRow,
    i,
    idx,
    isMobile,
  }: {
    displayValue: any;
    cell: HeadCell<T>;
    item: T;
    lastRow: boolean;
    i: number;
    idx: number;
    isMobile: boolean;
  }) => {
    return (
      <>
        {isMobile ? (
          <div
            key={String(cell.id)}
            className="mb-2"
            onClick={() => {
              if (cellClickHandler) {
                cellClickHandler(cell, item);
              } else if (cell.path) {
                navigate(`${cell.path}/${item[cell.id as keyof T]}`);
              }
            }}
          >
            <strong className="text-gray-700">{cell.label}:</strong>
            <span className="ml-2">
              {cell.type === "input"
                ? renderInput(item, cell, i, idx)
                : typeof displayValue === "string" ||
                  typeof displayValue === "number" ||
                  React.isValidElement(displayValue)
                ? displayValue
                : displayValue !== undefined && displayValue !== null
                ? String(displayValue)
                : ""}
            </span>
          </div>
        ) : (
          <td
            key={String(cell.id)}
            title={wordWrap ? "" : String(item[cell.id as keyof T])}
            className={`px-2 py-2 text-sm border border-gray-300 ${
              wordWrap ? "whitespace-normal" : "whitespace-nowrap overflow-hidden"
            } ${cellFontSize ? `text-[${cellFontSize}]` : ""}`}
            style={{
              width: cell.cellWidth,
              backgroundColor:
                rowClickHandler && selectedRowId === item["id" as keyof T]
                  ? "#eff6ff"
                  : cell.changeColor && cellColorChangeHandler
                  ? cellColorChangeHandler(cell, item)
                  : cell.backgroundColor,
            }}
            onClick={() => {
              if (cellClickHandler && !lastRow) {
                cellClickHandler(cell, item);
              } else if (cell.path) {
                navigate(`${cell.path}/${item[cell.id as keyof T]}`);
              }
            }}
          >
            {cell.type === "input"
              ? renderInput(item, cell, i, idx)
              : typeof displayValue === "string" ||
                typeof displayValue === "number" ||
                React.isValidElement(displayValue)
              ? displayValue
              : displayValue !== undefined && displayValue !== null
              ? String(displayValue)
              : ""}
          </td>
        )}
      </>
    );
  };

  const Cells = ({
    columns,
    item,
    idx,
    shrinkInOneColumn,
  }: {
    columns: HeadCell<T>[];
    item: T;
    idx: number;
    shrinkInOneColumn: boolean;
  }) => {
    return shrinkInOneColumn ? (
      <td className={`px-2 py-2 text-sm border border-gray-300 ${cellFontSize ? `text-[${cellFontSize}]` : ""}`}>
        {columns.map((cell: HeadCell<T>, i) => {
          const lastRow = idx === records.length - 1;
          let displayValue = returnDisplayValue(cell, item, lastRow, idx, i);

          return (
            <TblCell
              cell={cell}
              displayValue={displayValue}
              i={i}
              idx={idx}
              item={item}
              lastRow={lastRow}
              key={i}
              isMobile={shrinkInOneColumn}
            />
          );
        })}
      </td>
    ) : (
      columns.map((cell: HeadCell<T>, i) => {
        const lastRow = idx === records.length - 1;
        let displayValue = returnDisplayValue(cell, item, lastRow, idx, i);
        return (
          cell.isNotVisible !== true && (
            <TblCell
              cell={cell}
              displayValue={displayValue}
              i={i}
              idx={idx}
              item={item}
              lastRow={lastRow}
              key={i}
              isMobile={false}
            />
          )
        );
      })
    );
  };

  const returnDisplayValue = (
    cell: HeadCell<T>,
    item: T,
    lastRow: boolean,
    idx: number,
    i: number
  ): string | JSX.Element | T[keyof T] => {
    let displayValue;
    if (
      cell.type === "input" &&
      inputRef.current.idx === idx &&
      inputRef.current.i === i
    ) {
      inputRef.current = { idx: idx, i: i };
    }

    if (cell.icon !== undefined) {
      displayValue =
        hasSumRow && lastRow ? "" : <img src={cell.icon} alt={cell.label} className="w-4 h-4" />;
    } else if (cell.id === "index") {
      if (hasSumRow && lastRow) {
        displayValue = "";
      } else {
        displayValue = convertToFarsiDigits(
          pagination ? page * pageSize + idx + 1 : idx + 1
        );
      }
    } else if (cell.isCurrency) {
      displayValue = convertToFarsiDigits(
        formatNumberWithCommas(item[cell.id as keyof T] as number)
      );
    } else {
      const value = item[cell.id as keyof T];
      displayValue =
        cell.isNumber && value !== undefined && value !== null
          ? convertToFarsiDigits(value as string | number | null | undefined)
          : value;
    }
    return displayValue;
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <TblContainer>
        <TblHead />
        <tbody>
          {records.length > 0 ? (
            records.map((item, idx) => {
              const itemId = item["id" as keyof T] as number;
              return (
                <React.Fragment key={idx}>
                  <tr
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedId?.(itemId);
                      if (rowClickHandler)
                        rowClickHandler(item, setSelectedRowId);
                    }}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      idx === records.length - 1 && hasSumRow
                        ? "bg-gray-200 font-bold"
                        : ""
                    } ${cellFontSize ? `text-[${cellFontSize}]` : ""}`}
                  >
                    {/* Main columns - visible on all screens */}
                    <Cells
                      columns={mobileMainColumns}
                      idx={idx}
                      item={item}
                      key={idx}
                      shrinkInOneColumn={false}
                    />
                    
                    {/* Details column - only visible on mobile */}
                    <td className="px-2 py-2 text-sm border border-gray-300 md:hidden">
                      <Cells
                        columns={mobileRestColumns}
                        idx={idx}
                        item={item}
                        key={idx}
                        shrinkInOneColumn={true}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td 
                colSpan={headCells.length + 1} 
                className="px-4 py-8 text-center text-red-400 border border-gray-300"
              >
                <div className="flex justify-center items-center h-full">
                  <span className="text-lg">رکوردی یافت نشد</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </TblContainer>
      {pagination && records.length > 0 && <TblPagination />}
    </div>
  );
} 