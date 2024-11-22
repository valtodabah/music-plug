import React from "react";

export function Select({ children, value, onChange, className }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
    return <option value={value}>{children}</option>;
}