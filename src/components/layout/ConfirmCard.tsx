type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  variant?: string;
};

const ConfirmCard = ({
  children,
  backgroundColor = "bg-gray-100",
  variant = "justify-end",
}: Props) => {
  const classname = `w-full ${backgroundColor} p-2 flex  ${variant}`;
  return <div className={classname}>{children}</div>;
};

export default ConfirmCard;
