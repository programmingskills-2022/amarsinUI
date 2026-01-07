import { useBrand } from "../../hooks/useBrands";
//import AutoComplete from "../controls/AutoComplete";
import Input from "../controls/Input";
import {  DefaultOptionTypeStringId } from "../../types/general";
import {
  convertToFarsiDigits,
  convertToPersianDate,
} from "../../utilities/general";
import { useEffect, useState } from "react";
import { ProductOffer } from "../../types/productOffer";
import { ProductPerm } from "../../types/productPerm";
import { ProductGrace } from "../../types/productGrace";
import { DefinitionDateTime } from "../../types/definitionInvironment";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { useBrandStore } from "../../store/brandStore";
import { useGeneralContext } from "../../context/GeneralContext";

type Props = {
  isNew: boolean; //for check if isNew new else edit
  selectedProductOffer: ProductOffer | ProductPerm | ProductGrace | null; //for edit
  brand: DefaultOptionTypeStringId[] | null;
  setBrand: (brand: DefaultOptionTypeStringId[]) => void;
  //setBrandSearch: React.Dispatch<React.SetStateAction<string>>;
  dat: string;
  tim: string;
  dsc: string;
  setDat: React.Dispatch<React.SetStateAction<string>>;
  setTim: React.Dispatch<React.SetStateAction<string>>;
  setDsc: React.Dispatch<React.SetStateAction<string>>;
  canEditForm1: boolean;
  childButton?: React.ReactNode;
  definitionDateTime: DefinitionDateTime;
};

const ProductOfferFormParams = ({
  isNew,
  selectedProductOffer,
  brand,
  setBrand,
  //setBrandSearch,
  dat,
  tim,
  dsc,
  setDat,
  setTim,
  setDsc,
  canEditForm1,
  childButton,
  definitionDateTime
}: Props) => {
  const { brands } = useBrand();
  const {setField: setBrandField}=useBrandStore()
  const [isBrandsEntered,setIsBrandsEntered ]= useState(false)
  const {systemId}= useGeneralContext()
  //const { definitionDateTime } = useDefinitionInvironment();
  useEffect(() => {
    setDat(
      isNew
        ? convertToFarsiDigits(
            convertToPersianDate(new Date(definitionDateTime.date))
          )
        : convertToFarsiDigits(selectedProductOffer?.dat)
    );
    setTim(
      isNew
        ? convertToFarsiDigits(definitionDateTime.time)
        : convertToFarsiDigits(selectedProductOffer?.tim)
    );
  }, [definitionDateTime, selectedProductOffer]);

  useEffect(() => {
    setDsc(isNew ? "" : selectedProductOffer?.dsc ?? "");
  }, [selectedProductOffer]);

  return (
    <form className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-1/2">
        <div className="w-full">
          <Input
            name="dat"
            value={dat}
            label="تاریخ:"
            variant="outlined"
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            disabled
          />
        </div>
        <div className="w-full">
          <Input
            name="tim"
            value={tim}
            label="ساعت:"
            variant="outlined"
            widthDiv="w-full"
            widthLabel="w-32"
            widthInput="w-full"
            disabled
          />
        </div>
      </div>
      <div className="w-full flex items-center gap-2">
        <Input
          name="dsc"
          value={dsc}
          onChange={(e) => setDsc(e.target.value)}
          label="توضیحات:"
          variant="outlined"
          widthDiv="w-full"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
        />
        {childButton}
      </div>
      {canEditForm1 && (
        <>
          <div className="flex gap-2 items-center">
            <label className="text-lg font-bold">شرایط</label>
            <hr className="w-full border-2 border-gray-300" />
          </div>
          <AutoCompleteSearch
              label="برند"
              labelWidth="w-20"
              setField={setBrandField}
              fieldValues={[
                { field: "accSystem", value:systemId  },
              ]}
              fieldSearch="search"
              selectedOption={brand}
              setSelectedOption={(newValue) => {
                setBrand(
                  Array.isArray(newValue) 
                    ? newValue as DefaultOptionTypeStringId[]
                    : newValue 
                    ? [newValue as DefaultOptionTypeStringId]
                    : []
                );
              }}
              options={brands.map((b: any) => ({
                id: b.id,
                text: b.text,
              }))}
              isEntered={isBrandsEntered}
              setIsEntered={setIsBrandsEntered}
              multiple={true}
              placeholder={
                Array.isArray(brand) && brand.length > 0
                  ? undefined
                  : "برند را انتخاب کنید..."
              }
            />
          {/*<div className="w-full flex items-center">
            <label className="p-1 w-24 text-left">برند:</label>
            <div className="bg-slate-50 flex w-full">
              <AutoComplete
                options={brands.map((b) => ({
                  id: b.id,
                  title: b.text,
                }))}
                value={brand}
                handleChange={(_event, newValue) => {
                  return setBrand(newValue as DefaultOptionTypeStringId[]);
                }}
                multiple={true}
                setSearch={setBrandSearch}
                showLabel={false}
                outlinedInputPadding="10px"
                placeholder={
                  Array.isArray(brand) && brand.length > 0
                    ? undefined
                    : "برند را انتخاب کنید..."
                }
              />
            </div>
          </div>*/}
        </>
      )}
    </form>
  );
};

export default ProductOfferFormParams;
