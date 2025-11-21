import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import fieldService from "@/services/api/fieldService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";

const FieldDetail = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [crop, setCrop] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fieldId) {
      loadFieldDetails();
    }
  }, [fieldId]);

  const loadFieldDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [fieldData, tasksData] = await Promise.all([
        fieldService.getById(fieldId),
        taskService.getByFieldId(fieldId)
      ]);

      setField(fieldData);
      setTasks(tasksData);

      if (fieldData.cropId) {
        const cropData = await cropService.getById(fieldData.cropId);
        setCrop(cropData);
      }
    } catch (err) {
      setError(err.message || "Failed to load field details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadFieldDetails} />;
  if (!field) return <ErrorView title="Field not found" message="The requested field could not be found." />;

  const completedStages = crop?.stages?.filter(stage => stage.completed) || [];
  const currentStageIndex = crop?.stages?.findIndex(stage => !stage.completed) || 0;
  const progressPercentage = crop?.stages ? (completedStages.length / crop.stages.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={() => navigate("/fields")}
          variant="ghost"
          size="sm"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Fields
        </Button>
      </div>

      {/* Field Info */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="Square" className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
              <p className="text-gray-600">
                {field.area} {field.unit} • {field.soilType}
              </p>
              {crop && (
                <Badge variant="primary" className="mt-2">
                  {crop.name} - {crop.variety}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
              Edit Field
            </Button>
            <Button size="sm">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </Card>

      {/* Field Map */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Boundaries</h3>
        <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="Map" className="w-12 h-12 text-primary mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">GPS Field Mapping</h4>
            <p className="text-gray-600 text-sm">
              Interactive field boundaries with {field.coordinates?.length || 0} GPS points
            </p>
          </div>
        </div>
      </Card>

      {/* Crop Timeline */}
      {crop && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Crop Progress</h3>
            <Badge variant={progressPercentage === 100 ? "success" : "primary"}>
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {crop.stages?.map((stage, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg ${
                  stage.completed
                    ? "bg-success/5 border border-success/20"
                    : index === currentStageIndex
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.completed
                      ? "bg-success text-white"
                      : index === currentStageIndex
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {stage.completed ? (
                    <ApperIcon name="Check" className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(stage.startDate), "MMM d")} - {format(new Date(stage.endDate), "MMM d, yyyy")}
                  </p>
                  {index === currentStageIndex && !stage.completed && (
                    <p className="text-sm text-primary font-medium mt-1">Current Stage</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Field Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Field Tasks</h3>
          <Button size="sm" onClick={() => navigate("/tasks")}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No tasks yet
            </h4>
            <p className="text-gray-600 mb-4">
              Create tasks to manage activities for this field.
            </p>
            <Button onClick={() => navigate("/tasks")}>
              Create First Task
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.Id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldDetail;