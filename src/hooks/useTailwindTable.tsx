import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
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
  mobileMainColumns: HeadCell<T>[];
  mobileRestColumns: HeadCell<T>[];
};

export default function useTailwindTable<T>(
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

  const TblContainer: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-full border-collapse border border-gray-300">
        {children}
      </table>
    </div>
  );

  const handleSortRequest = (cellId: keyof T) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const TblHead: React.FC = () => {
    return (
      <thead className="bg-gray-100">
        {/* Header Groups - Hidden on mobile */}
        <tr className="hidden md:table-row">
          {headerGroups.map((group, idx) => (
            <th
              key={idx}
              colSpan={group.colSpan}
              className="px-2 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300"
              style={{
                backgroundColor: group.backgroundColor || "#f3f4f6",
              }}
            >
              {group.label}
            </th>
          ))}
        </tr>
        <tr className="bg-gray-100">
          {/* Main columns - visible on all screens */}
          {mobileMainColumns.map(
            (headCell) =>
              headCell.isNotVisible !== true && (
                <th
                  key={String(headCell.id)}
                  className="px-2 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-200"
                  style={{
                    width: headCell.cellWidth,
                    backgroundColor: headCell.changeColor
                      ? "#f3f4f6"
                      : headCell.backgroundColor || "#f3f4f6",
                  }}
                  onClick={() => {
                    if (!headCell.disableSorting) {
                      handleSortRequest(headCell.id as keyof T);
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{headCell.label}</span>
                    {!headCell.disableSorting && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            orderBy === headCell.id && order === "asc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={`w-3 h-3 ${
                            orderBy === headCell.id && order === "desc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              )
          )}
          {/* Details column - only visible on mobile */}
          <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border border-gray-300 bg-gray-100 md:hidden">
            جزئیات
          </th>
        </tr>
      </thead>
    );
  };

  // Custom Pagination Actions
  function TablePaginationActions(props: any) {
    const { count, page, rowsPerPage, onPageChange } = props;
    setDefaultRowsPerPage(rowsPerPage || 10);
    const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

    return (
      <div className="flex w-full bg-gray-100 items-center justify-center gap-2 p-2">
        <button
          onClick={() => onPageChange(null, lastPage)}
          disabled={page >= lastPage}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="last page"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => onPageChange(null, page + 1)}
          disabled={page >= lastPage}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="next page"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="border border-gray-200 px-2 py-1 rounded-md text-sm">
          {totalCount
            ? convertToFarsiDigits(
                ceil(totalCount / (pageSize === undefined ? 10 : pageSize))
              )
            : convertToFarsiDigits(0)}
        </div>

        <input
          className="w-16 px-2 py-1 rounded-md border border-gray-200 text-center text-sm"
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

        <button
          onClick={() => onPageChange(null, page - 1)}
          disabled={page === 0}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="previous page"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => onPageChange(null, 0)}
          disabled={page === 0}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="first page"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

  const handleChangePage = (_event: unknown, newPage: number): void => {
    // Convert from 0-based to 1-based for API
    console.log(newPage, "newPage");
    setPage?.(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setPageSize?.(parseInt(event.target.value, 10));
    setPage?.(1);
  };

  const TblPagination: React.FC = () => (
    <div className="w-full bg-gray-100 border-t border-gray-300">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span>تعداد در صفحه:</span>
          <select
            value={pageSize || 10}
            onChange={handleChangeRowsPerPage}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {pages.map((pageOption) => (
              <option key={pageOption.value} value={pageOption.value}>
                {pageOption.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span>
            {convertToFarsiDigits((page || 0) * (pageSize || 10) + 1)}-
            {convertToFarsiDigits(
              Math.min((page || 0) * (pageSize || 10) + (pageSize || 10), totalCount || 0)
            )}{" "}
            از {convertToFarsiDigits(totalCount || 0)}
          </span>
        </div>
      </div>
      
      <TablePaginationActions
        count={totalCount || 0}
        page={page || 0}
        rowsPerPage={pageSize || 10}
        onPageChange={handleChangePage}
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
    mobileMainColumns,
    mobileRestColumns,
  };
} 