import { useEffect, useState, useRef } from "react";
import Input from "../controls/Input";
import Ok from "../../assets/images/GrayThem/ok16.png";
import Err from "../../assets/images/GrayThem/err16.png";
import { useBankStore } from "../../store/bankStore";
import AutoComplete from "../controls/AutoComplete";
import { DefaultOptionType, SearchItem } from "../../types/general";
import Spinner from "../controls/Spinner";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useAuthStore } from "../../store/authStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useChequeStore } from "../../store/chequeStore";
import { colors } from "../../utilities/color";
import ModalMessage from "../layout/ModalMessage";
import Skeleton from "../layout/Skeleton";
import {
  LoadPaymentResponse,
  SayadChequeInquiryByPaymentIdResponse,
  SayadiChequeAcceptByPaymentIdResponse,
  SayadiChequeRejectByPaymentIdRequest,
  UpdateFieldsRequest,
  UpdateFieldsResponse,
} from "../../types/cheque";
import { UseMutateAsyncFunction, UseMutateFunction } from "@tanstack/react-query";
import RegRecievedChequeInfoSanad from "./RegRecievedChequeInfoSanad";
import { FaCircle } from "react-icons/fa";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import ConfirmCancelModalForm from "../controls/ConfirmCancelModalForm";
import ModalForm from "../layout/ModalForm";
import { v4 as uuidv4 } from "uuid";

type Props = {
  canEditForm: boolean;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  loadPaymentResponse: LoadPaymentResponse;
  isLoadingLoadPayment: boolean;
  updateFields: UseMutateAsyncFunction<
    any,
    Error,
    UpdateFieldsRequest,
    unknown
  >;
  updateFieldsResponse: UpdateFieldsResponse;
  isLoadingUpdateFields: boolean;
  cashPosSystemSearch: SearchItem[];
  sayadChequeInquiryByPaymentIdResponse: SayadChequeInquiryByPaymentIdResponse;
  isLoadingSayadChequeInquiryByPaymentId: boolean;
  sayadiChequeAcceptByPaymentIdResponse: SayadiChequeAcceptByPaymentIdResponse;
  isLoadingSayadiChequeAcceptByPaymentId: boolean;
  deleteSayadiChequeRejectByPaymentId: UseMutateFunction<any, Error, SayadiChequeRejectByPaymentIdRequest, unknown>
  sayadiChequeRejectByPaymentIdResponse: any;
  definitionInvironment: DefinitionInvironment;
  banks: SearchItem[];
  isLoadingBanks: boolean;
};

