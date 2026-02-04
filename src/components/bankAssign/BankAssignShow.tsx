import { useEffect, useState } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useBankAccount } from "../../hooks/useBankAccount";
import { DefaultOptionType } from "../../types/general";
import AutoComplete from "../controls/AutoComplete";
import { useGeneralContext } from "../../context/GeneralContext";
import { ChequeAssignBankAccountRequest } from "../../types/bankAccount";
import ModalMessage from "../layout/ModalMessage";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>
};

const BankAssignShow = ({ workFlowRowSelectResponse, refetchSwitch, setRefetchSwitch }: Props) => {
  const { setField } = useBankAccountStore();
  const {
    getChequeAssignBankAccountResponse,
    isLoadingGetChequeAssignBankAccount,
    bankAccountSearchResponse,
    isLoadingChequeAssignBankAccount,
    chequeAssignBankAccountResponse,
    chequeAssignBankAccount,
    refetchGetChequeAssignBankAccount,
  } = useBankAccount();

  const { systemId } = useGeneralContext();

  const [bankAccountSearch, setBankAccountSearch] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<DefaultOptionType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  //fetch data for getChequeAssignBankAccount query
  useEffect(() => {
    console.log(workFlowRowSelectResponse.workTableRow.formId,"formId in BankAssignShow");
    setField("paymentId", workFlowRowSelectResponse.workTableRow.formId);
    setField("asnadId", 0);
  }, [workFlowRowSelectResponse]);


  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchGetChequeAssignBankAccount();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  //fetch data for bankAccountSearch query
  useEffect(() => {
    setField("systemId", systemId);
    setField("page", 1);
    setField("lastId", 0);
    setField("search", bankAccountSearch);
  }, [systemId, bankAccountSearch]);

  //initialize bankAccount value in AutoComplete
  useEffect(() => {
    !isLoadingGetChequeAssignBankAccount &&
      setBankAccount({
        id: getChequeAssignBankAccountResponse.id,
        title: getChequeAssignBankAccountResponse.name,
      });
  }, [getChequeAssignBankAccountResponse]);

  const update = (bankAccount: DefaultOptionType) => {
    if (bankAccount === null) return;
    const request: ChequeAssignBankAccountRequest = {
      paymentId: workFlowRowSelectResponse.workTableRow.formId,
      asnadId: 0,
      bankAccountId: bankAccount.id,
    };
    console.log(request);
    chequeAssignBankAccount(request);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col text-sm items-center justify-center my-4 text-gray-600">
      <div className="w-2/3 flex flex-col items-center justify-center gap-2">
        <label>واگذار به بانک</label>
        <AutoComplete
          options={bankAccountSearchResponse.map((b) => ({
            id: b.id,
            title: b.text,
          }))}
          value={bankAccount}
          /*handleChange={(_event, newValue) => {
            return setBankAccount(newValue as DefaultOptionType);
          }}*/
          setSearch={setBankAccountSearch}
          showLabel={false}
          inputPadding="0 !important"
          backgroundColor="white"
          textColor="gray"
          showClearIcon={false}
          handleChange={(_event, newValue) => {
            update(newValue as DefaultOptionType);
          }}          
        />
      </div>
      {!isLoadingChequeAssignBankAccount && (
        <ModalMessage
          isOpen={isModalOpen}
          backgroundColor={
            chequeAssignBankAccountResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            chequeAssignBankAccountResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            chequeAssignBankAccountResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpen(false)}
          message={chequeAssignBankAccountResponse.meta.message}
          visibleButton={false}
        />
      )}
    </div>
  );
};

export default BankAssignShow;
