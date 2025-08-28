import { useCallback, useEffect, useRef, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { DefaultOptionType } from "../../types/general";
import { convertToFarsiDigits } from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import Input from "../controls/Input";
import { useProductStore } from "../../store/productStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { ProductSearchRequest } from "../../types/product";
import { debounce } from "lodash";

type Props = {
  product: DefaultOptionType | null;
  setProduct: (product: DefaultOptionType | null) => void;
  cnt: number;
  setCnt: (cnt: number) => void;
  cost: number;
  setCost: (cost: number) => void;
};

const OrderEdit = ({
  product,
  setProduct,
  cnt,
  setCnt,
  cost,
  setCost,
}: Props) => {
  const { products } = useProducts();
  const [productSearch, setProductSearch] = useState("");

  const { setField: setProductField } = useProductStore();

  const { systemId, yearId } = useGeneralContext();
  const abortControllerRef = useRef<AbortController | null>(null);
  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  useEffect(() => {
    setProductField("accSystem", systemId);
    setProductField("accYear", yearId);
    handleDebounceFilterChange("searchTerm", productSearch);
    setProductField("page", 1);
  }, [productSearch, systemId, yearId]);

  ///////////////////////////////////////////////////////
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setProductField(field as keyof ProductSearchRequest, value);
    }, 500),
    [setProductField]
  );
  ///////////////////////////////////////////////////////
  const handleInputChange = (event: any, newInputValue: string) => {
    console.log(event);
    const persianInput = convertToFarsiDigits(newInputValue);
    setProductSearch(persianInput);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className=" flex w-full rounded-md">
        <AutoComplete
          options={products.map((p) => ({
            id: p.pId,
            title: convertToFarsiDigits(p.n),
          }))}
          value={product}
          handleChange={(_event, newValue) => {
            return setProduct(newValue as DefaultOptionType | null);
          }}
          inputValue={productSearch}
          onInputChange={handleInputChange}
          showLabel={false}
          inputPadding="0 !important"
          showClearIcon={false}
          changeColorOnFocus={true}
          placeholder="کالا را انتخاب کنید."
        />
      </div>
      <div className=" flex w-full rounded-md">
        <Input
          name="cnt"
          label="تعداد:"
          type="number"
          value={cnt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCnt(Number(e.target.value))
          }
          widthDiv="w-1/2"
          widthLabel="w-12"
          widthInput="w-full-minus-12"
          variant="outlined"
        />
        <Input
          name="cost"
          label="قیمت:"
          type="number"
          value={cost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCost(Number(e.target.value))
          }
          widthDiv="w-1/2"
          widthLabel="w-12"
          widthInput="w-full-minus-12"
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default OrderEdit;
