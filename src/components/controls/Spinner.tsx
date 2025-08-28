import React from "react";

interface SpinnerProps {
  size?: number; // size in pixels
  color?: string; // Hex color code or valid CSS color string
}

const Spinner: React.FC<SpinnerProps> = ({ size = 8, color = "#3b82f6" }) => {
  return (
    <div
      className="border-4 border-t-transparent rounded-full animate-spin"
      style={{
        width: size * 4,
        height: size * 4,
        borderColor: color,
        borderTopColor: 'transparent',
      }}
    />
  );
};

export default Spinner;