type Props = { caption: string };

const InvoiceShowTableHeader = ({ caption }: Props) => {
  return (
    <div className="flex justify-center items-center w-full text-xs font-bold text-gray-500 bg-gray-200 p-1 border-x border-t border-gray-300">
      <p>{caption}</p>
    </div>
  );
};

export default InvoiceShowTableHeader;
