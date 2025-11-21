import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  className, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary-300 active:scale-95",
    secondary: "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-300 active:scale-95",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200 active:scale-95",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 active:scale-95",
    success: "bg-success text-white hover:bg-green-600 focus:ring-green-300 active:scale-95",
    warning: "bg-warning text-white hover:bg-amber-600 focus:ring-amber-300 active:scale-95",
    error: "bg-error text-white hover:bg-red-700 focus:ring-red-300 active:scale-95"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    default: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;