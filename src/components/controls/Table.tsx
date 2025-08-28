import {
  TableBody,
  TableCell,
  TableRow,
  useTheme,
  Typography,
} from "@mui/material";

import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import React, { useRef, useState } from "react";
import useTable, { HeadCell, HeaderGroup } from "../../hooks/useTable";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

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

export function Table<T>({
  data,
  headCells,
  headerGroups,
  //resetPageSignal,
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
    isMobile,
    mobileMainColumns,
    mobileRestColumns,
  } = useTable<T>(
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
  const theme = useTheme();
  const records = pagination ? recordsAfterPaging() : recordsAfterSorting();
  const inputRef = useRef<{ idx: number; i: number }>({ idx: 0, i: 0 });
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  //const [focusFlag,setFocusFlag] = useState(false)

  const renderInput = (item: T, cell: HeadCell<T>, i: number, idx: number) => {
    return (
      <input
        type="text"
        className="w-full"
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
          //console.log(e.target.value);
          inputRef.current = { idx: idx, i: i };
        }}
        style={{
          backgroundColor:
            !isMobile && !selectedRowId === item["id" as keyof T]
              ? cell.backgroundColor
              : !isMobile && selectedRowId === item["id" as keyof T]
              ? "whitesmoke"
              : "transparent",
        }}
        onClick={()=>{console.log("enter"+i);inputRef.current={ idx: idx, i: i }}}
        onKeyDown={()=>{console.log("enter"+i);inputRef.current={ idx: idx, i: i }}}
        onMouseDown={()=>{console.log("enter"+i);inputRef.current={ idx: idx, i: i }}}
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
    i: number; // index of the cell in the row
    idx: number; // index of the item in the records array
    isMobile: boolean;
  }) => {
    return (
      <>
        {isMobile ? (
          <div
            key={String(cell.id)}
            onClick={() => {
              if (cellClickHandler) {
                cellClickHandler(cell, item);
              } else if (cell.path) {
                navigate(`${cell.path}/${item[cell.id as keyof T]}`);
              }
            }}
          >
            <strong>{cell.label}:</strong>
            {/* if item[cell] is of "input" type */}
            {cell.type === "input"
              ? renderInput(item, cell, i, idx)
              : typeof displayValue === "string" ||
                typeof displayValue === "number" ||
                React.isValidElement(displayValue)
              ? displayValue
              : displayValue !== undefined && displayValue !== null
              ? String(displayValue)
              : ""}
          </div>
        ) : (
          <TableCell
            title={wordWrap ? "" : String(item[cell.id as keyof T])}
            key={String(cell.id)}
            sx={{
              whiteSpace: "pre-wrap",
              maxWidth: !wordWrap ? "20px" : "",
              width: cell.cellWidth,
              textWrap: !wordWrap ? "nowrap" : "wrap",
              overflow: !wordWrap ? "hidden" : "auto",
              fontSize: isMobile ? "0.7rem" : cellFontSize,
              backgroundColor:
                rowClickHandler && selectedRowId === item["id" as keyof T]
                  ? blue[50]
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
            {isMobile && <strong>{cell.label}:</strong>}
            {/* if item[cell] is of "input" type */}
            {cell.type === "input"
              ? renderInput(item, cell, i, idx)
              : typeof displayValue === "string" ||
                typeof displayValue === "number" ||
                React.isValidElement(displayValue)
              ? displayValue
              : displayValue !== undefined && displayValue !== null
              ? String(displayValue)
              : ""}
          </TableCell>
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
      <TableCell
        sx={{
          fontSize: isMobile
            ? "0.7rem"
            : cellFontSize /*, width: cell.cellWidth */,
        }}
      >
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
      </TableCell>
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
        hasSumRow && lastRow ? "" : <img src={cell.icon} alt={cell.label} />;
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
        <TableBody sx={{ overflowY: "auto" }}>
          {records.length > 0 ? (
            records.map((item, idx) => {
              const itemId = item["id" as keyof T] as number;
              return (
                <React.Fragment key={idx}>
                  <TableRow
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedId?.(itemId);
                      if (rowClickHandler)
                        rowClickHandler(item, setSelectedRowId);
                    }}
                    sx={
                      idx === records.length - 1 && hasSumRow
                        ? {
                            fontSize: isMobile ? "0.7rem" : cellFontSize,
                            backgroundColor: theme.palette.grey[200],
                            fontWeight: "bold",
                          }
                        : {
                            fontSize: isMobile ? "0.7rem" : cellFontSize,
                          }
                    }
                  >
                    <Cells
                      columns={isMobile ? mobileMainColumns : headCells}
                      idx={idx}
                      item={item}
                      key={idx}
                      shrinkInOneColumn={false}
                    />
                    {isMobile && (
                      <TableCell
                        sx={{ fontSize: isMobile ? "0.7rem" : cellFontSize }}
                      >
                        <Cells
                          columns={mobileRestColumns}
                          idx={idx}
                          item={item}
                          key={idx}
                          shrinkInOneColumn={true}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headCells.length + (isMobile ? 1 : 0)}>
                <div className="flex justify-center items-center h-full p-6 text-red-400">
                  <Typography variant="body1">رکوردی یافت نشد</Typography>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TblContainer>
      {pagination && records.length > 0 && <TblPagination />}
    </div>
  );
}
