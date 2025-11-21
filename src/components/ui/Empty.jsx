import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({
  icon = "Seedling",
  title = "No data found",
  message = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  showAction = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;