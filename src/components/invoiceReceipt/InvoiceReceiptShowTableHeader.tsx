import { convertToFarsiDigits, convertToLatinDigits } from "../../utilities/general";

type Props = {
  brandSearch: string;
  setBrandSearch: (brandSearch: string) => void;
  productSearch: string;
  setProductSearch: (productSearch: string) => void;
  dtlDscSearch: string;
  setDtlDscSearch: (dtlDscSearch: string) => void;
};

const InvoiceReceiptShowTableHeader = ({brandSearch,setBrandSearch,productSearch,setProductSearch,dtlDscSearch,setDtlDscSearch}: Props) => {
  return (
    <div
      className="w-full h-8 flex justify-center md:justify-end items-center text-gray-500"
      style={{
        fontSize: "12px",
        fontWeight: "bold",
        border: "1px solid lightgray",
      }}
    >
      <div className="md:w-[2%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <input
        name="brandSearch"
        value={convertToFarsiDigits(brandSearch)}
        onChange={(e) => {
          setBrandSearch(convertToLatinDigits(e.target.value));
        }}
        className={`border p-1 text-sm w-1/4 md:w-[5%]`}
      />
      <input
        name="productSearch"
        value={convertToFarsiDigits(productSearch)}
        onChange={(e) => {
          setProductSearch(convertToLatinDigits(e.target.value));
        }}
        className={`border p-1 text-sm w-1/4 md:w-[25%]`}
      />
      <div className="md:w-[10%] md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200">
        شرکت
      </div>
      <div className="md:w-[10%] md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200">
        فروشگاه
      </div>
      <div className="md:w-[5%] md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200">
        آخرین
      </div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <div className="md:w-[5%] md:h-full border border-x-gray-300 bg-gray-200"></div>
      <input
        name="dtlDscSearch"
        value={convertToFarsiDigits(dtlDscSearch)}
        onChange={(e) => {
          setDtlDscSearch(convertToLatinDigits(e.target.value));
        }}
        className={`border p-1 text-sm w-1/4 md:w-[10%]`}
      />
      <div className="md:w-[3%] md:h-full border border-x-gray-300 bg-gray-200"></div>
    </div>
  );
};

export default InvoiceReceiptShowTableHeader;
