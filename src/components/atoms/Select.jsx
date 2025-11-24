import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  label, 
  error, 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
<select
        ref={ref}
        className={cn(
          "form-field",
          error && "border-error focus:ring-error/30 focus:border-error",
          className
        )}
        {...props}
      >
        {props.options 
          ? props.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;