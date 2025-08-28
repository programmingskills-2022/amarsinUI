import React, { useEffect, useState } from "react";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { InvoiceOutStandingResponse } from "../../types/paymentInvoice";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { usePaymentInvoiceStore } from "../../store/paymentInvoiceStore";
import { UpdateFieldsRequest, UpdateFieldsResponse } from "../../types/cheque";
import Input from "../controls/Input";
import ModalMessage from "../layout/ModalMessage";
import Ok from "../../assets/images/GrayThem/ok16.png";
import { colors } from "../../utilities/color";

type Props = {
  isEqualSum: boolean;
  dsc: string;
  rem: string;
  setDsc: React.Dispatch<React.SetStateAction<string>>;
  setRem: React.Dispatch<React.SetStateAction<string>>;
  invoiceOutStandingResponse: InvoiceOutStandingResponse;
  isLoadingUpdateFields: boolean;
  updateFields: UseMutateAsyncFunction<
    any,
    Error,
    UpdateFieldsRequest,
    unknown
  >;
  updateFieldsResponse: UpdateFieldsResponse;
  canEditForm1Mst1: boolean;
};

const PaymentInvoiceShowHeader = ({
  isEqualSum,
  dsc,
  rem,
  setDsc,
  setRem,
  invoiceOutStandingResponse,
  isLoadingUpdateFields,
  updateFields,
  updateFieldsResponse,
  canEditForm1Mst1,
}: Props) => {
  const { setField } = usePaymentInvoiceStore();
  const [isFieldChanged, setIsFieldChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //initialize fields (dsc and rem)
  useEffect(() => {
    setDsc(convertToFarsiDigits(invoiceOutStandingResponse.data?.dsc ?? ""));
    setRem(
      convertToFarsiDigits(
        formatNumberWithCommas(invoiceOutStandingResponse.data?.rem ?? 0)
      )
    );
  }, [invoiceOutStandingResponse]);

  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: number;
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
  const showValidationError = () => {
    if (
      !isLoadingUpdateFields &&
      updateFieldsResponse.data.result.details.length !== 0
    ) {
      return <img src={Ok} alt="ok" />;
    }
    return null;
  };

  //update fields state
  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const update = async (fieldName: string, value: string) => {
    updateFields({
      fieldName: capitalizeFirstLetter(fieldName),
      value: value,
      value2: "",
    });
  };
  // Enhanced updateCheque with validation
  const updateDsc = (value: string) => {
    if (isFieldChanged) {
      update("dsc", convertToLatinDigits(value.toString()));
      setIsModalOpen(true);
      setIsFieldChanged(false);
    }
  };
  // Enhanced setChequeFields with validation
  const setDscField = (value: string) => {
    setDsc(value);
    setIsFieldChanged(true);
  };
  return (
    <>
      <div className="flex justify-between items-center w-full gap-2">
        <div className="flex w-1/2 justify-center items-center gap-2">
          <Input
            name="dsc"
            label="شرح:"
            value={dsc}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDscField(e.target.value)
            }
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateDsc(e.target.value)
            }
            widthDiv="w-full"
            widthInput="w-full"
            variant="outlined"
            disabled={!canEditForm1Mst1}
          />
          {showValidationError()}
        </div>
        <div className="flex w-1/2 justify-center items-center gap-2">
          <Input
            disabled={!canEditForm1Mst1}
            name="rem"
            label="مانده پرداختی:"
            value={rem}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRem(e.target.value)
            }
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              setField("rem", e.target.value)
            }
            widthDiv="w-full"
            widthLabel="w-24"
            widthInput="w-full-minus-24"
            variant="outlined"
            style={{
              backgroundColor: isEqualSum ? colors.green50 : "inherit",
            }}
          />
        </div>
      </div>
      {!isLoadingUpdateFields && (
        <ModalMessage
          isOpen={isModalOpen}
          backgroundColor={
            updateFieldsResponse.meta.errorCode === 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            updateFieldsResponse.meta.errorCode === 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            updateFieldsResponse.meta.errorCode === 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpen(false)}
          message={updateFieldsResponse.meta.message}
          visibleButton={false}
        />
      )}
    </>
  );
};

export default PaymentInvoiceShowHeader;
