import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import fieldService from "@/services/api/fieldService";
import taskService from "@/services/api/taskService";
import expenseService from "@/services/api/expenseService";
import inventoryService from "@/services/api/inventoryService";

const Reports = () => {
  const [reportData, setReportData] = useState({
    fields: [],
    tasks: [],
    expenses: [],
    inventory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("current_month");

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const [fields, tasks, expenses, inventory] = await Promise.all([
        fieldService.getAll(),
        taskService.getAll(),
        expenseService.getAll(),
        inventoryService.getAll()
      ]);

      setReportData({ fields, tasks, expenses, inventory });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate, endDate;

    switch (timePeriod) {
      case "current_month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "last_month":
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case "last_3_months":
        startDate = startOfMonth(subMonths(now, 2));
        endDate = endOfMonth(now);
        break;
      case "all_time":
      default:
        return reportData.expenses;
    }

    return reportData.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  const getTaskStats = () => {
    const tasks = reportData.tasks;
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "completed").length,
      pending: tasks.filter(t => t.status === "pending").length,
      overdue: tasks.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== "completed"
      ).length
    };
  };

  const getExpenseStats = () => {
    const filteredExpenses = getFilteredExpenses();
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const byCategory = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return { total, byCategory, count: filteredExpenses.length };
  };

  const getInventoryStats = () => {
    const items = reportData.inventory;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel);
    
    return {
      totalItems: items.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      categories: [...new Set(items.map(item => item.category))].length
    };
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadReportData} />;

  const taskStats = getTaskStats();
  const expenseStats = getExpenseStats();
  const inventoryStats = getInventoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your farm performance and trends</p>
        </div>
        
        <Button variant="outline">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Report Type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="overview">Farm Overview</option>
          <option value="financial">Financial Summary</option>
          <option value="productivity">Productivity Report</option>
          <option value="inventory">Inventory Analysis</option>
        </Select>

        <Select
          label="Time Period"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="current_month">Current Month</option>
          <option value="last_month">Last Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="all_time">All Time</option>
        </Select>
      </div>

      {/* Overview Report */}
      {reportType === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="Square" className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {reportData.fields.length}
              </div>
              <p className="text-sm text-gray-600">Active Fields</p>
              <p className="text-xs text-gray-500 mt-1">
                {reportData.fields.reduce((sum, f) => sum + f.area, 0).toFixed(1)} total acres
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round((taskStats.completed / taskStats.total) * 100) || 0}%
              </div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <p className="text-xs text-gray-500 mt-1">
                {taskStats.completed} of {taskStats.total} tasks
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${expenseStats.total.toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xs text-gray-500 mt-1">
                {expenseStats.count} transactions
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="Package" className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {inventoryStats.totalItems}
              </div>
              <p className="text-sm text-gray-600">Inventory Items</p>
              <p className="text-xs text-gray-500 mt-1">
                ${inventoryStats.totalValue.toFixed(0)} total value
              </p>
            </Card>
          </div>

          {/* Task Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                    <span className="text-sm font-bold text-success">{taskStats.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-success h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Pending</span>
                    <span className="text-sm font-bold text-warning">{taskStats.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-warning h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(taskStats.pending / taskStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Overdue</span>
                    <span className="text-sm font-bold text-error">{taskStats.overdue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-error h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(taskStats.overdue / taskStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {taskStats.total}
                </div>
                <p className="text-gray-600 mb-4">Total Tasks</p>
                <div className="text-lg font-semibold text-primary">
                  {Math.round((taskStats.completed / taskStats.total) * 100) || 0}%
                </div>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Financial Report */}
      {reportType === "financial" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expense Breakdown - {timePeriod.replace("_", " ").toUpperCase()}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  {Object.entries(expenseStats.byCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ${amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(amount / expenseStats.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((amount / expenseStats.total) * 100)}% of total
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${expenseStats.total.toFixed(2)}
                </div>
                <p className="text-gray-600 mb-4">Total Expenses</p>
                <div className="text-lg font-semibold text-secondary">
                  ${(expenseStats.total / expenseStats.count).toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">Average per Transaction</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-lg font-semibold text-accent">
                    {expenseStats.count}
                  </div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === "inventory" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {inventoryStats.totalItems}
              </div>
              <p className="text-sm text-gray-600">Total Items</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                ${inventoryStats.totalValue.toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Total Value</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-error mb-1">
                {inventoryStats.lowStockCount}
              </div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {inventoryStats.categories}
              </div>
              <p className="text-sm text-gray-600">Categories</p>
            </Card>
          </div>

          {inventoryStats.lowStockCount > 0 && (
            <Card className="p-6 border-l-4 border-l-error">
              <div className="flex items-start space-x-3">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Inventory Alert</h3>
                  <p className="text-gray-600 mb-3">
                    {inventoryStats.lowStockCount} items are below reorder level and need immediate attention.
                  </p>
                  <Button variant="error" size="sm">
                    <ApperIcon name="Package" className="w-4 h-4 mr-2" />
                    View Low Stock Items
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Export Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex-col h-auto py-4">
            <ApperIcon name="FileText" className="w-6 h-6 mb-2" />
            <span>PDF Report</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-auto py-4">
            <ApperIcon name="FileSpreadsheet" className="w-6 h-6 mb-2" />
            <span>Excel Export</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-auto py-4">
            <ApperIcon name="Database" className="w-6 h-6 mb-2" />
            <span>Raw Data</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-auto py-4">
            <ApperIcon name="Mail" className="w-6 h-6 mb-2" />
            <span>Email Report</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;