import ConfirmCancel from "./ConfirmCancel";

type Props = {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string
  cancelLabel?: string
};

const ConfirmCancelModalForm = ({ label, onConfirm, onCancel, confirmLabel = "تایید", cancelLabel = "انصراف" }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{label}</p>
      <ConfirmCancel onConfirm={onConfirm} onCancel={onCancel} confirmLabel={confirmLabel} cancelLabel={cancelLabel} />
    </div>
  );
};

export default ConfirmCancelModalForm;
//WorkflowMapBeforeAftersDel
