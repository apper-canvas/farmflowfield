import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import taskService from "@/services/api/taskService";
import fieldService from "@/services/api/fieldService";
import cropService from "@/services/api/cropService";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [field, setField] = useState(null);
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (taskId) {
      loadTaskDetails();
    }
  }, [taskId]);

  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const taskData = await taskService.getById(taskId);
      setTask(taskData);

if (taskData.field_id_c?.Id || taskData.field_id_c) {
        const fieldId = taskData.field_id_c?.Id || taskData.field_id_c;
        const fieldData = await fieldService.getById(fieldId);
        setField(fieldData);
      }

if (taskData.crop_id_c?.Id || taskData.crop_id_c) {
        const cropId = taskData.crop_id_c?.Id || taskData.crop_id_c;
        const cropData = await cropService.getById(cropId);
        setCrop(cropData);
      }
    } catch (err) {
      setError(err.message || "Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      setCompleting(true);
      
      const updatedTask = await taskService.markCompleted(taskId);
      setTask(updatedTask);
      
      toast.success("Task completed successfully!");
    } catch (err) {
      toast.error("Failed to complete task");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadTaskDetails} />;
  if (!task) return <ErrorView title="Task not found" message="The requested task could not be found." />;

// Helper function to check if a date is valid
  const isValidDate = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  // Safe date formatting with fallback
  const formatSafeDate = (date, formatString, fallback = "Invalid date") => {
    if (!isValidDate(date)) return fallback;
    try {
      return format(new Date(date), formatString);
    } catch (error) {
      console.warn('Date formatting error:', error);
      return fallback;
    }
  };

  const dueDate = task.due_date_c || task.dueDate;
  const isOverdue = isValidDate(dueDate) && new Date(dueDate) < new Date() && (task.status_c || task.status) !== "completed";
  const canComplete = task.status === "pending";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={() => navigate("/tasks")}
          variant="ghost"
          size="sm"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
      </div>

      {/* Task Info */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon 
                name={getCategoryIcon(task.category)} 
                className="w-8 h-8 text-primary" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
{task.title_c || task.title}
              </h1>
              <div className="flex items-center space-x-4 mb-3">
<StatusBadge 
                  status={isOverdue ? "overdue" : (task.status_c || task.status)} 
                  type="task"
                />
{(task.priority_c || task.priority) && (
                  <StatusBadge status={task.priority_c || task.priority} type="priority" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
<span>Due: {formatSafeDate(task.due_date_c || task.dueDate, "MMMM d, yyyy 'at' h:mm a", "Not set")}</span>
                </div>
{(task.assigned_to_c || task.assignedTo) && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="User" className="w-4 h-4" />
                    <span>Assigned to: {task.assigned_to_c || task.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
              Edit Task
            </Button>
            
            {canComplete && (
              <Button 
                onClick={handleCompleteTask}
                disabled={completing}
                variant="success"
                size="sm"
              >
                {completing ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Task Description */}
{(task.description_c || task.description) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{task.description_c || task.description}</p>
        </Card>
      )}

      {/* Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field & Crop Info */}
        {(field || crop) && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Crop</h3>
            <div className="space-y-4">
              {field && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MapPin" className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
<h4 className="font-medium text-gray-900">{field.Name}</h4>
                    <p className="text-sm text-gray-600">
                      {field.area_c} {field.unit_c} • {field.soil_type_c}
                    </p>
                  </div>
                </div>
              )}

              {crop && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Sprout" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
<h4 className="font-medium text-gray-900">{crop.Name}</h4>
                    <p className="text-sm text-gray-600">
                      {crop.variety_c} • {crop.current_stage_c}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Task Metadata */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Category</span>
<span className="text-sm text-gray-900 capitalize">{task.category_c || task.category}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Priority</span>
<StatusBadge status={task.priority_c || task.priority} type="priority" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
<StatusBadge 
                status={isOverdue ? "overdue" : (task.status_c || task.status)} 
                type="task"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Due Date</span>
              <span className="text-sm text-gray-900">
{formatSafeDate(task.due_date_c || task.dueDate, "MMM d, yyyy", "Not set")}
              </span>
            </div>

{isValidDate(task.completed_date_c || task.completedDate) && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Completed</span>
                <span className="text-sm text-gray-900">
                  {formatSafeDate(task.completed_date_c || task.completedDate, "MMM d, yyyy 'at' h:mm a", "Invalid date")}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Completion Status */}
{(task.status_c || task.status) === "completed" && (
        <Card className="p-6 bg-success/5 border-success/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-success">Task Completed</h3>
              <p className="text-sm text-gray-600">
                Completed on {formatSafeDate(task.completed_date_c || task.completedDate, "MMMM d, yyyy 'at' h:mm a", "Unknown date")}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaskDetail;