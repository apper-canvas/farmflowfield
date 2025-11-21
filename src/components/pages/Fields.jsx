import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cropService from "@/services/api/cropService";
import fieldService from "@/services/api/fieldService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FieldCard from "@/components/molecules/FieldCard";
import FieldForm from "@/components/forms/FieldForm";

const Fields = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    filterFields();
  }, [fields, crops, searchQuery]);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [fieldsData, cropsData] = await Promise.all([
        fieldService.getAll(),
        cropService.getAll()
      ]);
      
      setFields(fieldsData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message || "Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  const filterFields = () => {
let filtered = fields.map(field => {
      const fieldCrop = crops.find(crop => (crop.field_id_c?.Id || crop.field_id_c) === field.Id);
      return {
        ...field,
        cropName: fieldCrop?.Name,
        currentStage: fieldCrop?.current_stage_c
      };
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(field =>
(field.Name || '').toLowerCase().includes(query) ||
        (field.soil_type_c || '').toLowerCase().includes(query) ||
        (field.cropName || '').toLowerCase().includes(query)
      );
    }

    setFilteredFields(filtered);
  };

const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateField = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = async (newField) => {
    // Refresh the fields list after successful creation
    await loadFields();
    setShowCreateForm(false);
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadFields} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fields</h1>
          <p className="text-gray-600">Manage your farm fields and crops</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
            variant="outline"
            size="sm"
          >
            <ApperIcon 
              name={viewMode === "grid" ? "Map" : "Grid3x3"} 
              className="w-4 h-4 mr-2" 
            />
            {viewMode === "grid" ? "Map View" : "Grid View"}
          </Button>
          
<Button onClick={handleCreateField}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorView 
            title="Failed to load fields"
            description={error}
            actionLabel="Try Again"
            onAction={loadFields}
          />
        ) : (
          <>
            {/* Search Bar */}
<div className="px-4 sm:px-6 mb-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search fields..."
              />
            </div>

            {/* Fields List */}
            <div className="px-4 sm:px-6 pb-4 h-full overflow-y-auto">
              {filteredFields.length === 0 ? (
                searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
                    <p className="text-gray-500 text-center">
                      No fields match your search term "{searchQuery}".
                      <br />
                      Try adjusting your search or create a new field.
                    </p>
                    <Button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <Empty 
                    icon="LandPlot"
                    title="No fields yet"
                    description="Get started by adding your first field to track crops and activities."
                    actionLabel="Add First Field"
                    onAction={handleCreateField}
                  />
                )
              ) : (
                <div className="space-y-4">
                  {filteredFields.map((field) => (
                    <FieldCard 
                      key={field.Id} 
                      field={field}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Field Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <FieldForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop FAB */}
      <button
        onClick={handleCreateField}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hidden lg:flex active:scale-95"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>

      {/* Mobile FAB */}
      <button
        onClick={handleCreateField}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center lg:hidden active:scale-95"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>
</div>
  );
};

export default Fields;