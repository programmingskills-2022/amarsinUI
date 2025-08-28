import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { SxProps } from "@mui/system";
import { convertToFarsiDigits } from "../utilities/general";
import { useGeneralContext } from "../context/GeneralContext";
import { ceil } from "lodash";

export type HeadCell<T> = {
  id: keyof T | "index" | string;
  label: string;
  disableSorting?: boolean;
  isNumber?: boolean;
  isCurrency?: boolean;
  icon?: string;
  path?: string;
  hasDetails?: boolean;
  cellWidth: string;
  backgroundColor?: string;
  isNotVisible?: boolean;
  changeColor?: boolean;
  type?: string;
  val?: string[];
  setVal?: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
};

export type HeaderGroup = {
  label: string;
  colSpan: number;
  backgroundColor?: string;
};

type FilterFn<T> = {
  fn: (items: T[]) => T[];
};

type UseTableReturn<T> = {
  TblContainer: React.FC<{ children: ReactNode }>;
  TblHead: React.FC;
  TblPagination: React.FC;
  recordsAfterPaging: () => T[];
  recordsAfterSorting: () => T[];
  isMobile: boolean;
  mobileMainColumns: HeadCell<T>[];
  mobileRestColumns: HeadCell<T>[];
};

export default function useTable<T>(
  records: T[],
  headCells: HeadCell<T>[],
  headerGroups: HeaderGroup[],
  filterFn: FilterFn<T>,
  page?: number,
  setPage?: (page: number) => void,
  pageSize?: number,
  setPageSize?: (pageSize: number) => void,
  totalCount?: number
): UseTableReturn<T> {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const mobileMainColumns = headCells.slice(0, 4);
  const mobileRestColumns = headCells.slice(4);

  const { setDefaultRowsPerPage, pageNumbers } = useGeneralContext();
  const pages = pageNumbers.map((num) => ({
    label: convertToFarsiDigits(num),
    value: num,
  }));

  const [order, setOrder] = useState<"asc" | "desc" | undefined>();
  const [orderBy, setOrderBy] = useState<keyof T | "">("");
  const [inputValue, setInputValue] = useState<string>((page || 0) + 1 + "");
  const timeoutRef = useRef<number | null>(null);
  const inputRef = useRef<boolean>(false);

  // Update input value when page changes
  useEffect(() => {
    setInputValue((page || 0) + 1 + "");
  }, [page]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced page change function
  const debouncedSetPage = useCallback(
    (value: string) => {
      const val: number = Number(value);
      let totalPage = 0;
      if (totalCount !== undefined)
        totalPage = ceil(totalCount / (pageSize === undefined ? 10 : pageSize));
      if (val > 0 && val <= totalPage) setPage?.(val);
    },
    [totalCount, pageSize, setPage]
  );

  const tableStyles: SxProps = {
    "& thead th": {
      position: "sticky",
      top: 0,
      zIndex: 1,
      padding: "1px 1px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "gray",
      borderRight: "1px solid lightgray",
      borderTop: "1px solid lightgray",
      borderBottom: "1px solid lightgray",
      "&:last-child": {
        borderRight: "none",
      },
    },

    "& tbody td": {
      padding: "2px 4px",
      fontWeight: 300,
      borderRight: "1px solid lightgray",
      "&:last-child": {
        borderRight: "none",
      },
      color: theme.palette.grey[700],
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  };

  const TblContainer: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div
      className="w-full sm:overflow-y-auto" //overflow-x-hidden
      /*"w-full 2xl:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-250px)] max-h-[calc(100vh-350px)] overflow-y-auto overflow-x-auto"*/
    >
      <Table sx={tableStyles} className="md:min-w-[600px]">
        {children}
      </Table>
    </div>
  );

  const handleSortRequest = (cellId: keyof T) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const TblHead: React.FC = () => {
    return (
      <TableHead>
        {!isMobile && headerGroups.length > 0 && (
          <TableRow>
            {headerGroups.map((group, idx) => (
              <TableCell
                key={idx}
                colSpan={group.colSpan}
                align="center"
                sx={{
                  backgroundColor:
                    group.backgroundColor || theme.palette.grey[300],
                }}
              >
                {group.label}
              </TableCell>
            ))}
          </TableRow>
        )}
        <TableRow>
          {(isMobile ? mobileMainColumns : headCells).map(
            (headCell) =>
              headCell.isNotVisible !== true && (
                <TableCell
                  key={String(headCell.id)}
                  align="center"
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      visibility: headCell.disableSorting ? "hidden" : "visible",
                      width: headCell.disableSorting ? "0px" : "auto",
                      margin: headCell.disableSorting ? "0px" : "auto"
                    },
                    "& .MuiTableSortLabel-icon svg": {
                      visibility: headCell.disableSorting ? "hidden" : "visible",

                    },
                    "& .MuiSvgIcon-root": {
                      visibility: headCell.disableSorting ? "hidden" : "visible",
                    },
                    "& .MuiTableSortLabel-root": {
                      paddingRight: headCell.disableSorting ? "0px" : "auto",
                      paddingLeft: headCell.disableSorting ? "0px" : "auto"
                    },
                    width:headCell.cellWidth,
                    backgroundColor: headCell.changeColor //اگر رنگ سلول باید در شرایط خاص تغییر کند رنگ هدر ثابت بماند
                      ? theme.palette.grey[300]
                      : headCell.backgroundColor || theme.palette.grey[300],
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleSortRequest(headCell.id as keyof T)}
                    disabled={headCell.disableSorting}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              )
          )}
          {isMobile && mobileRestColumns.length > 0 && (
            <TableCell sx={{ backgroundColor: theme.palette.grey[300], width:"50px" }}>
              جزئیات
            </TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  };

  // Custom Pagination Actions
  function TablePaginationActions(props: any) {
    const { count, page, rowsPerPage, onPageChange } = props;
    setDefaultRowsPerPage(rowsPerPage || 10);
    const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

    return (
      <div className="flex w-full bg-gray-100">
        <IconButton
          onClick={() => onPageChange(null, lastPage)}
          disabled={page >= lastPage}
          aria-label="last page"
        >
          <LastPage />
        </IconButton>
        <IconButton
          onClick={() => onPageChange(null, page + 1)}
          disabled={page >= lastPage}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>

        <div className="border m-2 px-2 py-1 border-gray-200 place-content-center rounded-md">
          {totalCount
            ? convertToFarsiDigits(
                ceil(totalCount / (pageSize === undefined ? 10 : pageSize))
              )
            : convertToFarsiDigits(0)}
        </div>

        <input
          className="w-16 m-2 pr-1 rounded-md border border-gray-200"
          type="number"
          min={1}
          max={
            totalCount
              ? ceil(totalCount / (pageSize === undefined ? 10 : pageSize))
              : 0
          }
          value={inputValue}
          autoFocus={inputRef.current}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            inputRef.current = true;

            // Clear existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Set new timeout for debounced API call
            timeoutRef.current = window.setTimeout(() => {
              debouncedSetPage(value);
            }, 500); // 500ms delay
          }}
        />

        <IconButton
          onClick={() => onPageChange(null, page - 1)}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={() => onPageChange(null, 0)}
          disabled={page === 0}
          aria-label="first page"
        >
          <FirstPage />
        </IconButton>
      </div>
    );
  }

  const handleChangePage = (_event: unknown, newPage: number): void => {
    // Convert from 0-based to 1-based for API
    console.log(newPage, "newPage");
    setPage?.(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPageSize?.(parseInt(event.target.value, 10));
    setPage?.(1);
  };

  const TblPagination: React.FC = () => (
    <div
      dir="rtl"
      className={`${
        isMobile ? "text-xs" : "text-sm"
      } w-full bg-gray-100 flex justify-center items-center`}
    >
      <TablePagination
        component="div"
        page={page || 0}
        rowsPerPageOptions={pages}
        rowsPerPage={pageSize || 10}
        count={totalCount || 0}
        onPageChange={handleChangePage}
        ActionsComponent={TablePaginationActions}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? "تعداد" : "تعداد در صفحه:"}
        labelDisplayedRows={() => ``}
        // {({ from, to, count }) =>
        //   `${convertToFarsiDigits(from)}-${convertToFarsiDigits(
        //     to
        //   )} از ${convertToFarsiDigits(count)}`
        // }
        dir="rtl"
      />
    </div>
  );

  const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T): number => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (
    order: "asc" | "desc" | undefined,
    orderBy: keyof T
  ): ((a: T, b: T) => number) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array: T[], comparator: (a: T, b: T) => number): T[] => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const recordsAfterPaging = (): T[] => {
    return records;
  };

  const recordsAfterSorting = (): T[] => {
    const sorted = order && orderBy ? getComparator(order, orderBy) : () => 0;
    return stableSort(filterFn.fn(records), sorted);
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaging,
    recordsAfterSorting,
    isMobile,
    mobileMainColumns,
    mobileRestColumns,
  };
}
