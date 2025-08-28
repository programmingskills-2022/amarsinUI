import { useEffect, useState, useRef } from "react";
import Input from "../controls/Input";
import Ok from "../../assets/images/GrayThem/ok16.png";
import Err from "../../assets/images/GrayThem/err16.png";
import { useBanks } from "../../hooks/useBanks";
import { useBankStore } from "../../store/bankStore";
import AutoComplete from "../controls/AutoComplete";
import { DefaultOptionType } from "../../types/general";
import Spinner from "../controls/Spinner";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useAuthStore } from "../../store/authStore";
import { useDefinitionInvironment } from "../../hooks/useDefinitionInvironment";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useChequeStore } from "../../store/chequeStore";
import { colors } from "../../utilities/color";
import ModalMessage from "../layout/ModalMessage";
import Skeleton from "../layout/Skeleton";
import { LoadPaymentResponse, UpdateFieldsRequest } from "../../types/cheque";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import RegRecievedChequeInfoSanad from "./RegRecievedChequeInfoSanad";

type Props = {
  canEditForm: boolean;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  loadPaymentResponse: LoadPaymentResponse,
  isLoadingLoadPayment: boolean,
  updateFields: UseMutateAsyncFunction<any, Error, UpdateFieldsRequest, unknown>,
  isLoadingUpdateFields:boolean,
  cashPosSystemSearch: any,
};

