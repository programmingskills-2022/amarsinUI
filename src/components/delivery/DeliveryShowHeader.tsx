import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { ResultDeliveryShow } from "../../types/delivery";
import { convertToFarsiDigits } from "../../utilities/general";
import { FaCircle } from "react-icons/fa";
import { useTTacStore } from "../../store/ttacStore";
import { useTtac } from "../../hooks/useTtac";
import { colors } from "../../utilities/color";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { DefaultOptionType } from "../../types/general";
import { WarehouseSearchResponse } from "../../types/warehouse";

type Props = {
  deliveryShowResponse: ResultDeliveryShow;
  warehouseSearchResponse: WarehouseSearchResponse
  canEditForm: boolean;
};

const DeliveryShowHeader = ({ deliveryShowResponse, warehouseSearchResponse, canEditForm }: Props) => {
  const { titacResponse, isFetchingTitac: isLoadingTitac } = useTtac();
  const [warehouse, setWarehouse] = useState<DefaultOptionType | null>(null);
  const { setField: setTTacField } = useTTacStore();
  const { setField: setWarehouseField } = useOrderStore();
  const [isWarehouseEntered, setIsWarehouseEntered] = useState<boolean>(false);
  const [ttacTextColor, setTtacTextColor] = useState<string>("");
  const [isTitacClick, setIsTitacClick] = useState<boolean>(false);
  const [deliveryMstId, setDeliveryMstId] = useState<number>(0);

  /*useEffect(() => {
    setWarehouseField("search", "ا");
    setWarehouseField("page", 1);
    setWarehouseField("pageSize", 30);
    setWarehouseField("lastId", 0);
    setWarehouseField("CustomerTypeId", -1);
    setWarehouseField("PartKey", 0);
  }, []);*/

  useEffect(() => {
    setIsTitacClick(false);
    setWarehouse({
      id: deliveryShowResponse.wId,
      title: convertToFarsiDigits(deliveryShowResponse.wName) ?? "",
    });
    switch (
    deliveryShowResponse.deliveryMst &&
    deliveryShowResponse.deliveryMst?.status
    ) {
      case 0:
        setTtacTextColor(colors.blue500);
        break;
      case 1:
        setTtacTextColor(colors.green700);
        break;
      case -1:
        setTtacTextColor(colors.gray_500);
        break;
      default:
        setTtacTextColor(colors.red500);
        break;
    }
  }, [deliveryShowResponse]);

  useEffect(() => {
    if (titacResponse.data.result?.status === -10)
      return;
    switch (titacResponse.data.result && titacResponse.data.result?.status) {
      case 0:
        setTtacTextColor(colors.blue500);
        break;
      case 1:
        setTtacTextColor(colors.green700);
        break;
      case -1:
        setTtacTextColor(colors.gray_500);
        break;
      default:
        setTtacTextColor(colors.red500);
        break;
    }
  }, [titacResponse]);
  useEffect(() => {
    //console.log(deliveryShowResponse.deliveryMst.id, "deliveryMstId");
    if (deliveryShowResponse.deliveryMst.id !== 0) {
      setDeliveryMstId(deliveryShowResponse.deliveryMst.id);
    }
  }, [deliveryShowResponse.deliveryMst.id]);
  //for /api/TTAC/Titac?Id=1123156
  const ttacClick = () => {
    setIsTitacClick(true);
    setTTacField("ttacRequestId", deliveryMstId);
    // Increment trigger to force refetch even with same values
    setTTacField("ttacRequestIdTrigger", Date.now());
  };
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-1/3 flex">
          <label className="p-1 w-24 text-left">شناسه - کد:</label>
          <input
            type="text"
            value={convertToFarsiDigits(deliveryShowResponse.deliveryMst.code)}
            disabled
            className="text-xs md:text-sm w-full p-1 text-gray-400 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/3 flex">
          <label className="p-1 w-24 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              `${deliveryShowResponse.deliveryMst.dat} - ${deliveryShowResponse.deliveryMst.tim}`
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/3 flex">
          <AutoCompleteSearch
            label="انبار"
            labelWidth="w-16"
            setField={setWarehouseField}
            fieldValues={[
              { field: "page", value: 1 },
              { field: "pageSize", value: 30 },
              { field: "lastId", value: 0 },
              { field: "CustomerTypeId", value: -1 },
              { field: "PartKey", value: 0 },
            ]}
            fieldSearch="search"
            options={warehouseSearchResponse.data.result.searchResults.map(
              (b) => ({
                id: b.id,
                text: convertToFarsiDigits(b.text),
              })
            )}
            selectedOption={warehouse as DefaultOptionType}
            setSelectedOption={(newValue) => {
              setWarehouse(newValue as DefaultOptionType);
            }}
            isEntered={isWarehouseEntered}
            setIsEntered={setIsWarehouseEntered}
            disabled={!canEditForm}
          />
          {/*<div className="flex items-center justify-between w-full">
            <label className="p-1 w-24 text-left">انبار:</label>
            <AutoComplete
              disabled={!canEditForm}
              options={warehouseSearchResponse.data.result.searchResults.map(
                (b) => ({
                  id: b.id,
                  title: b.text,
                })
              )}
              value={{
                id: deliveryShowResponse.wId,
                title: convertToFarsiDigits(deliveryShowResponse.wName),
              }}
              handleChange={(_event, newValue) => {
                console.log(newValue);
              }}
              setSearch={setWarehouseSearch}
              showLabel={false}
              outlinedInputPadding="10px"
              backgroundColor={"transparent"}
              showClearIcon={false}
              inputPadding="0 !important"
              desktopfontsize="12px"
              placeholder="انبار را انتخاب کنید..."
            />
          </div>*/}
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-2/3 flex">
          <label className="p-1 w-24 text-left">خریدار :</label>
          <input
            type="text"
            value={deliveryShowResponse.deliveryMst.srName}
            disabled
            className="text-xs md:text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/3 flex">
          <label className="p-1 w-24 text-left">GLN:</label>
          <input
            type="text"
            value={convertToFarsiDigits(deliveryShowResponse.deliveryMst.gln)}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex">
        <label className="p-1 w-24 text-left">توضیحات:</label>
        <input
          type="text"
          value={convertToFarsiDigits(deliveryShowResponse.deliveryMst.exp)}
          disabled
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center justify-center">
        <div
          className="flex items-center justify-right w-24"
          onClick={ttacClick}
        >
          <label className="p-1 w-full text-left cursor-pointer hover:font-bold hover:underline">
            تیتک:
          </label>
          <div className={`px-1 rounded ${isLoadingTitac ? "animate-pulse" : ""} `}>
            <FaCircle style={{ color: ttacTextColor }} size={10} />
          </div>
        </div>
        <input
          type="text"
          disabled={!canEditForm}
          value={
            isTitacClick
              ? convertToFarsiDigits(titacResponse.data.result.msg)
              : convertToFarsiDigits(deliveryShowResponse.deliveryMst.msg)
          }
          className={`text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md bg-transparent ${isLoadingTitac ? "animate-pulse" : ""}`}
          style={{ color: ttacTextColor }}
        />
      </div>
    </div>
  );
};

export default DeliveryShowHeader;
