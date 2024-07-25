import React from "react";

const CustomInput = ({ type, placeholder, value, onChange, className, label }) => {
  return (
    <div >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`block w-full p-3 border rounded-md shadow-sm ${className}`}
      />
    </div>
  );
};

export default CustomInput;
