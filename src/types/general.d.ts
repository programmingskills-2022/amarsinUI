import { ReactNode } from 'react';

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

export type Column = {
  Header: string;
  accessor: string;
  width?: string;
  backgroundColor?: string;
  type?: string;
  visible?: boolean;
  placeholder?: string;
  isCurrency?: boolean;
  options?: DefaultOptionType[]
  fieldValues?: {
    field: string;
    value: number;
  }[] 
  setSearch?: (search: string) => void;
  setField?: ((field: string, value: any) => void) 
  search?: string;
  fieldSearch?: string
  Cell?: (props: any) => ReactNode;
  noLeftBorder?: boolean;
  align?: string;
  except?: boolean; // if false, the column will not be colored used just in OrderRegShowTable.tsx
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isBold?: boolean;
};
export type ColumnGroup = {
  Header: string;
  columns: Column[];
  backgroundColor?: string;
  width?: string;
};

export type DefaultOptionType = {
  id: number;
  title: string;
};

export type DefaultOptionTypeStringId = {
  id: string;
  title: string;
};

interface Meta {
  errorCode: number;
  message: string | null;
  type: string;
}
// define a general response data
interface FormAfterClick {
  id: number;
  title: string | null;
  viewPath: string | null;
}

interface Result {
  id: number;
  err: number;
  msg: string;
  formAfterClick: FormAfterClick;
}

interface Data {
  result: Result;
}
//end define a general response data
interface SearchItem {
  id: number;
  text: string;
}

interface UpdateResult {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}

export type TableColumns = (ColumnGroup | Column)[];

