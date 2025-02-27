import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className = "",
  label,
}) => {
  return (
    <>
      <label className="block mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange} 
        className={`p-2 mb-4 rounded bg-gray-800 text-white ${className}`}
      />
    </>
  );
};

export default Input;
