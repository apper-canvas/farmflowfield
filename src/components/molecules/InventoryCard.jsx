import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";

const InventoryCard = ({ item, onEdit }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      seeds: "Sprout",
      fertilizer: "Zap",
      pesticide: "Shield",
      tools: "Wrench",
      equipment: "Cog",
      fuel: "Fuel"
    };
    return icons[category?.toLowerCase()] || "Package";
  };

const getStockStatus = () => {
    if ((item.quantity_c || 0) <= (item.reorder_level_c || 0)) return "low";
    if ((item.quantity_c || 0) <= (item.reorder_level_c || 0) * 2) return "medium";
    return "high";
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
<ApperIcon 
              name={getCategoryIcon(item.category_c || item.category)} 
              className="w-5 h-5 text-accent"
            />
          </div>
          <div>
<h3 className="font-semibold text-gray-900">
              {item.Name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {item.category_c || item.category}
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

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-baseline space-x-2">
<span className="text-2xl font-bold text-gray-900">
              {item.quantity_c || 0}
            </span>
            <span className="text-sm text-gray-500">
              {item.unit_c || item.unit}
            </span>
          </div>
<p className="text-xs text-gray-500">
            Reorder at: {item.reorder_level_c || 0} {item.unit_c || item.unit}
          </p>
        </div>
        
        <StatusBadge status={getStockStatus()} type="inventory" />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
<ApperIcon name="DollarSign" className="w-4 h-4" />
          <span>${item.cost_per_unit_c || 0}/{item.unit_c || item.unit}</span>
        </div>
        
{(item.supplier_c || item.supplier) && (
          <div className="flex items-center space-x-1">
            <ApperIcon name="Truck" className="w-4 h-4" />
            <span className="truncate max-w-[100px]">{item.supplier_c || item.supplier}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InventoryCard;