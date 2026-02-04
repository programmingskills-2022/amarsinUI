import { DefaultOptionType, TableColumns } from "../../types/general";
import OrderRegShowMobileItem from "./OrderRegShowMobileItem";

type Props = {
  processedData: any[];
  columns: TableColumns;
  salesPrice: DefaultOptionType | null;
};

const OrderRegShowMobileTable = ({
  processedData,
  columns,
  salesPrice,
}: Props) => {
  return (
    <>
      {processedData.map((item, index) => (
        <OrderRegShowMobileItem
          key={item.id}
          item={item}
          index={index}
          columns={columns}
          salesPrice={salesPrice}
        />
      ))}
    </>
  );
};

export default OrderRegShowMobileTable;
