import { yellow } from "@mui/material/colors";
import { HeadCell } from "../../hooks/useTable";
import { Table } from "../controls/Table";
import { useWarehouseStore } from "../../store/warehouseStore";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";


type Message = { index: number; dsc: string };
function WarehouseMessages() {
  const { regResponse } = useWarehouseStore();
  const headCells: HeadCell<Message>[] = [
    {
      id: "index",
      label: "ردیف",
      disableSorting: true,
      cellWidth: "5%",
      isNumber: true,
      changeColor: true,
    },
    {
      id: "dsc",
      label: "شرح",
      disableSorting: true,
      cellWidth: "95%",
      isNumber: true,
      changeColor: true,
    },
  ];
  const handleCellColorChange = (cell: HeadCell<Message>) => {
    if (cell.changeColor) {
      return yellow[100];
    }
    return "";
  };
  const {height,width}=useCalculateTableHeight()

  const data = regResponse.data.result.dtlErrMsgs.map((dtlErrMsg, index) => ({
    index: index + 1,
    dsc: dtlErrMsg.msg,
  }));
  return (
    <div className="mt-2" style={width > 640 ? { height: height } : {}}>
      <Table
        data={data}
        headCells={headCells}
        wordWrap={true}
        cellColorChangeHandler={handleCellColorChange}
        cellFontSize="0.75rem"
      />
    </div>
  );
}

export default WarehouseMessages;
