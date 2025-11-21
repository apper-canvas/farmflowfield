import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import ExpenseCard from "@/components/molecules/ExpenseCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import expenseService from "@/services/api/expenseService";
import fieldService from "@/services/api/fieldService";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("current");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, fields, searchQuery, categoryFilter, monthFilter]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [expensesData, fieldsData] = await Promise.all([
        expenseService.getAll(),
        fieldService.getAll()
      ]);
      
      setExpenses(expensesData);
      setFields(fieldsData);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses.map(expense => {
      const field = fields.find(f => f.Id.toString() === expense.fieldId);
      return {
        ...expense,
        fieldName: field?.name
      };
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.fieldName?.toLowerCase().includes(query) ||
        expense.paymentMethod.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Month filter
    if (monthFilter !== "all") {
      const now = new Date();
      let startDate, endDate;

      switch (monthFilter) {
        case "current":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "last":
          const lastMonth = subMonths(now, 1);
          startDate = startOfMonth(lastMonth);
          endDate = endOfMonth(lastMonth);
          break;
        default:
          startDate = null;
          endDate = null;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        });
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredExpenses(filtered);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const expenseData = {
        category: formData.get("category"),
        amount: parseFloat(formData.get("amount")),
        date: formData.get("date"),
        description: formData.get("description"),
        fieldId: formData.get("fieldId") || null,
        paymentMethod: formData.get("paymentMethod")
      };

      if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const newExpense = await expenseService.create(expenseData);
      
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
      setShowAddModal(false);
      toast.success("Expense added successfully!");
      
      // Reset form
      e.target.reset();
    } catch (err) {
      toast.error("Failed to add expense");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowAddModal(true);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadExpenses} />;

  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const categorySummary = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = ["labor", "inputs", "equipment", "utilities", "maintenance", "fuel", "other"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track your farm costs and spending</p>
        </div>
        
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search expenses by description, category, field, or payment method..."
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>

          <Select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="current">This Month</option>
            <option value="last">Last Month</option>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setMonthFilter("current");
            }}
          >
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button variant="outline">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            ${totalExpenses.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">Total Expenses</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">
            {filteredExpenses.length}
          </div>
          <p className="text-sm text-gray-600">Total Records</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            ${filteredExpenses.length ? (totalExpenses / filteredExpenses.length).toFixed(0) : 0}
          </div>
          <p className="text-sm text-gray-600">Average per Record</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-info mb-1">
            {Object.keys(categorySummary).length}
          </div>
          <p className="text-sm text-gray-600">Categories</p>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categorySummary).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categorySummary)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    ${amount.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{category}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No expenses found"
          message={searchQuery || categoryFilter !== "all" || monthFilter !== "all" ? 
            "No expenses match your search criteria. Try adjusting your filters." :
            "Start by adding your first expense to track your farm costs and manage your budget effectively."
          }
          actionLabel="Add First Expense"
          onAction={() => setShowAddModal(true)}
          showAction={!searchQuery && categoryFilter === "all"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense) => (
            <ExpenseCard 
              key={expense.Id} 
              expense={expense} 
              onEdit={handleEditExpense}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddExpense} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingExpense(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Select
                  name="category"
                  label="Category"
                  defaultValue={editingExpense?.category || ""}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Select>

                <Input
                  name="amount"
                  label="Amount ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingExpense?.amount || ""}
                  required
                  placeholder="0.00"
                />

                <Input
                  name="date"
                  label="Date"
                  type="date"
                  defaultValue={editingExpense?.date ? format(new Date(editingExpense.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                  required
                />

                <Input
                  name="description"
                  label="Description"
                  type="text"
                  defaultValue={editingExpense?.description || ""}
                  required
                  placeholder="Brief description of the expense"
                />

                <Select
                  name="fieldId"
                  label="Associated Field (Optional)"
                  defaultValue={editingExpense?.fieldId || ""}
                >
                  <option value="">No specific field</option>
                  {fields.map(field => (
                    <option key={field.Id} value={field.Id}>
                      {field.name}
                    </option>
                  ))}
                </Select>

                <Select
                  name="paymentMethod"
                  label="Payment Method"
                  defaultValue={editingExpense?.paymentMethod || ""}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </Select>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingExpense ? "Update Expense" : "Add Expense"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingExpense(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center lg:hidden active:scale-95"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Expenses;