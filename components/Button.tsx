import React from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string; 
  label?: string;
  icon?: React.ReactNode
  type?: 'submit' | 'reset' | "button" | undefined
}

const Button: React.FC<ButtonProps> = ({ onClick, className = "", label, icon,type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`p-3 rounded text-white font-semibold cursor-pointer transition-all duration-300 mb-4 flex items-center justify-center ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
