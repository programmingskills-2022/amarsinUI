
type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  errorMessage?: string;  
  confirmLabel?:string
  cancelLabel?:string
};

const ConfirmCancel = ({ onConfirm, onCancel, errorMessage , confirmLabel="تایید", cancelLabel="انصراف"}: Props) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        onClick={onConfirm}
        className="w-20 hover:bg-green-600 border-green-600 border-2  text-green-600 hover:text-white px-2 py-1 rounded-md"
      >
        {confirmLabel}
      </button>
      <button
        onClick={onCancel}
        className="w-20 hover:bg-red-600 border-red-600 border-2  text-red-600 hover:text-white px-2 py-1 rounded-md"
      >
        {cancelLabel}
      </button>
    </div>
  );
};

export default ConfirmCancel;
