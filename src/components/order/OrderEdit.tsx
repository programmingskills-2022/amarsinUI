import {  useState } from "react";
import { DefaultOptionType } from "../../types/general";
import {
  convertToFarsiDigits,
  handleCurrencyInputChange,
  formatFarsiCurrency,
} from "../../utilities/general";
import Input from "../controls/Input";
import { useProductStore } from "../../store/productStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { OrderEditRow } from "./OrderRegShow";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import Button from "../controls/Button";
import { Product } from "../../types/product";

type Props = {
  products: Product[]
  orderEditRow: OrderEditRow;
  setOrderEditRow: React.Dispatch<React.SetStateAction<OrderEditRow>>;
  handleSubmit: () => void;
  isLoadingDtlUpdate: boolean;
};

const OrderEdit = ({
  products,
  orderEditRow,
  setOrderEditRow,
  handleSubmit,
  isLoadingDtlUpdate,
}: 
Props) => {
  const [isProductEntered, setIsProductEntered] = useState(false);
  const { setField: setProductField } = useProductStore();

  const { systemId, yearId } = useGeneralContext();
  //////////////////////////////////////////////////////////////
  const currencyInputChange = (field: string, value: string) => {
    const numericValue = handleCurrencyInputChange(value, () => {});
    setOrderEditRow({ ...orderEditRow, [field]: String(numericValue) });
  };
  return (
    <div className="flex flex-col gap-2 text-sm">
      {/*   کالا */}
      <AutoCompleteSearch
        label="کالا"
        labelWidth="w-20"
        setField={setProductField}
        fieldValues={[
          { field: "productSearchAccSystem", value: systemId },
          { field: "productSearchAccYear", value: yearId },
          { field: "productSearchPage", value: 1 },
        ]}
        fieldSearch="productSearchSearch"
        selectedOption={orderEditRow.product as DefaultOptionType}
        setSelectedOption={(product: any) =>
          setOrderEditRow({
            ...orderEditRow,
            product: product as DefaultOptionType,
          })
        }
        options={products.map((p) => ({
          id: p.pId,
          text: p.n,
        }))}
        isEntered={isProductEntered}
        setIsEntered={setIsProductEntered}
      />
      <div className=" flex w-full rounded-md">
        <Input
          name="cnt"
          label="تعداد:"
          value={convertToFarsiDigits(orderEditRow.cnt)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOrderEditRow({ ...orderEditRow, cnt: e.target.value })
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />
        <Input
          name="oCnt"
          label="آفر:"
          value={convertToFarsiDigits(orderEditRow.oCnt)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOrderEditRow({ ...orderEditRow, oCnt: e.target.value })
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />
      </div>
      <div className=" flex w-full rounded-md">
        <Input
          name="dcrmntPrcnt"
          label="درصد تخفیف:"
          value={convertToFarsiDigits(orderEditRow.dcrmntPrcnt)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOrderEditRow({
              ...orderEditRow,
              dcrmntPrcnt: e.target.value,
            })
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />
        <Input
          name="dcrmnt"
          label="تخفیف:"
          value={formatFarsiCurrency(orderEditRow.dcrmnt)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            currencyInputChange("dcrmnt", e.target.value)
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />
      </div>
      <div className=" flex w-full rounded-md">
        <Input
          name="cost"
          label="قیمت:"
          value={formatFarsiCurrency(orderEditRow.cost)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            currencyInputChange("cost", e.target.value)
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />
      </div>
      <div className="flex justify-end w-full items-end">
        <Button
          text={
            isLoadingDtlUpdate ? "در حال بروزرسانی اطلاعات..." : "ثبت اطلاعات"
          }
          backgroundColor="bg-green-500"
          color="text-white"
          backgroundColorHover="bg-green-600"
          colorHover="text-white"
          variant="shadow-lg w-48 h-10"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default OrderEdit;
