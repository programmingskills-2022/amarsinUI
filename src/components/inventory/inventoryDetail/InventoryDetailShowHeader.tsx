import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import {
  InventoryDetailResponse,
  InventoryProductFlowResponse,
  InventoryUpdateCostRequest,
  InventoryUpdateIssueRequest,
} from "../../../types/inventory";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  currencyStringToNumber,
  formatNumberWithCommas,
  handleCurrencyInputChange,
} from "../../../utilities/general";
import Button from "../../controls/Button";
import { RadioGroup } from "../../controls/RadioGroup";
import Card from "../../controls/Card";
import { InputElement } from "../../controls/InputElement";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import Ok from "../../../assets/images/GrayThem/ok16.png";
import ModalForm from "../../layout/ModalForm";
import InventoryProductFlowShow from "./InventoryProductFlowShow";
import { useInventoryStore } from "../../../store/inventoryStore";

type Props = {
  inventoryDetailShowResponse: InventoryDetailResponse;
  inventoryUpdateIssue: UseMutateAsyncFunction<
    any,
    Error,
    InventoryUpdateIssueRequest,
    unknown
  >;
  inventoryUpdateCost: UseMutateAsyncFunction<
    any,
    Error,
    InventoryUpdateCostRequest,
    unknown
  >;
  setIsModalOpenCost: (value: boolean) => void;
  setIsModalOpenIssue: (value: boolean) => void;
  inventoryProductFlowResponse: InventoryProductFlowResponse;
  isLoading: boolean; //is loading inventory product flow
};

