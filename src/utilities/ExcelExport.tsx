import * as XLSX from "xlsx";

import ExcelIcon from "../assets/images/GrayThem/excel24.png";
import React, { useEffect, useState } from "react";
import ModalMessage from "../components/layout/ModalMessage";
import { TableColumns } from "../types/general";

type ExportToExcelProps<T> = {
  headCells: TableColumns;
  data: T[];
};

type HandleExportProps<T> = ExportToExcelProps<T> & {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileName: string;
};

export const handleExport = ({
  data,
  setIsModalOpen,
  headCells,
  fileName,
}: HandleExportProps<any>) => {
  if (!data || data.length === 0) {
    setIsModalOpen(true);
    return;
  }
  const exportData = data.map((item: any, rowIndex: number) => {
    const row: Record<string, any> = {};
    headCells.forEach((cell: any) => {
      //console.log(cell);
      if (cell.columns) {
        cell.columns.forEach((column: any) => {
          row[column.Header] = (item as any)[column.accessor];
        });
      } else {
        if (cell.accessor === "index") {
          row[cell.accessor] = rowIndex + 1;
        } else {
          row[cell.accessor] = (item as any)[cell.accessor];
        }
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
};

const ExcelExport = <T extends object>({
  data,
  headCells,
}: ExportToExcelProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileName = "data_export.xlsx";

  useEffect(() => {
    let timeoutId: number;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center  cursor-pointer"
        onClick={() =>
          handleExport({ data, setIsModalOpen, headCells, fileName })
        }
      >
        <img
          src={ExcelIcon}
          alt="ExcelIcon"
          className="w-6 h-6"
          style={{ filter: data?.length > 0 ? "none" : "grayscale(100%)" }}
        />
        <p className="text-xs">اکسل</p>
      </div>
      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="اطلاعاتی برای انتقال به اکسل وجود ندارد."
      />
    </>
  );
};

export default ExcelExport;
