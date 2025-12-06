import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  border?: 'default' | 'thin' | 'thick' | 'none';
  borderColor?: string;
  backgroundColor?: string;
  hover?: boolean;
  textSize?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = 'default',
  borderColor = 'gray',
  backgroundColor = 'white',
  textSize = 'text-sm',
  hover = false,
}) => {
  const paddingClasses: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none', string> = {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    none: '',
  };

  const shadowClasses: Record<'sm' | 'md' | 'lg' | 'xl' | 'none', string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: '',
  };

  const roundedClasses: Record<'sm' | 'md' | 'lg' | 'xl' | 'none', string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    none: '',
  };

  const borderClasses = {
    default: 'border border-gray-200',
    thin: 'border border-gray-100',
    thick: 'border-2 border-gray-300',
    none: '',
  };

  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  const baseClasses = `${textSize} 
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${borderClasses[border]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div
      className={baseClasses}
      style={{ backgroundColor ,borderColor:borderColor}}
    >
      {children}
    </div>
  );
};

export default Card;
