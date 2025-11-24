import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ExpenseCard = ({ expense, onEdit }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      labor: "Users",
      inputs: "Package",
      equipment: "Wrench",
      utilities: "Zap",
      maintenance: "Settings",
      fuel: "Fuel",
      other: "DollarSign"
    };
    return icons[category?.toLowerCase()] || "DollarSign";
  };

  const getCategoryColor = (category) => {
    const colors = {
      labor: "primary",
      inputs: "secondary",
      equipment: "warning",
      utilities: "info",
      maintenance: "success",
      fuel: "error",
      other: "default"
    };
    return colors[category?.toLowerCase()] || "default";
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(expense);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon 
              name={getCategoryIcon(expense.category)} 
              className="w-5 h-5 text-primary" 
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
<span className="text-xl font-bold text-gray-900">
                ${(expense?.amount && typeof expense.amount === 'number' ? expense.amount : 0).toFixed(2)}
              </span>
              <Badge variant={getCategoryColor(expense.category)}>
                {expense.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {format(new Date(expense.date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleEditClick}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="Edit2" className="w-4 h-4" />
        </button>
      </div>

      {expense.description && (
        <p className="text-gray-600 text-sm mb-3">
          {expense.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        {expense.fieldName && (
          <div className="flex items-center space-x-1">
            <ApperIcon name="MapPin" className="w-4 h-4" />
            <span>{expense.fieldName}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <ApperIcon name="CreditCard" className="w-4 h-4" />
          <span className="capitalize">{expense.paymentMethod}</span>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;