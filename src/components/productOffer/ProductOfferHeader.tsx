import { TableColumns } from "../../types/general";
import { ProductOffer } from "../../types/productOffer";
import PageTitle from "../layout/PageTitle";
import { handleExport } from "../../utilities/ExcelExport";
import Add32 from "../../assets/images/GrayThem/add32.png";
//import Add24Disabled from "../../assets/images/GrayThem/add24_disabled.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import Del24 from "../../assets/images/GrayThem/del24.png";
import Del24Disabled from "../../assets/images/GrayThem/del_disabled24.png";
import Edit24 from "../../assets/images/GrayThem/edit24.png";
import Edit24Disabled from "../../assets/images/GrayThem/edit24_disabled.png";
import Accept24 from "../../assets/images/GrayThem/accept24.png";
import Accept24Disabled from "../../assets/images/GrayThem/accept24_disabled.png";
import { ProductPerm } from "../../types/productPerm";
import { ProductGrace } from "../../types/productGrace";
import { ProductPrice } from "../../types/productPrice";
import { Indent } from "../../types/product";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import ExcelIcon from "../../assets/images/GrayThem/excel24.png";
import { useEffect, useState } from "react";
type Props = {
  columns: TableColumns;
  setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  handleEdit: () => void;
  handleConfirm: () => void;
  selectedProductOffer:
    | ProductOffer
    | ProductPerm
    | ProductGrace
    | ProductPrice
    | Indent
    | null;
  data: any[];
  refetch: () => void;
  definitionInvironment: DefinitionInvironment;
};

const ProductOfferHeader = ({
  columns,
  setIsNew,
  handleDelete,
  handleEdit,
  handleConfirm,
  selectedProductOffer,
  data,
  refetch,
  definitionInvironment,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
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
    <header className="flex flex-col gap-2 md:flex-row items-center justify-between border-gray-300 border-b pb-2">
      <PageTitle definitionInvironment={definitionInvironment} />
      <div className="flex px-4 items-center gap-4">
        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => {
            console.log("new");
            setIsNew(true);
          }} // for new
        >
          <img src={Add32} alt="Add32" className="w-6 h-6" />
          <p className="text-xs">جدید</p>
        </div>
        <div
          className={`flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 ${
            selectedProductOffer === null || selectedProductOffer.flwId !== 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={
            () =>
              selectedProductOffer === null || selectedProductOffer.flwId !== 0
                ? null
                : handleDelete() //for productOffer/productOfferDel
          }
        >
          <img
            src={
              selectedProductOffer === null || selectedProductOffer.flwId !== 0
                ? Del24Disabled
                : Del24
            }
            alt="Del24"
            className="w-6 h-6"
          />
          <p className="text-xs">حذف</p>
        </div>
        <div
          className={`flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 ${
            selectedProductOffer === null || selectedProductOffer.flwId !== 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={
            () =>
              selectedProductOffer === null || selectedProductOffer.flwId !== 0
                ? null
                : handleEdit() // for edit
          } // for edit
        >
          <img
            src={
              selectedProductOffer === null || selectedProductOffer.flwId !== 0
                ? Edit24Disabled
                : Edit24
            }
            alt="Edit24"
            className="w-6 h-6"
          />
          <p className="text-xs">ویرایش</p>
        </div>
        <div
          className={`flex flex-col items-center hover:font-bold hover:bg-gray-300 rounded-md p-1 ${
            selectedProductOffer === null || selectedProductOffer.flwId !== 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => {
            selectedProductOffer === null || selectedProductOffer.flwId !== 0
              ? console.log(
                  selectedProductOffer,
                  "selectedProductOffer is null or flwId is not 0"
                )
              : handleConfirm();
          }}
        >
          <img
            src={
              selectedProductOffer === null || selectedProductOffer.flwId !== 0
                ? Accept24Disabled
                : Accept24
            }
            alt="Accept24"
            className="w-6 h-6"
          />
          <p className="text-xs">تایید</p>
        </div>

        <div
          className="flex flex-col items-center justify-center  cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() =>
            handleExport({
              data: data,
              setIsModalOpen,
              headCells: columns,
              fileName: "data_export.xlsx",
              hasPersianTitle: true,
            })
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

        <div
          className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
          onClick={() => refetch()}
        >
          <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
          <p className="text-xs">بازخوانی</p>
        </div>
      </div>
    </header>
  );
};

export default ProductOfferHeader;
