import { IconButton } from "@mui/material";
import { useGeneralContext } from "../../context/GeneralContext";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  page?: number;
  setPage?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  totalCount: number;
};

export function TablePaginationActions(props: Props) {
  const { setDefaultRowsPerPage } = useGeneralContext();
  //const pages = pageNumbers.map((num) => ({
  //  label: convertToFarsiDigits(num),
  //  value: num,
  //}));

  const { page = 1, setPage, totalCount, pageSize = 10 } = props;

  const [inputValue, setInputValue] = useState<string>((page || 0) + 1 + "");
  const inputRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  setDefaultRowsPerPage(pageSize || 10);
  const lastPage = Math.max(0, Math.ceil(totalCount / pageSize) - 1);

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
        totalPage = Math.ceil(
          totalCount / (pageSize === undefined ? 10 : pageSize)
        );
      if (val > 0 && val <= totalPage) setPage?.(val);
    },
    [totalCount, pageSize, setPage]
  );

  const handleChangePage = (_event: unknown, newPage: number): void => {
    // Convert from 0-based to 1-based for API
    setPage?.(newPage + 1);
  };

  //const handleChangeRowsPerPage = (
  //  event: React.ChangeEvent<HTMLInputElement>
  //): void => {
  //  setPageSize?.(parseInt(event.target.value, 10));
  //  setPage?.(1);
  //};

  return (
    <div className="flex w-full bg-gray-100 justify-center">
      <IconButton
        onClick={() => handleChangePage(null, lastPage)}
        disabled={page >= lastPage}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
      <IconButton
        onClick={() => handleChangePage(null, page + 1)}
        disabled={page >= lastPage}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>

      <div className="border m-2 px-2 py-1 border-gray-200 place-content-center rounded-md">
        {totalCount
          ? convertToFarsiDigits(
              Math.ceil(totalCount / (pageSize === undefined ? 10 : pageSize))
            )
          : convertToFarsiDigits(0)}
      </div>
      <input
        className="w-16 m-2 rounded-md border border-gray-200 text-center"
        /*type="number"
        min={1}
        max={
          totalCount
            ? Math.ceil(totalCount / (pageSize === undefined ? 10 : pageSize))
            : 0
        }*/
        type="text"
        inputMode="decimal"
        pattern="[۰-۹0-9]*"
        value={convertToFarsiDigits(inputValue)}
        autoFocus={inputRef.current}
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(convertToLatinDigits(value));
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
        onClick={() => handleChangePage(null, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={() => handleChangePage(null, 0)}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
    </div>
  );
}
