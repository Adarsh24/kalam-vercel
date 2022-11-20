import React from "react";

export function Label({htmlFor, title}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {title}
    </label>
  );
}
  