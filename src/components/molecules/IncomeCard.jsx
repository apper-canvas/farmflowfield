import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const colors = {
  sales: "success",
  crops: "primary", 
  livestock: "secondary",
  services: "info",
  grants: "warning",
  rental: "accent",
  other: "default"
};

const IncomeCard = ({ income, onEdit }) => {
  const getCategoryIcon = (category) => {
    const categoryMap = {
      sales: "TrendingUp",
      crops: "Wheat", 
      livestock: "Cow",
      services: "Wrench",
      grants: "Award",
      rental: "Home",
      other: "DollarSign"
    };
    return categoryMap[category?.toLowerCase()] || "DollarSign";
  };

  const getCategoryColor = (category) => {
    return colors[category?.toLowerCase()] || "default";
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(income);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <ApperIcon 
              name={getCategoryIcon(income.category_c)} 
              className="w-5 h-5 text-success" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
              {income.title_c || income.title || "Income Entry"}
            </h3>
            <p className="text-xs text-gray-500">
              {format(new Date(income.date_c || income.date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="font-bold text-success text-lg">
              +${(income.amount_c || income.amount || 0).toFixed(2)}
            </div>
          </div>
          
          <button
            onClick={handleEditClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
            title="Edit income"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant={getCategoryColor(income.category_c)} size="sm">
            <ApperIcon name={getCategoryIcon(income.category_c)} className="w-3 h-3 mr-1" />
            {(income.category_c || income.category || "Other").charAt(0).toUpperCase() + (income.category_c || income.category || "Other").slice(1)}
          </Badge>
          
          {income.fieldName && (
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Square" className="w-3 h-3 mr-1" />
              {income.fieldName}
            </div>
          )}
        </div>

        {(income.description_c || income.description) && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {income.description_c || income.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <ApperIcon name="CreditCard" className="w-3 h-3 mr-1" />
            {(income.payment_method_c || income.paymentMethod || "").replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "N/A"}
          </div>
          
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            {format(new Date(income.date_c || income.date), "MMM d")}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IncomeCard;