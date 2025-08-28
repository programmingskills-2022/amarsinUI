import { ReactNode } from 'react';

export type Column = {
  Header: string;
  accessor: string;
  width?: string;
  backgroundColor?: string;
  type?: string;
  visible?:boolean;
  placeholder?:string;
  isCurrency?:boolean;
  options?:DefaultOptionType[]
  setSearch?: (search:string)=>void;
  search?: string;
  Cell?: (props: any) => ReactNode;
  noLeftBorder?:boolean;
  align?:string;
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

export type TableColumns = (ColumnGroup | Column)[];
