type Props = {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  message: string;
  backgroundColor?: string;
  bgColorButton?: string;
  bgColorButtonHover?: string;
  color?: string;
  visibleButton?: boolean;
};

const ModalMessage = ({
  isOpen,
  onClose,
  message,
  backgroundColor = "bg-green-200",
  color = "text-white",
  bgColorButton = "bg-green-500",
  bgColorButtonHover = "bg-green-600",
  visibleButton=true
}: Props) => {
  if (!isOpen) return null;

  const classname = `fixed flex bottom-6 left-1/2 -translate-x-1/2 p-4 border ${backgroundColor} shadow-lg rounded-lg z-50 animate-open-modalMsg`;
  
  return (
    <>
      {message !== '' && (
        <div className={classname} style={{ backgroundColor }}>
          <h2 className="text-sm font-semibold">{message}</h2>
          {visibleButton && (
            <div className="flex place-content-end">
              <button
                onClick={onClose}
                className={`text-sm px-2 py-1 ${bgColorButton} ${color} rounded-md hover:${bgColorButtonHover}`}
              >
                خروج
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ModalMessage;
