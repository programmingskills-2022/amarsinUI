import { TableColumns } from "../../types/general";
import AttachmentImageLoader from "../../utilities/AttachmentImageLoader";
import TTable from "../controls/TTable";
import Skeleton from "../layout/Skeleton";

type Props = {
  columns: TableColumns;
  selectedRowIndex: number;
  setSelectedRowIndex: (index: number) => void;
  data: any[];
  setSelectedId: (id: number) => void;
  imageUrl: string;
  token: string;
  handleCellColorChange: (row: any) => string | null;
  isLoading: boolean;
};

const AttachmentShowTable = ({
  columns,
  selectedRowIndex,
  setSelectedRowIndex,
  data,
  setSelectedId,
  imageUrl,
  token,
  handleCellColorChange,
  isLoading,
}: Props) => {
  return (
    <div className="w-full flex gap-2">
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="w-1/2">
          <TTable
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            data={data}
            changeRowSelectColor={true}
            fontSize="14px"
            setSelectedId={setSelectedId}
            CellColorChange={handleCellColorChange}
          />
        </div>
      )}
      <div className="w-1/2 h-full">
        {imageUrl && (
          <div className="flex w-full h-full justify-center items-center overflow-y-auto">
            <AttachmentImageLoader
              key={imageUrl} // Use imageUrl as key, only changes when imageUrl changes
              authToken={token}
              imageUrl={imageUrl}
              options={{
                className:
                  "attachment-image transition-transform duration-300 ease-in-out",
                alt: "Attachment Image",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentShowTable;
