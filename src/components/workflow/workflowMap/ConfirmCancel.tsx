
type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmCancel = ({ onConfirm, onCancel }: Props) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onConfirm}
        className="w-20 hover:bg-green-600 border-green-600 border-2  text-green-600 hover:text-white px-2 py-1 rounded-md"
      >
        تایید
      </button>
      <button
        onClick={onCancel}
        className="w-20 hover:bg-red-600 border-red-600 border-2  text-red-600 hover:text-white px-2 py-1 rounded-md"
      >
        انصراف
      </button>
    </div>
  );
};

export default ConfirmCancel;