const RegRecievedChequeInfo: React.FC<Props> = ({
  canEditForm,
  workFlowRowSelectResponse,
  loadPaymentResponse,
  isLoadingLoadPayment,
  updateFields,
  isLoadingUpdateFields,
  cashPosSystemSearch,
}: Props) => {
  const [bankSearch, setBankSearch] = useState("");
  const { banks, isLoading: isLoadingBanks } = useBanks();
  const { setField } = useBankStore();
  const { definitionInvironment, isLoading: isLoadingDefinition } =
    useDefinitionInvironment();

  const [systemSearch, setSystemSearch] = useState<string>("");
  const [yearSearch, setYearSearch] = useState<string>("");
  const [cashPosSystemSerch, setCashPosSystemSerch] = useState<string>("");
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data.result.initData;

  // Add refs for focus management
  const systemRef = useRef<any>(null);
  const yearRef = useRef<any>(null);
  const bankRef = useRef<any>(null);

  const {
    //id,
    setField: setChequeField,
    updateFieldsResponse,
    setUpdateFieldsResponse,
    updateStatus,
    setUpdateStatus,
  } = useChequeStore();
  const [payKind, setPayKind] = useState<number>(0);

  useEffect(() => {
    setPayKind(loadPaymentResponse.data.result.payment?.payKind ?? 0);
  }, [loadPaymentResponse]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFieldChanged, setIsFieldChanged] = useState(false);

  const [cheque, setCheque] = useState({
    sayadiMessage: "",
    prsn: "",
    system: {
      id: initData?.systemId ?? 0,
      title: convertToFarsiDigits(initData?.systemTitle) ?? "",
    },
    year: {
      id: initData?.yearId ?? "0",
      title: convertToFarsiDigits(initData?.yearTitle) ?? "",
    },
    bank: {
      id: 0,
      title: "",
    },
    sayadi: "",
    srName: "",
    marketerSrName: "",
    transferenceOwner: "",
    sarDate: "",
    accNo: "",
    no: "",
    amountT: "",
    dsc: "",
    fixSerial: "",
    cash_PosSystem: {
      id: 0,
      title: "",
    },
    sanadNum: "",
    sanadDate: "",
  });
  ///////////////////////////////////////////////////////////////////
  // Validation function
  const notValidateRequiredFields = (fieldName: string) => {
    const errors = {
      system: cheque.system === null ? true : false,
      year: cheque.year === null ? true : false,
      bank: cheque.bank === null ? true : false,
      cash_PosSystem: cheque.cash_PosSystem === null ? true : false,
    };
    setUpdateStatus({
      ...updateStatus,
      [fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName + "Id"]: {
        ...updateStatus[
          fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName + "Id"
        ],
        validationError: errors[fieldName as keyof typeof errors],
      },
    });
    return errors[fieldName as keyof typeof errors];
  };
  ///////////////////////////////////////////////////////////////////
  // Focus management function
  const focusFirstInvalidField = () => {
    setTimeout(() => {
      if (updateStatus.systemId?.validationError) {
        systemRef.current?.focus();
      } else if (updateStatus.yearId?.validationError) {
        yearRef.current?.focus();
      } else if (updateStatus.bankId?.validationError) {
        bankRef.current?.focus();
      } else if (updateStatus.cash_PosSystem?.validationError) {
        systemRef.current?.focus();
      }
    }, 100);
  };
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    setField("page", 1);
    setField("lastId", 0);
    setField("search", bankSearch);
  }, [bankSearch]);
  /////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setChequeField("search", cashPosSystemSerch);
    setChequeField("page", 1);
    setChequeField("lastId", 0);
    setChequeField("systemId", initData?.systemId ?? 0);
    setChequeField("payKind", payKind);
  }, [cashPosSystemSerch, payKind, initData?.systemId]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(yearSearch, systemSearch);
    setChequeField("id", workFlowRowSelectResponse.workTableRow.formId);
    setUpdateStatus({
      ...updateStatus,
      prsn: {},
      sayadi: {},
      srName: {},
      marketerSrName: {},
      transferenceOwner: {},
      sarDate: {},
      accNo: {},
      no: {},
      amountT: {},
      dsc: {},
      sayadiMessage: {},
      systemId: {},
      yearId: {},
      bankId: {},
      cash_PosSystem: {},
      sanadNum: {},
      sanadDate: {},
    });
    setUpdateFieldsResponse({
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          errorCode: 0,
          message: "",
          details: [],
        },
      },
    });
  }, [workFlowRowSelectResponse]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    setCheque({
      sayadiMessage: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.sayadiMessage ?? ""
      ),
      prsn: loadPaymentResponse.data.result.payment?.prsn ?? "",
      system: {
        id: loadPaymentResponse.data.result.payment?.acc_System ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result.payment?.systemTitle ?? ""
        ),
      },
      year: {
        id: loadPaymentResponse.data.result.payment?.acc_Year ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result.payment?.yearTitle ?? ""
        ),
      },
      bank: {
        id: loadPaymentResponse.data.result.payment?.bankId ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result.payment?.bankName_Partners ?? ""
        ),
      },
      sayadi: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.sayadi ?? ""
      ),
      srName: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.srName ?? ""
      ),
      marketerSrName: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.marketerSrName ?? ""
      ),
      transferenceOwner: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.transferenceOwner ?? ""
      ),
      sarDate: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.sarDate ?? ""
      ),
      accNo: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.accNo ?? ""
      ),
      no: convertToFarsiDigits(loadPaymentResponse.data.result.payment?.no ?? ""),
      fixSerial: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.fixSerial ?? ""
      ),
      amountT: convertToFarsiDigits(
        formatNumberWithCommas(
          Number(loadPaymentResponse.data.result.payment?.amount ?? 0)
        )
      ),
      dsc: convertToFarsiDigits(loadPaymentResponse.data.result.payment?.dsc ?? ""),
      cash_PosSystem: {
        id: loadPaymentResponse.data.result.payment?.cash_PosSystem ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result.payment?.cash_PosSystemTitle ?? ""
        ),
      },
      sanadNum: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.sanadNum ?? ""
      ),
      sanadDate: convertToFarsiDigits(
        loadPaymentResponse.data.result.payment?.sanadDate ?? ""
      ),
    });
  }, [loadPaymentResponse]);
  ///////////////////////////////////////////////////////////////////
  // Enhanced setChequeFields with validation
  const setChequeFields = (
    fieldName: string,
    value: string | number | DefaultOptionType
  ) => {
    setCheque({
      ...cheque,
      [fieldName]:
        typeof value === "string" || typeof value === "number"
          ? fieldName === "amountT"
            ? convertToFarsiDigits(formatNumberWithCommas(value as number))
            : convertToFarsiDigits(value.toString())
          : value,
    });

    // Clear validation error when user selects a value
    if (typeof value === "object") {
      setUpdateStatus({
        ...updateStatus,
        [`${fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName}Id`]:
          {
            ...updateStatus[
              `${
                fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName
              }Id`
            ],
            validationError:
              value === null || value === undefined ? true : false,
          },
      });
    }
    setIsFieldChanged(true);
  };
  //////////////////////////////////////////////////////////////////
  // Enhanced updateCheque with validation
  const updateCheque = (
    fieldName: string,
    value: string | number | DefaultOptionType
  ) => {
    if (isFieldChanged) {
      // Validate required fields before updating
      if (
        fieldName === "system" ||
        fieldName === "year" ||
        fieldName === "bank" ||
        fieldName === "cash_PosSystem"
      ) {
        if (notValidateRequiredFields(fieldName)) {
          focusFirstInvalidField();
          return;
        }
      }
      if (typeof value === "string" || typeof value === "number") {
        if (fieldName === "amountT") {
          update(fieldName, convertToLatinDigits(value.toString()));
        } else {
          update(fieldName, convertToLatinDigits(value.toString()));
        }
      } else {
        if (fieldName === "system") {
          update("SystemId", value?.id.toString());
        } else if (fieldName === "year") {
          update("YearId", value?.id.toString());
        } else if (fieldName === "bank") {
          update("BankId", value?.id.toString());
        } else if (fieldName === "cash_PosSystem") {
          update("cash_PosSystem", value?.id.toString());
        }
        setIsModalOpen(true);
      }

      if (
        isFieldChanged &&
        fieldName !== "bank" &&
        fieldName !== "year" &&
        fieldName !== "system" &&
        fieldName !== "cash_PosSystem"
      ) {
        setIsModalOpen(true);
      }
      setIsFieldChanged(false);
    }
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
  //////////////////////////////////////////////////////////////////
  const showValidationError = (fieldName: string) => {
    if (
      !isLoadingDefinition &&
      !isLoadingBanks &&
      updateStatus[fieldName]?.validationError !== undefined &&
      updateStatus[fieldName]?.validationError === true
    ) {
      return <img src={Err} alt="err" title="این فیلد الزامی است" />;
    }
    if (
      (isLoadingUpdateFields &&
        updateStatus[fieldName]?.isUpdating !== undefined &&
        updateStatus[fieldName]?.isUpdating) ||
      (fieldName === "bankId" && isLoadingBanks)
    ) {
      return <Spinner size={4} color={colors.blue500} />;
    }
    if (
      !isLoadingUpdateFields &&
      updateStatus[fieldName]?.errorCode !== undefined &&
      updateStatus[fieldName]?.errorCode === 0
    ) {
      return <img src={Ok} alt="ok" title={updateStatus[fieldName]?.message} />;
    }
    if (
      !isLoadingUpdateFields &&
      updateStatus[fieldName]?.errorCode !== undefined &&
      updateStatus[fieldName]?.errorCode !== 0
    ) {
      return (
        <img src={Err} alt="err" title={updateStatus[fieldName]?.message} />
      );
    }
    return null;
  };
  if (isLoadingLoadPayment) {
    return <Skeleton />;
  }
  return (
    <div className="flex md:w-1/2 w-full flex-col gap-1">
      <div className="flex justify-evenly w-full py-2">
        {payKind === 2 && (
          <a
            className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
            href="https://cbi.ir/EstelamPichak/22036.aspx"
            target="_blank"
          >
            استعلام چک
          </a>
        )}
        <a
          className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
          href="http://stl2.mofidteb.com/?#/login"
          target="_blank"
        >
          تارگت
        </a>
      </div>
      {payKind === 2 && (
        <Input
          name="sayadiMessage"
          label="صیادی:"
          value={cheque.sayadiMessage}
          widthDiv="w-full"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
          disabled
        />
      )}
      <div className="flex justify-between w-full">
        <div className="flex w-1/2 justify-center items-center gap-2">
          <label className="w-24 text-left">
            <span className="text-red-500">* </span>سیستم:
          </label>
          <div className="flex w-full justify-center items-center gap-2">
            <AutoComplete
              disabled={payKind === 1 || !canEditForm}
              required={true}
              showClearIcon={false}
              textColor={colors.gray_600}
              options={definitionInvironment?.systems ?? []}
              value={cheque.system}
              handleChange={(_event, newValue) => {
                setChequeFields("system", newValue as DefaultOptionType);
              }}
              setSearch={setSystemSearch}
              showLabel={false}
              inputPadding="0 !important"
              backgroundColor={
                payKind === 1 || !canEditForm
                  ? "inherit"
                  : updateStatus.systemId.validationError
                  ? "#fef2f2"
                  : "white"
              }
              ref={systemRef}
              handleBlur={() => {
                updateCheque("system", cheque.system);
              }}
            />
            {showValidationError("systemId")}
          </div>
        </div>
        <div className="flex w-1/2 justify-center items-center gap-2">
          <label className="w-24 text-left">
            <span className="text-red-500">* </span>سال مالی:
          </label>
          <div className="flex w-full justify-center items-center gap-2">
            <AutoComplete
              disabled={payKind === 1 || !canEditForm}
              required={true}
              showClearIcon={false}
              textColor={colors.gray_600}
              options={definitionInvironment?.years.map((year) => ({
                id: year.id,
                title: convertToFarsiDigits(year.code) ?? "",
              }))}
              value={cheque.year}
              handleChange={(_event, newValue) => {
                setChequeFields("year", newValue as DefaultOptionType);
              }}
              setSearch={setYearSearch}
              showLabel={false}
              inputPadding="0 !important"
              backgroundColor={
                payKind === 1 || !canEditForm
                  ? "inherit"
                  : updateStatus.yearId.validationError
                  ? "#fef2f2"
                  : "white"
              }
              ref={yearRef}
              handleBlur={() => {
                updateCheque("year", cheque.year as DefaultOptionType);
              }}
            />
            {showValidationError("yearId")}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full">
        {payKind === 2 && (
          <div className="flex w-full justify-center items-center gap-2">
            <Input
              disabled={!canEditForm}
              name="prsn"
              label="صاحب چک:"
              value={cheque.prsn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChequeFields("prsn", e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCheque("prsn", e.target.value)
              }
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
            {showValidationError("prsn")}
          </div>
        )}
        {payKind === 2 && (
          <div className="flex w-full justify-center items-center gap-2">
            <Input
              disabled={!canEditForm}
              name="sayadi"
              label="صیادی:"
              value={cheque.sayadi}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChequeFields("sayadi", e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCheque("sayadi", e.target.value)
              }
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
            {showValidationError("sayadi")}
          </div>
        )}
        {payKind === 1 && (
          <div className="flex w-full justify-center items-center gap-2">
            <Input
              disabled={payKind === 1 || !canEditForm}
              name="cash_PosSystemTitle"
              label="پایانه:"
              value={cheque.cash_PosSystem.title}
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
          </div>
        )}
        {(payKind === 0 || payKind === 9) && (
          <div className="flex w-full justify-center items-center gap-2">
            <label className="w-24 text-left">
              {payKind === 0 ? "صندوق:" : "بانک:"}
            </label>
            <div className="flex w-full justify-center items-center gap-2">
              <AutoComplete
                disabled={!canEditForm}
                required={true}
                showClearIcon={false}
                textColor={colors.gray_600}
                options={cashPosSystemSearch.map((item: any) => ({
                  id: item.id,
                  title: item.text,
                }))}
                value={cheque.cash_PosSystem}
                handleChange={(_event, newValue) => {
                  setChequeFields(
                    "cash_PosSystem",
                    newValue as DefaultOptionType
                  );
                }}
                setSearch={setCashPosSystemSerch}
                showLabel={false}
                inputPadding="0 !important"
                backgroundColor={
                  updateStatus.cash_PosSystem?.validationError
                    ? "#fef2f2"
                    : "white"
                }
                ref={systemRef}
                handleBlur={() => {
                  updateCheque("cash_PosSystem", cheque.cash_PosSystem);
                }}
              />
              {showValidationError("cash_PosSystem")}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between w-full">
        <Input
          title={cheque.srName}
          name="srName"
          label="طرف حساب:"
          value={cheque.srName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChequeFields("srName", e.target.value)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCheque("srName", e.target.value)
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          disabled
          variant="outlined"
        />

        <Input
          name="marketerSrName"
          label="بازاریاب:"
          value={cheque.marketerSrName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChequeFields("marketerSrName", e.target.value)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCheque("marketerSrName", e.target.value)
          }
          widthDiv="w-1/2"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          disabled
          variant="outlined"
        />
      </div>
      {payKind === 2 && (
        <div className="flex justify-between w-full">
          <div className="flex w-1/2 justify-center items-center gap-2">
            <label className="w-24 text-left">
              <span className="text-red-500">* </span>بانک:
            </label>
            <div className="flex w-full justify-center items-center gap-2">
              <AutoComplete
                disabled={!canEditForm}
                required={true}
                showClearIcon={false}
                textColor={colors.gray_600}
                options={banks.map((b) => ({
                  id: b.id,
                  title: b.text,
                }))}
                value={cheque.bank}
                handleChange={(_event, newValue) => {
                  setChequeFields("bank", newValue as DefaultOptionType);
                }}
                setSearch={setBankSearch}
                showLabel={false}
                inputPadding="0 !important"
                backgroundColor={
                  !canEditForm
                    ? "inherit"
                    : updateStatus.bankId.validationError && !isLoadingBanks
                    ? "#fef2f2"
                    : "white"
                }
                ref={bankRef}
                handleBlur={() => {
                  updateCheque("bank", cheque.bank as DefaultOptionType);
                }}
              />
              {showValidationError("bankId")}
            </div>
          </div>
          <div className="flex w-1/2 justify-center items-center gap-2">
            <Input
              disabled={!canEditForm}
              name="transferenceOwner"
              label="شعبه:"
              value={cheque.transferenceOwner}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChequeFields("transferenceOwner", e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCheque("transferenceOwner", e.target.value)
              }
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
            {showValidationError("transferenceOwner")}
          </div>
        </div>
      )}
      {payKind === 2 && (
        <div className="flex justify-between w-full">
          <div className="flex w-1/2 justify-center items-center gap-2">
            <Input
              disabled={!canEditForm}
              name="sarDate"
              label="سررسید:"
              value={cheque.sarDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChequeFields("sarDate", e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCheque("sarDate", e.target.value)
              }
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
            {showValidationError("sarDate")}
          </div>
          <div className="flex w-1/2 justify-center items-center gap-2">
            <Input
              disabled={!canEditForm}
              name="accNo"
              label="حساب:"
              value={cheque.accNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChequeFields("accNo", e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCheque("accNo", e.target.value)
              }
              widthDiv="w-full"
              widthLabel="w-24"
              widthInput="w-full-minus-24"
              variant="outlined"
            />
            {showValidationError("accNo")}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full">
        <div className="flex w-1/2 items-center gap-1">
          <label className="w-24 text-left">شماره:</label>
          <div className="flex w-full-minus-24 justify-center items-center gap-2">
            <div className="flex w-full justify-center items-center gap-2">
              <Input
                disabled={payKind === 1 || !canEditForm}
                name="no"
                value={cheque.no}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChequeFields("no", e.target.value)
                }
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCheque("no", e.target.value)
                }
                widthDiv="w-full"
                widthInput="w-full"
                variant="outlined"
              />
              {showValidationError("no")}
            </div>
            {payKind===2 && <label>/</label>}
            {payKind===2 && <div className="flex w-full justify-center items-center gap-2">
              <Input
                disabled={ !canEditForm} //payKind === 1 ||
                name="fixSerial"
                value={cheque.fixSerial}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChequeFields("fixSerial", e.target.value)
                }
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCheque("fixSerial", e.target.value)
                }
                widthDiv="w-full"
                widthInput="w-full"
                variant="outlined"
              />
              {showValidationError("fixSerial")}
            </div>}
          </div>
        </div>
        <div className="flex w-1/2 justify-center items-center gap-2">
          <Input
            disabled={payKind === 1 || !canEditForm}
            name="amountT"
            label="مبلغ:"
            value={cheque.amountT}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChequeFields("amountT", e.target.value)
            }
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateCheque("amountT", e.target.value)
            }
            widthDiv="w-full"
            widthLabel="w-24"
            widthInput="w-full-minus-24"
            variant="outlined"
          />
          {showValidationError("amountT")}
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <Input
          disabled={payKind === 1 || !canEditForm}
          name="dsc"
          label="شرح:"
          value={cheque.dsc}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChequeFields("dsc", e.target.value)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCheque("dsc", e.target.value)
          }
          widthDiv="w-full"
          widthLabel="w-24"
          widthInput="w-full"
          variant="outlined"
        />
        {showValidationError("dsc")}
      </div>
      <RegRecievedChequeInfoSanad
        sanadNum={cheque.sanadNum}
        setSanadNum={(value: string) => setChequeFields("sanadNum", value)}
        sanadDate={cheque.sanadDate}
        setSanadDate={(value: string) => setChequeFields("sanadDate", value)}
        //payKind={payKind}
        //canEditForm={canEditForm}
        updateCheque={updateCheque}
        showValidationError={showValidationError}
      />
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
    </div>
  );
};

export default RegRecievedChequeInfo;