const InventoryDetailShowHeader = ({
  inventoryDetailShowResponse,
  inventoryUpdateIssue,
  inventoryUpdateCost,
  setIsModalOpenCost,
  setIsModalOpenIssue,
  inventoryProductFlowResponse,
  isLoading,
}: Props) => {
  const {setField:setInventoryProductFlowField}=useInventoryStore();
  const [uidTextColor, setUidTextColor] = useState<string>("");
  const [uidBatchTextColor, setUidBatchTextColor] = useState<string>("");

  const [selectedIssue, setSelectedIssue] = useState<string>("0");
  const [cost, setCost] = useState<string>("0");
  const [isCostUpdated, setIsCostUpdated] = useState<boolean>(false);
  const [isIssueUpdated, setIsIssueUpdated] = useState<boolean>(false);
  const [isShowInventoryProductFlow, setIsShowInventoryProductFlow] = useState<boolean>(false);

  const issueOptions = [
    { label: "اختلاف بچ", value: "1" },
    { label: "کسری موجودی", value: "2" },
    { label: "مازاد موجودی", value: "3" },
    { label: "ضایعات محصول", value: "4" },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedIssue(value);
  };
  ///////////////////////////////////////////////////////////////////////
  const getTextColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-blue-400";
      case 1:
        return "text-green-700";
      case -1:
        return "text-gray-500";
      default:
        return "text-red-700";
    }
  };
  /////////////////////////////////////////////////////////////////////////
  const updateCost = (value: string) => {
    const request = {
      id: inventoryDetailShowResponse.data.result.id,
      cost: currencyStringToNumber(convertToLatinDigits(value)).toString(),
    };
    console.log(request);
    inventoryUpdateCost(request);
    setIsCostUpdated(true);
    setIsModalOpenCost(true);
  };
  /////////////////////////////////////////////////////////////////////////
  const updateIssue = (value: number) => {
    const request = {
      id: inventoryDetailShowResponse.data.result.id,
      issue: Number(convertToLatinDigits(value.toString())),
    };
    console.log(request);
    inventoryUpdateIssue(request);
    setIsIssueUpdated(true);
    setIsModalOpenIssue(true);
  };
  /////////////////////////////////////////////////////////////////////////
  //initialize issue
  useEffect(() => {
    setSelectedIssue(inventoryDetailShowResponse.data.result.issue.toString());
    setIsIssueUpdated(false);
  }, [inventoryDetailShowResponse.data.result.issue]);
  //initialize cost
  useEffect(() => {
    setCost(convertToFarsiDigits(
        formatNumberWithCommas(
          Number(inventoryDetailShowResponse.data.result.cost
          )
        )
      ));
    //setCost(inventoryDetailShowResponse.data.result.cost.toString());
    setIsCostUpdated(false);
  }, [inventoryDetailShowResponse.data.result.cost]);

  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setUidTextColor(
      getTextColor(inventoryDetailShowResponse.data.result.status)
    );
    setUidBatchTextColor(
      getTextColor(inventoryDetailShowResponse.data.result.statusOther)
    );
  }, [
    inventoryDetailShowResponse.data.result.status,
    inventoryDetailShowResponse.data.result.statusOther,
  ]);
  /////////////////////////////////////////////////////////////////////////
  const showInventoryProductFlow = () => {
    console.log(inventoryDetailShowResponse.data.result.id, "inventoryDetailShowResponse.data.result.id");
    setInventoryProductFlowField("dId", inventoryDetailShowResponse.data.result.id);
    setIsShowInventoryProductFlow(true);
  };
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      {/*first row of the header*/}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-1/4 flex">
          <label className="p-1 w-24 text-left">سیستم: </label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.title
            )}
            disabled
            className="text-xs md:text-sm w-full p-1 text-gray-400 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/2 flex">
          <label className="p-1 w-24 text-left">انبار: </label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.wName
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/4 flex">
          <label className="p-1 w-60 text-left">موجودی در زمان شمارش: </label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.stock
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {/*second row of the header*/}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-1/4 flex">
          <label className="p-1 w-24 text-left">کد کالا :</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.pCode
            )}
            disabled
            className="text-xs md:text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/2 flex">
          <label className="p-1 w-24 text-left">نام کالا:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.pName
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/4 flex">
          <label className="p-1 w-60 text-left">شمارش:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.cnt
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {/*third row of the header*/}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-1/4 flex">
          <label className="p-1 w-24 text-left">بچ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.code
            )}
            disabled
            className="text-xs md:text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/2 flex">
          <label className="p-1 w-24 text-left"> آی آر سی:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.irc
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/4 flex">
          <label className="p-1 w-60 text-left">قیمت:</label>
          {InputElement(
            cost,
            false,
            (e) => {
              handleCurrencyInputChange(e.target.value, setCost);
            },
            (e) => {
              updateCost(e.target.value);
            },
            "white"
          )}
          {!!isCostUpdated && (
            <div className="flex justify-center items-center w-8">
              <img src={Ok} alt="ok" />
            </div>
          )}
        </div>
      </div>
      {/*fourth row of the header*/}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="w-1/4 flex items-center justify-center">
          <div className="flex items-center justify-right w-24">
            <label className="p-1 w-full text-left">یوآیدی:</label>
            <div >
              <FaCircle className={uidTextColor} size={10} />
            </div>
          </div>
          <input
            type="text"
            disabled={true}
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.uid
            )}
            className={`text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md bg-transparent ${uidTextColor}`}
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="flex items-center justify-right w-24">
            <label className="p-1 w-full text-left">یوآیدی بچ:</label>
            <div>
              <FaCircle className={uidBatchTextColor} size={10} />
            </div>
          </div>
          <input
            type="text"
            disabled={true}
            value={convertToFarsiDigits(
              inventoryDetailShowResponse.data.result.uidOther
            )}
            className={`text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md bg-transparent ${uidTextColor}`}
          />
        </div>
        <div className="w-1/4 flex items-center justify-center">
          <Button
            text={"لیست ورودی کالا"}
            backgroundColor="bg-transparent"
            color="text-blue-500"
            backgroundColorHover="bg-blue-600"
            colorHover="text-white"
            variant="border border-blue-500 shadow-lg w-32"
            onClick={showInventoryProductFlow} 
          />
        </div>
      </div>
      {/*fifth row of the header*/}
      <div className="w-full flex flex-col text-gray-500">
        <div className="flex">
          <label className="px-2 text-gray-800">علت:</label>
          {!!isIssueUpdated && (
            <div className="flex justify-center items-center w-8">
              <img src={Ok} alt="ok" />
            </div>
          )}
        </div>
        <Card
          padding="sm"
          borderColor="border-gray-300"
          className="flex flex-col w-full p-4"
        >
          <RadioGroup
            options={issueOptions}
            name="radioGroup"
            selectedValue={selectedIssue}
            onChange={(value) => {
              handleRadioChange(value);
              updateIssue(Number(value));
            }}
          />
        </Card>
      </div>
      <ModalForm
        isOpen={isShowInventoryProductFlow}
        onClose={() => setIsShowInventoryProductFlow(false)}
        title="لیست ورودی کالا"
        width="1/2"
      >
        <InventoryProductFlowShow inventoryProductFlowResponse={inventoryProductFlowResponse} isLoading={isLoading} />
      </ModalForm>
    </div>
  );
};

export default InventoryDetailShowHeader;
