import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import fieldService from "@/services/api/fieldService";
import taskService from "@/services/api/taskService";
import inventoryService from "@/services/api/inventoryService";
import expenseService from "@/services/api/expenseService";
import weatherService from "@/services/api/weatherService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    fields: [],
    tasks: [],
    inventory: [],
    expenses: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [fields, tasks, inventory, expenses, weather] = await Promise.all([
        fieldService.getAll(),
        taskService.getAll(),
        inventoryService.getAll(),
        expenseService.getAll(),
        weatherService.getCurrentWeather()
      ]);

      setDashboardData({
        fields,
        tasks,
        inventory,
        expenses,
        weather
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />;

  const pendingTasks = dashboardData.tasks.filter(task => task.status === "pending");
  const overdueTasks = dashboardData.tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== "completed"
  );
  const lowStockItems = dashboardData.inventory.filter(item => 
    item.quantity <= item.reorderLevel
  );
  const thisMonthExpenses = dashboardData.expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((total, expense) => total + expense.amount, 0);

  const quickActions = [
    {
      title: "Add Field",
      icon: "Plus",
      color: "bg-primary",
      action: () => navigate("/fields")
    },
    {
      title: "Create Task",
      icon: "CheckSquare",
      color: "bg-secondary",
      action: () => navigate("/tasks")
    },
    {
      title: "Log Expense",
      icon: "DollarSign",
      color: "bg-accent",
      action: () => navigate("/expenses")
    },
    {
      title: "View Weather",
      icon: "Cloud",
      color: "bg-info",
      action: () => navigate("/weather")
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to FarmFlow
        </h1>
        <p className="text-gray-600">
          Manage your farm operations efficiently
        </p>
      </div>

      {/* Weather Widget */}
      <WeatherCard weather={dashboardData.weather} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <ApperIcon name="Square" className="w-6 h-6 text-primary" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData.fields.length}
          </div>
          <p className="text-sm text-gray-600">Active Fields</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {pendingTasks.length}
          </div>
          <p className="text-sm text-gray-600">Pending Tasks</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-error/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-error" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {lowStockItems.length}
          </div>
          <p className="text-sm text-gray-600">Low Stock Items</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${thisMonthExpenses.toFixed(0)}
          </div>
          <p className="text-sm text-gray-600">This Month</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg mb-3 flex items-center justify-center`}>
                <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Alerts */}
      {(overdueTasks.length > 0 || lowStockItems.length > 0) && (
        <Card className="p-6 border-l-4 border-l-warning">
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Attention Required</h3>
              <div className="space-y-2 text-sm">
                {overdueTasks.length > 0 && (
                  <p className="text-error">
                    <strong>{overdueTasks.length}</strong> overdue tasks need attention
                  </p>
                )}
                {lowStockItems.length > 0 && (
                  <p className="text-warning">
                    <strong>{lowStockItems.length}</strong> items are low on stock
                  </p>
                )}
              </div>
              <div className="flex space-x-2 mt-3">
                {overdueTasks.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="error"
                    onClick={() => navigate("/tasks")}
                  >
                    View Tasks
                  </Button>
                )}
                {lowStockItems.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="warning"
                    onClick={() => navigate("/inventory")}
                  >
                    Check Inventory
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/tasks")}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {pendingTasks.slice(0, 3).map((task) => (
            <TaskCard key={task.Id} task={task} />
          ))}
          
          {pendingTasks.length === 0 && (
            <Card className="p-8 text-center">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 mb-4">
                No pending tasks at the moment.
              </p>
              <Button onClick={() => navigate("/tasks")}>
                Create New Task
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;