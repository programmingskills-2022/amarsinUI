import ConfirmCancel from "../ConfirmCancel";

type Props = {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const WorkflowMapBeforeAftersDel = ({ label, onConfirm, onCancel }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{label}</p>
      <ConfirmCancel onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  );
};

export default WorkflowMapBeforeAftersDel;
