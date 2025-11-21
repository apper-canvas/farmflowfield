import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import InventoryCard from "@/components/molecules/InventoryCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import inventoryService from "@/services/api/inventoryService";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, categoryFilter, stockFilter]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== "all") {
      if (stockFilter === "low") {
        filtered = filtered.filter(item => item.quantity <= item.reorderLevel);
      } else if (stockFilter === "good") {
        filtered = filtered.filter(item => item.quantity > item.reorderLevel);
      }
    }

    // Sort by stock level (low stock first)
    filtered.sort((a, b) => {
      const aRatio = a.quantity / a.reorderLevel;
      const bRatio = b.quantity / b.reorderLevel;
      return aRatio - bRatio;
    });

    setFilteredItems(filtered);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    
    if (!editingItem) return;

    try {
      const formData = new FormData(e.target);
      const newQuantity = parseInt(formData.get("quantity"));

      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error("Please enter a valid quantity");
        return;
      }

      await inventoryService.updateQuantity(editingItem.Id, newQuantity);
      
      // Update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.Id === editingItem.Id
            ? { ...item, quantity: newQuantity, lastRestocked: new Date().toISOString() }
            : item
        )
      );

      setShowEditModal(false);
      setEditingItem(null);
      toast.success("Inventory updated successfully!");
    } catch (err) {
      toast.error("Failed to update inventory");
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadInventory} />;

  const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel);
  const totalValue = items.reduce((total, item) => total + (item.quantity * item.costPerUnit), 0);

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage your farm supplies and equipment</p>
        </div>
        
        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search inventory by name, category, or supplier..."
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
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="good">Good Stock</option>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStockFilter("all");
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {filteredItems.length}
          </div>
          <p className="text-sm text-gray-600">Total Items</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {lowStockItems.length}
          </div>
          <p className="text-sm text-gray-600">Low Stock Items</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            ${totalValue.toFixed(0)}
          </div>
          <p className="text-sm text-gray-600">Total Value</p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 border-l-4 border-l-error">
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Low Stock Alert</h3>
              <p className="text-sm text-gray-600 mb-2">
                {lowStockItems.length} items are below reorder level and need restocking.
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.slice(0, 3).map(item => (
                  <span key={item.Id} className="text-xs bg-error/10 text-error px-2 py-1 rounded">
                    {item.name}
                  </span>
                ))}
                {lowStockItems.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{lowStockItems.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <Empty
          icon="Package"
          title="No inventory items found"
          message={searchQuery || categoryFilter !== "all" || stockFilter !== "all" ? 
            "No items match your search criteria. Try adjusting your filters." :
            "Start by adding your first inventory item to keep track of seeds, fertilizers, tools, and equipment."
          }
          actionLabel="Add First Item"
          onAction={() => {}}
          showAction={!searchQuery && categoryFilter === "all" && stockFilter === "all"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <InventoryCard 
              key={item.Id} 
              item={item} 
              onEdit={handleEditItem}
            />
          ))}
        </div>
      )}

      {/* Edit Quantity Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <form onSubmit={handleUpdateQuantity} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Quantity
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{editingItem.name}</h4>
                  <p className="text-sm text-gray-600">
                    Current: {editingItem.quantity} {editingItem.unit}
                  </p>
                  <p className="text-sm text-gray-500">
                    Reorder level: {editingItem.reorderLevel} {editingItem.unit}
                  </p>
                </div>

                <Input
                  name="quantity"
                  label="New Quantity"
                  type="number"
                  defaultValue={editingItem.quantity}
                  min="0"
                  required
                  placeholder={`Enter quantity in ${editingItem.unit}`}
                />

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    Update Quantity
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowEditModal(false)}
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
    </div>
  );
};

export default Inventory;