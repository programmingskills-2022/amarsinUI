interface CustomButtonProps {
  text: string;
  backgroundColor?: string;
  backgroundColorHover?: string;
  color?: string;
  variant?: string;
  colorHover?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function Button(props: CustomButtonProps) {
  const {
    text,
    backgroundColor = "bg-green-500",
    color = "text-white",
    variant = "",
    backgroundColorHover = "bg-green-600",
    colorHover = "text-white",
    disabled = false,
    onClick,
  } = props;

  const classname = `${backgroundColor} hover:${backgroundColorHover} hover:${colorHover} px-4 py-2 rounded-md ${color}  ${variant}`;
  return (
    <button className={classname} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
