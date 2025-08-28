import React, { useState } from "react";
import { DefaultOptionType, TableColumns } from "../../types/general";
import { CellProps, useTable, useBlockLayout } from "react-table";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import AutoComplete from "./AutoComplete";

type TableProps<T extends object> = {
  canEditForm?: boolean;
  columns: TableColumns;
  data: T[];
  //options?: DefaultOptionType[];
  //setSearchText?: Dispatch<SetStateAction<string>>;
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
};

// Create an editable cell renderer
interface EditableCellProps<T extends object> extends CellProps<T, any> {
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
  updateMyRow?: (
    rowIndex: number,
    newValue: DefaultOptionType | DefaultOptionType[] | null,
    columnId?: string
  ) => void;
  //options?: DefaultOptionType[];
  //setSearchText: Dispatch<SetStateAction<string>>;
  changeRowValues: (
    value: string | boolean,
    rowIndex: number,
    columnId: string
  ) => void;
  canEditForm?: boolean;
}

export function EditableInput<T extends object>({
  canEditForm,
  value: initialValue,
  row: { index },
  column,
  //options,
  //setSearchText,
  updateMyData,
  updateMyRow,
  changeRowValues,
}: EditableCellProps<T>) {
  const {
    id,
    type,
    placeholder,
    isCurrency,
    options: autoOptions,
    setSearch,
    //search,
  } = column as any;
  const [value, setValue] = React.useState<string | boolean>(initialValue);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    //console.log(initialValue, "initialValue in useEffect"),
    if (typeof initialValue === "boolean") {
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
    //console.log(newValue, "newValue in handleAutoCompleteChange");
    setValue((newValue as DefaultOptionType)?.title ?? "");
    if (updateMyRow) {
      updateMyRow(index, newValue as DefaultOptionType, id);
    }
    if (newValue) {
      updateMyData(index, id, (newValue as DefaultOptionType)?.title ?? "");
    }
  };

  /*const handleInputChange = (event: any, newInputValue: string) => {
    if (setSearch && event !== null) {
      const persianInput = convertToFarsiDigits(newInputValue);
      setSearch?.(persianInput);
      //console.log(persianInput, event, "persianInput in handleInputChange");
    }
  };*/

  if (type === "autoComplete") {
    return (
      <AutoComplete
        disabled={!canEditForm}
        options={autoOptions || []}
        //value={options?.find((opt) => opt.title === value) || null}
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
        //onInputChange={handleInputChange}
        //inputValue={search}
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
          backgroundColor: isFocused
            ? "white"
            : !canEditForm
            ? "inherit"
            : "white",
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
        checked={value as boolean}
        onChange={(e) => {
          setValue(e.target.checked);
          changeRowValues(e.target.checked, index, id); //rowIndex, columnId
        }}
      />
    );
  }

  return (
    <input
      disabled={!canEditForm}
      className="text-inherit p-0 m-0 border-0 w-full focus:outline-none"
      style={{
        backgroundColor: isFocused
          ? "white"
          : !canEditForm
          ? "inherit"
          : "white",
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
      onFocus={() => setIsFocused(true)}
    />
  );
}

export default function TTable<T extends object>({
  canEditForm,
  columns,
  data,
  //options = [],
  //setSearchText,
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
}: TableProps<T>) {
  const [rowSelect, setRowSelect] = useState(0);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows, // all rows, no pagination
  } = useTable(
    {
      columns,
      data: data ? data : [],
      //defaultColumn,
      //autoResetPage: !skipPageReset,
      updateMyData,
      updateMyRow,
      changeRowValues,
      //options,
      //setSearchText,
      canEditForm,
    } as any,
    useBlockLayout
  );

  const tHead = (
    <thead className="bg-gray-200 ">
      {headerGroups.map((headerGroup) => (
        <tr
          {...headerGroup.getHeaderGroupProps()}
          className="border-b border-gray-300 "
        >
          {headerGroup.headers.map((column: any) =>
            column.visible === false ? null : (
              <th
                {...column.getHeaderProps()}
                scope="col"
                className="py-1 text-center font-semibold text-gray-500 uppercase tracking-wider bg-gray-300"
                key={String(column.id)}
                style={{
                  borderLeft: column.noLeftBorder
                    ? "none"
                    : "1px solid #D0D0D0",
                  textAlign: column.align ?? "center",
                  width: column.totalWidth || column.width,
                  backgroundColor: column.backgroundColor ?? colors.gray200,
                }}
              >
                {column.render("Header")}
              </th>
            )
          )}
        </tr>
      ))}
    </thead>
  );

  const tBody = (
    <tbody {...getTableBodyProps()} className="bg-white">
      {rows.length > 0 ? (
        rows.map((row: any, i: number) => {
          //console.log(row,"row in tBody processedData");
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className="border-b border-gray-300 hover:cursor-pointer hover:bg-yellow-50"
            >
              {row.cells.map((cell: any) => {
                if (cell.column.visible === false) return null;
                return (
                  <td
                    {...cell.getCellProps()}
                    className="text-gray-500  flex justify-start items-center px-1"
                    key={cell.column.id}
                    title={showToolTip ? cell.value : ""}
                    style={{
                      borderLeft: cell.column.noLeftBorder
                        ? "none"
                        : "1px solid #e0e0e0",
                      width: cell.column.totalWidth || cell.column.width,
                      backgroundColor:
                        i === rowSelect && changeRowSelectColor
                          ? colors.blue50
                          : CellColorChange && !cell.column.backgroundColor
                          ? CellColorChange(row, cell.column.id)
                          : cell.column.backgroundColor || "white",
                      whiteSpace: "pre-wrap",
                      textWrap: !wordWrap ? "nowrap" : "wrap",
                      overflow: !wordWrap ? "hidden" : "visible",
                      ...(hasSumRow && i === rows.length - 1
                        ? {
                            backgroundColor: colors.gray200,
                            fontWeight: "bold",
                            textAlign: "right",
                          }
                        : {}),
                    }}
                    onClick={() => {
                      if (setSelectedId) {
                        //console.log(row.original["id" as keyof T],"row.original in TTable")
                        const itemId = Number(
                          convertToLatinDigits(row.original["id" as keyof T])
                        );
                        setSelectedId?.(itemId);
                      }
                      setRowSelect(i);
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
      {showHeader && tHead}
      {tBody}
    </table>
  );
}
