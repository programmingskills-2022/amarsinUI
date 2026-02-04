import { useEffect, useState } from "react";
import { PreProcurementResponse } from "../../types/preProcurement";
import AutoComplete from "../controls/AutoComplete";
import { DefaultOptionType } from "../../types/general";
import { useCustomers } from "../../hooks/useCustomers";
import { convertToFarsiDigits } from "../../utilities/general";
import { colors } from "../../utilities/color";
import Button from "../controls/Button";
import { useAttachmentStore } from "../../store/attachmentStore";
import { useGeneralContext } from "../../context/GeneralContext";

type Props = {
  preProcurementResponse: PreProcurementResponse;
  canEditForm: boolean;
  setShowAttachment: React.Dispatch<React.SetStateAction<boolean>>;
  guid:string;
  formId:number
};

const PreProcurementShowHeader = ({
  preProcurementResponse,
  canEditForm,
  setShowAttachment,
  guid,
  formId
}: Props) => {
  const { customers } = useCustomers();
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const [search, setSearch] = useState<string>("");
  const { setField: setAttachmentField } = useAttachmentStore();
  const { systemId, yearId } = useGeneralContext();

  useEffect(() => {
    console.log(search);
  }, []);
  useEffect(() => {
    setCustomer({
      id: preProcurementResponse.data.result.mst.customerId,
      title: preProcurementResponse.data.result.mst.customerName,
    });
  }, [
    preProcurementResponse.data.result.mst.customerId,
    preProcurementResponse.data.result.mst.customerName,
  ]);

  const handleAttachmentClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAttachmentField("systemId", systemId);
    setAttachmentField("yearId", yearId);
    setAttachmentField("formId", formId);
    setAttachmentField("prefix", "PreProcurement");
    setAttachmentField("GUID", guid);
    setShowAttachment(true);
  };

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-3/4 flex justify-center items-center">
          <label className="p-1 w-20 text-left">فروشنده:</label>
          <div className="flex w-full rounded-md">
            <AutoComplete
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={customer}
              handleChange={(_event, newValue) => {
                return setCustomer(newValue as DefaultOptionType | null);
              }}
              disabled={!canEditForm}
              setSearch={setSearch}
              showLabel={false}
              backgroundColor={!canEditForm ? "inherit" : "white"}
              showClearIcon={false}
              inputPadding="0 !important"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 flex">
          <label className="p-1 w-20 md:w-12 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              preProcurementResponse.data.result.mst.dat
            )}
            disabled={!canEditForm}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="md:w-full flex">
          <label className="p-1 w-20 text-left">توضیحات:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              preProcurementResponse.data.result.mst.exp
            )}
            disabled={!canEditForm}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <Button
          text={`ضمائم ${`(${convertToFarsiDigits(
            preProcurementResponse.data.result.mst.attachCount
          )})`}`}
          backgroundColor={colors.blue_400}
          backgroundColorHover={colors.blue_500}
          variant="w-32"
          onClick={handleAttachmentClick}
        />
      </div>
    </div>
  );
};

export default PreProcurementShowHeader;
