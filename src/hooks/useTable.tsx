import React, { useState, ReactNode } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  useTheme,
} from '@mui/material';
import { SxProps } from '@mui/system';

type HeadCell<T> = {
  id: keyof T;
  label: string;
  disableSorting?: boolean;
};

type FilterFn<T> = {
  fn: (items: T[]) => T[];
};

type UseTableReturn<T> = {
  TblContainer: React.FC<{ children: ReactNode }>;
  TblHead: React.FC;
  TblPagination: React.FC;
  recordsAfterPagingAndSorting: () => T[];
};

export default function useTable<T>(
  records: T[],
  headCells: HeadCell<T>[],
  filterFn: FilterFn<T>
): UseTableReturn<T> {
  // Ensure the function returns the expected object
  const theme = useTheme();

  const pages = [5, 10, 25];
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(pages[page]);
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>();
  const [orderBy, setOrderBy] = useState<keyof T | ''>('');

  const tableStyles: SxProps = {
    mt: 3,
    '& thead th': {
      fontWeight: 600,
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: 300,
    },
    '& tbody tr:hover': {
      backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  };

  const TblContainer: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Table sx={tableStyles}>{children}</Table>
  );

  const TblHead: React.FC = () => {
    const handleSortRequest = (cellId: keyof T) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={String(headCell.id)}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => handleSortRequest(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TblPagination: React.FC = () => (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={records.length}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );

  const descendingComparator = <T,>(
    a: T,
    b: T,
    orderBy: keyof T
  ): number => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (
    order: 'asc' | 'desc' | undefined,
    orderBy: keyof T
  ): ((a: T, b: T) => number) => {
    return order === 'desc'
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

  const recordsAfterPagingAndSorting = (): T[] => {
    const sorted = order && orderBy ? getComparator(order, orderBy) : () => 0;
    return stableSort(filterFn.fn(records), sorted).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };
  
  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  };
}
