import React, { useEffect, useState } from "react";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { toast } from "react-toastify";
import incomeService from "@/services/api/incomeService";
import fieldService from "@/services/api/fieldService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import IncomeCard from "@/components/molecules/IncomeCard";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("current");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  useEffect(() => {
    filterIncomes();
  }, [incomes, fields, searchQuery, categoryFilter, monthFilter]);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [incomesData, fieldsData] = await Promise.all([
        incomeService.getAll(),
        fieldService.getAll()
      ]);
      
      setIncomes(incomesData);
      setFields(fieldsData);
    } catch (err) {
      setError(err.message || "Failed to load income records");
    } finally {
      setLoading(false);
    }
  };

  const filterIncomes = () => {
    let filtered = incomes.map(income => {
      const field = fields.find(f => f.Id.toString() === (income.field_id_c?.Id || income.field_id_c || '').toString());
      return {
        ...income,
        fieldName: field?.Name
      };
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(income =>
        (income.title_c || income.title || '').toLowerCase().includes(query) ||
        (income.category_c || income.category || '').toLowerCase().includes(query) ||
        (income.fieldName || '').toLowerCase().includes(query) ||
        (income.payment_method_c || income.paymentMethod || '').toLowerCase().includes(query) ||
        (income.description_c || income.description || '').toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(income => (income.category_c || income.category) === categoryFilter);
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
        filtered = filtered.filter(income => {
          const incomeDate = new Date(income.date_c || income.date);
          return incomeDate >= startDate && incomeDate <= endDate;
        });
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date_c || b.date) - new Date(a.date_c || a.date));

    setFilteredIncomes(filtered);
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const incomeData = {
        title_c: formData.get("title"),
        category_c: formData.get("category"),
        amount_c: parseFloat(formData.get("amount")),
        date_c: formData.get("date"),
        description_c: formData.get("description"),
        field_id_c: formData.get("fieldId") ? parseInt(formData.get("fieldId")) : null,
        payment_method_c: formData.get("paymentMethod"),
        receipt_c: formData.get("receipt") // Handle file upload later
      };

      if (isNaN(incomeData.amount_c) || incomeData.amount_c <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (editingIncome) {
        const updatedIncome = await incomeService.update(editingIncome.Id, incomeData);
        setIncomes(prevIncomes => 
          prevIncomes.map(income => 
            income.Id === editingIncome.Id ? updatedIncome : income
          )
        );
        toast.success("Income updated successfully!");
      } else {
        const newIncome = await incomeService.create(incomeData);
        setIncomes(prevIncomes => [newIncome, ...prevIncomes]);
        toast.success("Income added successfully!");
      }
      
      setShowAddModal(false);
      setEditingIncome(null);
      
      // Reset form
      e.target.reset();
    } catch (err) {
      toast.error(editingIncome ? "Failed to update income" : "Failed to add income");
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setShowAddModal(true);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadIncomes} />;

  const totalIncome = filteredIncomes.reduce((total, income) => total + (income.amount_c || income.amount || 0), 0);
  const categorySummary = filteredIncomes.reduce((acc, income) => {
    const category = income.category_c || income.category || 'other';
    acc[category] = (acc[category] || 0) + (income.amount_c || income.amount || 0);
    return acc;
  }, {});

const categories = ["sales", "crops", "livestock", "services", "grants", "rental", "other"];
  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Check", "Bank Transfer", "Other"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600">Track your farm revenue and earnings</p>
        </div>
        
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search income by title, category, field, or payment method..."
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
          <div className="text-2xl font-bold text-success mb-1">
            ${totalIncome.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">Total Income</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">
            {filteredIncomes.length}
          </div>
          <p className="text-sm text-gray-600">Total Records</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            ${filteredIncomes.length ? (totalIncome / filteredIncomes.length).toFixed(0) : 0}
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
                  <div className="text-lg font-bold text-success">
                    ${amount.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{category}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Income List */}
      {filteredIncomes.length === 0 ? (
        <Empty
          icon="TrendingUp"
          title="No income records found"
          message={searchQuery || categoryFilter !== "all" || monthFilter !== "all" ? 
            "No income records match your search criteria. Try adjusting your filters." :
            "Start by adding your first income entry to track your farm revenue and monitor your earnings effectively."
          }
          actionLabel="Add First Income"
          onAction={() => setShowAddModal(true)}
          showAction={!searchQuery && categoryFilter === "all"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncomes.map((income) => (
            <IncomeCard 
              key={income.Id} 
              income={income} 
              onEdit={handleEditIncome}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddIncome} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingIncome ? "Edit Income" : "Add New Income"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingIncome(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  name="title"
                  label="Title"
                  type="text"
                  defaultValue={editingIncome?.title_c || editingIncome?.title || ""}
                  required
                  placeholder="Brief title for this income"
                />

                <Input
                  name="category"
                  label="Category"
                  type="text"
                  defaultValue={editingIncome?.category_c || editingIncome?.category || ""}
                  required
                  placeholder="e.g., sales, crops, livestock, services"
                />

                <Input
                  name="amount"
                  label="Amount ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingIncome?.amount_c || editingIncome?.amount || ""}
                  required
                  placeholder="0.00"
                />

                <Input
                  name="date"
                  label="Date"
                  type="date"
                  defaultValue={editingIncome?.date_c || editingIncome?.date ? format(new Date(editingIncome.date_c || editingIncome.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                  required
                />

                <Input
                  name="description"
                  label="Description"
                  type="text"
                  defaultValue={editingIncome?.description_c || editingIncome?.description || ""}
                  placeholder="Additional details about this income"
                />

                <Select
                  name="fieldId"
                  label="Associated Field (Optional)"
                  defaultValue={editingIncome?.field_id_c?.Id || editingIncome?.field_id_c || editingIncome?.fieldId || ""}
                >
                  <option value="">No specific field</option>
                  {fields.map(field => (
                    <option key={field.Id} value={field.Id}>
                      {field.Name}
                    </option>
                  ))}
                </Select>

<Select
                  name="paymentMethod"
                  label="Payment Method"
                  defaultValue={editingIncome?.payment_method_c || editingIncome?.paymentMethod || ""}
                  options={paymentMethods.map(method => ({
                    value: method,
                    label: method
                  }))}
                  placeholder="Select payment method"
                />

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingIncome ? "Update Income" : "Add Income"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingIncome(null);
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
        className="fixed bottom-20 right-4 w-14 h-14 bg-success text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center lg:hidden active:scale-95"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Income;