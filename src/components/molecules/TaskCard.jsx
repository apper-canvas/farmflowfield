import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tasks/${task.Id}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      planting: "Sprout",
      irrigation: "Droplets",
      fertilizing: "Zap",
      harvesting: "Wheat",
      maintenance: "Wrench",
      monitoring: "Eye"
    };
    return icons[category?.toLowerCase()] || "CheckSquare";
  };

const isOverdue = new Date(task.due_date_c || task.dueDate) < new Date() && (task.status_c || task.status) !== "completed";

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon 
              name={getCategoryIcon(task.category)} 
              className="w-5 h-5 text-primary" 
            />
          </div>
          <div>
<h3 className="font-semibold text-gray-900 line-clamp-1">
              {task.title_c || task.title}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {task.category_c || task.category}
            </p>
          </div>
        </div>
        
<StatusBadge 
          status={isOverdue ? "overdue" : (task.status_c || task.status)} 
          type="task"
        />
      </div>

{(task.description_c || task.description) && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description_c || task.description}
        </p>
      )}

<div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <ApperIcon name="Calendar" className="w-4 h-4" />
<span>
            Due: {(task.due_date_c || task.dueDate) && !isNaN(new Date(task.due_date_c || task.dueDate).getTime()) 
              ? format(new Date(task.due_date_c || task.dueDate), "MMM d, yyyy")
              : "No due date"
            }
          </span>
        </div>
        
{(task.priority_c || task.priority) && (
          <StatusBadge status={task.priority_c || task.priority} type="priority" />
        )}
      </div>

      {task.fieldName && (
        <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          <span>{task.fieldName}</span>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;