const RegRecievedChequeInfo: React.FC<Props> = ({
  canEditForm,
  workFlowRowSelectResponse,
  loadPaymentResponse,
  isLoadingLoadPayment,
  updateFields,
  updateFieldsResponse,
  isLoadingUpdateFields,
  cashPosSystemSearch,
  sayadChequeInquiryByPaymentIdResponse,
  isLoadingSayadChequeInquiryByPaymentId,
  sayadiChequeAcceptByPaymentIdResponse,
  isLoadingSayadiChequeAcceptByPaymentId,
  deleteSayadiChequeRejectByPaymentId,
  sayadiChequeRejectByPaymentIdResponse,
  definitionInvironment,
  banks,
  isLoadingBanks,
}: Props) => {
  const { setField } = useBankStore();
  const [systemSearch, setSystemSearch] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [yearSearch, setYearSearch] = useState<string>("");
  const [cash_PosSystemEntered, setCash_PosSystemEntered] = useState(false);
  const [bankEntered, setBankEntered] = useState(false);
  const [sayadiTextColor, setSayadiTextColor] = useState<string>("");
  const [sayadiRegTextColor, setSayadiRegTextColor] = useState<string>("");
  const { authApiResponse } = useAuthStore();
  const initData = authApiResponse?.data?.result?.initData;

  //for Payment/sayadChequeInquiryByPaymentId
  const [isSayadiClick, setIsSayadiClick] = useState(false);
  //for 
  const [isSayadiRegOpen, setIsSayadiRegOpen] = useState(false);
  const [isModalSayadiAcceptOpen, setIsModalSayadiAcceptOpen] = useState(false);
  const [isModalSayadiRejectOpen, setIsModalSayadiRejectOpen] = useState(false);

  // Add refs for focus management
  const systemRef = useRef<any>(null);
  const yearRef = useRef<any>(null);
  const bankRef = useRef<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFieldChanged, setIsFieldChanged] = useState(false);

  const {
    //id,
    setField: setChequeField,
    //updateFieldsResponse,
    setUpdateFieldsResponse,
    updateStatus,
    setUpdateStatus,
  } = useChequeStore();
  const [payKind, setPayKind] = useState<number>(-1);
  const hasInitializedPayKind = useRef(false);

  useEffect(() => {
    const payKindTemp = loadPaymentResponse.data.result?.payKind ?? -1;
    console.log(payKindTemp, "payKindTemp");
    if (payKindTemp !== undefined) {
      setPayKind(payKindTemp);
    }
  }, [loadPaymentResponse.data.result?.payKind, canEditForm]);

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
    sayadiStatus: 0,
    eCheck: false,
    delayAdvanceDays: "0",
    assignedAccountName: "",
    sayadiAcceptStatus: 0
  });
  /////////////////////////////////////////////////////////////////////
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
    console.log(yearSearch, systemSearch);
    setChequeField("id", workFlowRowSelectResponse.workTableRow.formId);
    // Reset initialization flag when record changes
    hasInitializedPayKind.current = false;
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
      delayAdvanceDays: {},
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
    setIsSayadiClick(false);
    setCheque({
      sayadiMessage: convertToFarsiDigits(
        loadPaymentResponse.data.result?.sayadiMessage ?? ""
      ),
      prsn: loadPaymentResponse.data.result?.prsn ?? "",
      system: {
        id: loadPaymentResponse.data.result?.acc_System ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result?.systemTitle ?? ""
        ),
      },
      year: {
        id: loadPaymentResponse.data.result?.acc_Year ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result?.yearTitle ?? ""
        ),
      },
      bank: {
        id: loadPaymentResponse.data.result?.bankId ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result?.bankName_Partners ?? ""
        ),
      },
      sayadi: convertToFarsiDigits(
        loadPaymentResponse.data.result?.sayadi ?? ""
      ),
      srName: convertToFarsiDigits(
        loadPaymentResponse.data.result?.srName ?? ""
      ),
      marketerSrName: convertToFarsiDigits(
        loadPaymentResponse.data.result?.marketerSrName ?? ""
      ),
      transferenceOwner: convertToFarsiDigits(
        loadPaymentResponse.data.result?.transferenceOwner ?? ""
      ),
      sarDate: convertToFarsiDigits(
        loadPaymentResponse.data.result?.sarDate ?? ""
      ),
      accNo: convertToFarsiDigits(loadPaymentResponse.data.result?.accNo ?? ""),
      no: convertToFarsiDigits(loadPaymentResponse.data.result?.no ?? ""),
      fixSerial: convertToFarsiDigits(
        loadPaymentResponse.data.result?.fixSerial ?? ""
      ),
      amountT: convertToFarsiDigits(
        formatNumberWithCommas(
          Number(loadPaymentResponse.data.result?.amount ?? 0)
        )
      ),
      dsc: convertToFarsiDigits(loadPaymentResponse.data.result?.dsc ?? ""),
      cash_PosSystem: {
        id: loadPaymentResponse.data.result?.cash_PosSystem ?? 0,
        title: convertToFarsiDigits(
          loadPaymentResponse.data.result?.cash_PosSystemTitle ?? ""
        ),
      },
      sanadNum: convertToFarsiDigits(
        loadPaymentResponse.data.result?.sanadNum ?? ""
      ),
      sanadDate: convertToFarsiDigits(
        loadPaymentResponse.data.result?.sanadDate ?? ""
      ),
      sayadiStatus: loadPaymentResponse.data.result?.sayadiStatus ?? 0,
      eCheck: loadPaymentResponse.data.result?.eCheck ?? false,
      delayAdvanceDays: convertToFarsiDigits(
        loadPaymentResponse.data.result?.delayAdvanceDays ?? 0
      ),
      assignedAccountName: convertToFarsiDigits(loadPaymentResponse.data.result?.assignedAccountName ?? ""),
      sayadiAcceptStatus: loadPaymentResponse.data.result?.sayadiAcceptStatus ?? 0,
    });
  }, [loadPaymentResponse]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(loadPaymentResponse.data.result?.sayadiStatus);
    switch (
    loadPaymentResponse.data.result &&
    loadPaymentResponse.data.result?.sayadiStatus
    ) {
      case 1:
        setSayadiTextColor(colors.green700);
        break;
      case -1:
        setSayadiTextColor(colors.yellow700);
        break;
      case -2:
        setSayadiTextColor(colors.red500);
        break;
      default:
        setSayadiTextColor(colors.gray_500);
        break;
    }
  }, [loadPaymentResponse.data.result?.sayadiStatus]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (sayadChequeInquiryByPaymentIdResponse.data.result?.sayadiStatus === -10)
      return;
    switch (
    sayadChequeInquiryByPaymentIdResponse.data.result &&
    sayadChequeInquiryByPaymentIdResponse.data.result?.sayadiStatus
    ) {
      case 1:
        setSayadiTextColor(colors.green700);
        break;
      case -1:
        setSayadiTextColor(colors.yellow700);
        break;
      case -2:
        setSayadiTextColor(colors.red500);
        break;
      default:
        setSayadiTextColor(colors.gray_500);
        break;
    }
  }, [sayadChequeInquiryByPaymentIdResponse.data.result?.sayadiStatus]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(loadPaymentResponse.data.result?.sayadiAcceptStatus);
    switch (
    loadPaymentResponse.data.result &&
    loadPaymentResponse.data.result?.sayadiAcceptStatus
    ) {
      case 2:
        setSayadiRegTextColor(colors.orange200);
        break;
      case 1:
        setSayadiRegTextColor(colors.green700);
        break;
      case -1:
        setSayadiRegTextColor(colors.red500);
        break;
      default:
        setSayadiRegTextColor(colors.gray_500);
        break;
    }
  }, [loadPaymentResponse.data.result?.sayadiAcceptStatus]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (sayadiChequeAcceptByPaymentIdResponse.data.result?.state === -10)
      return;
    switch (
    sayadiChequeAcceptByPaymentIdResponse.data.result &&
    sayadiChequeAcceptByPaymentIdResponse.data.result?.state
    ) {
      case 2:
        setSayadiRegTextColor(colors.orange200);
        break;
      case 1:
        setSayadiRegTextColor(colors.green700);
        break;
      case -1:
        setSayadiRegTextColor(colors.red500);
        break;
      default:
        setSayadiRegTextColor(colors.gray_500);
        break;
    }
    if (sayadiChequeAcceptByPaymentIdResponse.meta.errorCode > 0)
      setErrorMessage(sayadiChequeAcceptByPaymentIdResponse.meta.message ?? "")
  }, [sayadiChequeAcceptByPaymentIdResponse.data.result?.state]);
  ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (sayadiChequeRejectByPaymentIdResponse.data.result?.state === -10)
      return;
    switch (
    sayadiChequeRejectByPaymentIdResponse.data.result &&
    sayadiChequeRejectByPaymentIdResponse.data.result?.state
    ) {
      case 2:
        setSayadiRegTextColor(colors.orange200);
        break;
      case 1:
        setSayadiRegTextColor(colors.green700);
        break;
      case -1:
        setSayadiRegTextColor(colors.red500);
        break;
      default:
        setSayadiRegTextColor(colors.gray_500);
        break;
    }
    if (sayadiChequeRejectByPaymentIdResponse.meta.errorCode > 0)
      setErrorMessage(sayadiChequeRejectByPaymentIdResponse.meta.message ?? "")
  }, [sayadiChequeRejectByPaymentIdResponse.data.result?.state]);
  //////////////////////////////////////////////////////////////////
  // Enhanced setChequeFields with validation
  const setChequeFields1 = (
    fieldName: string,
    value: string | number | DefaultOptionType | boolean
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
          `${fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName
          }Id`
          ],
          validationError:
            value === null || value === undefined ? true : false,
        },
      });
    }
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
        update("SystemId", (value as DefaultOptionType)?.id.toString());
      } else if (fieldName === "year") {
        update("YearId", (value as DefaultOptionType)?.id.toString());
      } else if (fieldName === "bank") {
        update("BankId", (value as DefaultOptionType)?.id.toString());
      } else if (fieldName === "cash_PosSystem") {
        update(
          "cash_PosSystem",
          (value as DefaultOptionType)?.id?.toString() ?? ""
        );
      }
      setIsModalOpen(true);
    }

    if (
      fieldName !== "bank" &&
      fieldName !== "year" &&
      fieldName !== "system" &&
      fieldName !== "cash_PosSystem"
    ) {
      setIsModalOpen(true);
    }
    setIsFieldChanged(false);
  };
  ///////////////////////////////////////////////////////////////////
  const setChequeFields = (
    fieldName: string,
    value: string | number | DefaultOptionType | boolean
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
          `${fieldName === "cash_PosSystem" ? "cash_PosSystem" : fieldName
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
    value: string | number | DefaultOptionType | boolean
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
          update("SystemId", (value as DefaultOptionType)?.id.toString());
        } else if (fieldName === "year") {
          update("YearId", (value as DefaultOptionType)?.id.toString());
        } else if (fieldName === "bank") {
          update("BankId", (value as DefaultOptionType)?.id.toString());
        } else if (fieldName === "cash_PosSystem") {
          update(
            "cash_PosSystem",
            (value as DefaultOptionType)?.id?.toString() ?? ""
          );
        }
        setIsModalOpen(true);
      }
      if (
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
    let timeoutId: NodeJS.Timeout;
    if (isModalSayadiAcceptOpen || isModalSayadiRejectOpen) {
      timeoutId = setTimeout(() => {
        setIsModalSayadiAcceptOpen(false);
        setIsModalSayadiRejectOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalSayadiAcceptOpen, isModalSayadiRejectOpen]);
  /////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////////////
  const showValidationError = (fieldName: string) => {
    if (
      //!isLoadingDefinition &&
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
      updateStatus[fieldName]?.errorCode === -1
    ) {
      return <img src={Ok} alt="ok" title={updateStatus[fieldName]?.message} />;
    }
    if (
      !isLoadingUpdateFields &&
      updateStatus[fieldName]?.errorCode !== undefined &&
      updateStatus[fieldName]?.errorCode !== -1
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

  const handleSayadiClick = () => {
    setIsSayadiClick(true);
    setChequeField(
      "sayadiPaymentId",
      loadPaymentResponse.data.result?.id ?? -1
    );
    // Increment trigger to force refetch even with same values
    setChequeField("paymentIdTrigger", Date.now());
  };
  //for sayadi accept
  const handleSayadiAcceptClick = () => {
    //setIsSayadiClick(true);
    setChequeField(
      "paymentIdAccept",
      loadPaymentResponse.data.result?.id ?? -1
    );
    setChequeField("descriptionAccept", "toloo")
    setChequeField("idempotencyKeyAccept", uuidv4())
    // Increment trigger to force refetch even with same values
    setChequeField("paymentIdAcceptTrigger", Date.now());
    setIsModalSayadiAcceptOpen(true)
    setIsSayadiRegOpen(false)
  };
  //for sayadi reject
  const handleSayadiRejectClick = () => {
    deleteSayadiChequeRejectByPaymentId({
      paymentIdReject: loadPaymentResponse.data.result?.id ?? -1,
      //paymentIdRejectTrigger:number;
      descriptionReject: "toloo",
      idempotencyKeyReject: uuidv4()
    })
    setIsModalSayadiRejectOpen(true)
    setIsSayadiRegOpen(false)
  };

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
        <div className="flex items-center gap-2 w-full">
          <label
            className="w-24 text-xs text-end cursor-pointer"
            onClick={handleSayadiClick}
          >
            استعلام صیادی:
          </label>
          <div className={`px-1 rounded ${isLoadingSayadChequeInquiryByPaymentId ? "animate-pulse" : ""} `}>
            <FaCircle style={{ color: sayadiTextColor }} size={10} />
          </div>
          <input
            name="sayadiMessage"
            value={
              isSayadiClick
                ? sayadChequeInquiryByPaymentIdResponse.data.result.msg
                : cheque.sayadiMessage
            }
            className={`border-2 border-gray-300 rounded-md p-1 w-full ${isLoadingSayadChequeInquiryByPaymentId ? "animate-pulse" : ""}`}
            style={{ color: sayadiTextColor }}
            disabled
          />
        </div>
      )}
      <div className="flex justify-between w-full">
        <div className="flex w-2/3 justify-center items-center gap-2">
          <label className="w-24 text-left">
            <span className="text-red-500">* </span>سیستم:
          </label>
          <div className="flex w-full justify-center items-center gap-2">
            <AutoComplete
              disabled={!canEditForm}
              required={true}
              showClearIcon={false}
              textColor={colors.gray_600}
              options={definitionInvironment?.systems ?? []}
              value={cheque.system}
              handleChange={(_event, newValue) => {
                setChequeFields1("system", newValue as DefaultOptionType);
              }}
              setSearch={setSystemSearch}
              showLabel={false}
              inputPadding="0 !important"
              backgroundColor={
                !canEditForm
                  ? "inherit"
                  : updateStatus.systemId.validationError
                    ? "#fef2f2"
                    : "white"
              }
              ref={systemRef}
            /*handleBlur={() => {
              updateCheque("system", cheque.system);
            }}*/
            />
            {showValidationError("systemId")}
          </div>
        </div>
        <div className="flex w-1/3 justify-center items-center gap-1">
          <label className="w-36 text-left">
            <span className="text-red-500">* </span>سال مالی:
          </label>
          <div className="flex w-full justify-center items-center gap-2">
            <AutoComplete
              disabled={!canEditForm}
              required={true}
              showClearIcon={false}
              textColor={colors.gray_600}
              options={definitionInvironment?.years.map((year) => ({
                id: year.id,
                title: convertToFarsiDigits(year.code) ?? "",
              }))}
              value={cheque.year}
              handleChange={(_event, newValue) => {
                setChequeFields1("year", newValue as DefaultOptionType);
              }}
              setSearch={setYearSearch}
              showLabel={false}
              inputPadding="0 !important"
              backgroundColor={
                !canEditForm
                  ? "inherit"
                  : updateStatus.yearId.validationError
                    ? "#fef2f2"
                    : "white"
              }
              ref={yearRef}
            /*handleBlur={() => {
              updateCheque("year", cheque.year as DefaultOptionType);
            }}*/
            />
            {showValidationError("yearId")}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full">
        {payKind === 2 && (
          <div className="flex w-2/3 justify-center items-center gap-2">
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
          <div className="flex flex-col w-1/3 justify-center items-center">
            <div className="flex w-full justify-center items-center">
              <label
                className="w-36 text-end cursor-pointer"
                onClick={() => { setIsSayadiRegOpen(true) }}
              >
                ثبت صیاد:
              </label>
              <div className={`px-1 rounded ${isLoadingSayadiChequeAcceptByPaymentId ? "animate-pulse" : ""} `}>
                {<FaCircle style={{ color: sayadiRegTextColor }} size={10} />}
              </div>
              <input
                name="sayadiMessage"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChequeFields("sayadi", e.target.value)
                }
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCheque("sayadi", e.target.value)
                }
                value={cheque.sayadi}
                className={`border-2 border-gray-300 rounded-md p-1 w-full ${isLoadingSayadiChequeAcceptByPaymentId ? "animate-pulse" : ""}`}
                style={{ color: sayadiRegTextColor }}
                disabled={!canEditForm}
              />
              {showValidationError("sayadi")}
            </div>
            <div className="flex w-full justify-center items-center">
              <p className="text-xs text-red-500">{errorMessage}</p>
            </div>
          </div>
        )}
        {(payKind === 0 || payKind === 9 || payKind === 1) && (
          <div className="flex w-full justify-center items-center gap-2">
            <AutoCompleteSearch
              label={
                payKind === 0 ? "صندوق" : payKind === 9 ? "بانک" : "پایانه"
              }
              labelWidth="w-20"
              setField={setChequeField}
              fieldValues={[
                { field: "page", value: 1 },
                { field: "lastId", value: 0 },
                { field: "systemId", value: initData?.systemId ?? -1 },
                { field: "payKind", value: payKind },
              ]}
              fieldSearch="search"
              selectedOption={cheque.cash_PosSystem as DefaultOptionType}
              handleChange={(_event, newValue) => {
                setChequeFields1(
                  "cash_PosSystem",
                  newValue as DefaultOptionType
                );
              }}
              options={cashPosSystemSearch.map((b: any) => ({
                id: b.id,
                text: b.text,
              }))}
              isEntered={cash_PosSystemEntered}
              setIsEntered={setCash_PosSystemEntered}
              disabled={!canEditForm}
            />
            {showValidationError("cash_PosSystem")}
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
          widthDiv="w-2/3"
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
          widthDiv="w-1/3"
          widthLabel="w-32"
          widthInput="w-full-minus-32"
          disabled
          variant="outlined"
        />
      </div>
      {payKind === 2 && (
        <div className="flex justify-between w-full">
          <div className="flex w-2/3 justify-center items-center gap-2">
            <AutoCompleteSearch
              label="بانک"
              labelWidth="w-20"
              setField={setField}
              fieldValues={[
                { field: "page", value: 1 },
                { field: "lastId", value: 0 },
              ]}
              fieldSearch="search"
              selectedOption={cheque.bank as DefaultOptionType}
              handleChange={(_event, newValue) => {
                setChequeFields1("bank", newValue as DefaultOptionType);
              }}
              options={banks.map((b: any) => ({
                id: b.id,
                text: b.text,
              }))}
              isEntered={bankEntered}
              setIsEntered={setBankEntered}
              disabled={!canEditForm}
            />
            {showValidationError("bankId")}
          </div>
          <div className="flex w-1/3 justify-center items-center gap-2">
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
              widthLabel="w-32"
              widthInput="w-full-minus-32"
              variant="outlined"
            />
            {showValidationError("transferenceOwner")}
          </div>
        </div>
      )}
      {payKind === 2 && (
        <div className="flex justify-between w-full">
          <div className="flex w-2/3   justify-center items-center gap-2">
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
          <div className="flex w-1/3 justify-center items-center gap-2">
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
              widthLabel="w-32"
              widthInput="w-full-minus-32"
              variant="outlined"
            />
            {showValidationError("sarDate")}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full">
        <div className="flex w-2/3 items-center gap-1">
          <label className="w-24 text-left">شماره:</label>
          <div className="flex w-full-minus-24 justify-center items-center gap-2">
            <div className="flex w-full justify-center items-center gap-2">
              <Input
                disabled={!canEditForm}
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
            {payKind === 2 && <label>/</label>}
            {payKind === 2 && (
              <div className="flex w-full justify-center items-center gap-2">
                <Input
                  disabled={!canEditForm}
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
              </div>
            )}
          </div>
        </div>
        <div className="flex w-1/3 justify-center items-center gap-2">
          <Input
            disabled={!canEditForm}
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
            widthLabel="w-32"
            widthInput="w-full-minus-32"
            variant="outlined"
          />
          {showValidationError("amountT")}
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 w-full">
        <div className={`flex justify-between items-center ${payKind === 2 ? "w-2/3" : "w-full"}`}>
          <Input
            disabled={!canEditForm}
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
        {payKind === 2 && (
          <div className="flex justify-start items-center gap-2">
            <input
              type="checkbox"
              name="eCheck"
              checked={cheque.eCheck}
              disabled={!canEditForm}
              onChange={(e) => console.log(e.target.checked)}
            />
            <label>الکترونیکی</label>
            {showValidationError("eCheck")}
          </div>
        )}
      </div>
      <div className="flex justify-end items-center w-full">
        {cheque.assignedAccountName !== "" && <Input
          disabled={!canEditForm}
          name="assignedAccountName"
          label="واگذار به بانک:"
          value={cheque.assignedAccountName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChequeFields("assignedAccountName", e.target.value)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCheque("assignedAccountName", e.target.value)
          }
          widthDiv="w-2/3"
          widthLabel="w-24"
          widthInput="w-full-minus-24"
          variant="outlined"
        />}
        <Input
          disabled={!canEditForm}
          name="delayAdvanceDays"
          label="تاخیر/تعجیل:"
          value={cheque.delayAdvanceDays}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChequeFields("delayAdvanceDays", e.target.value)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCheque("delayAdvanceDays", e.target.value)
          }
          widthDiv="w-1/3"
          widthLabel="w-32"
          widthInput="w-full-minus-32"
          variant="outlined"
        />
        {showValidationError("delayAdvanceDays")}
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
            updateFieldsResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            updateFieldsResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            updateFieldsResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpen(false)}
          message={updateFieldsResponse.meta.message}
          visibleButton={false}
        />
      )}
      {/*to show sayadi reg modal form */}
      <ModalForm
        isOpen={isSayadiRegOpen}
        onClose={() => setIsSayadiRegOpen(false)}
        title="پیام"
        width="1/3"
      >
        <ConfirmCancelModalForm
          label="ثبت صیاد برای فاکتور انتخابی انجام شود؟"
          onConfirm={handleSayadiAcceptClick}
          onCancel={handleSayadiRejectClick}
          confirmLabel="تایید صیاد"
          cancelLabel="رد صیاد"
        />
      </ModalForm>
      <ModalMessage
        isOpen={isModalSayadiAcceptOpen}
        backgroundColor={
          sayadiChequeAcceptByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          sayadiChequeAcceptByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        bgColorButtonHover={
          sayadiChequeAcceptByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-600"
            : "bg-red-600"
        }
        color="text-white"
        onClose={() => setIsModalSayadiAcceptOpen(false)}
        message={sayadiChequeAcceptByPaymentIdResponse.meta.message ?? ""}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isModalSayadiRejectOpen}
        backgroundColor={
          sayadiChequeRejectByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          sayadiChequeRejectByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        bgColorButtonHover={
          sayadiChequeRejectByPaymentIdResponse.meta.errorCode <= 0
            ? "bg-green-600"
            : "bg-red-600"
        }
        color="text-white"
        onClose={() => setIsModalSayadiRejectOpen(false)}
        message={sayadiChequeRejectByPaymentIdResponse.meta.message ?? ""}
        visibleButton={false}
      />
    </div>
  );
};

export default RegRecievedChequeInfo;
