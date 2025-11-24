import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const FieldCard = ({ field }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/fields/${field.Id}`);
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Square" className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
{field.Name}
            </h3>
            <p className="text-sm text-gray-500">
              {field.area_c} {field.unit_c}
            </p>
          </div>
        </div>
        
        {field.cropName && (
          <Badge variant="primary">
            {field.cropName}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
<div className="flex items-center space-x-2">
          <ApperIcon name="Layers" className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{field.soil_type_c}</span>
        </div>
        
<div className="flex items-center space-x-2">
          <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {field.coordinates_c?.length || 0} points
          </span>
        </div>
      </div>

      {field.currentStage && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Sprout" className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {field.currentStage}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FieldCard;