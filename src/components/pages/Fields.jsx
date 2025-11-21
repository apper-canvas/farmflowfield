import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FieldCard from "@/components/molecules/FieldCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import fieldService from "@/services/api/fieldService";
import cropService from "@/services/api/cropService";

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

  const handleCreateField = () => {
    // In a real app, this would open a create field modal/form
    navigate("/fields");
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search fields by name, soil type, or crop..."
          />
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
            <div className="text-center">
              <ApperIcon name="Map" className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Interactive Field Map
              </h3>
              <p className="text-gray-600 mb-4">
                GPS-based field mapping coming soon
              </p>
              <Button onClick={() => setViewMode("grid")} variant="outline">
                Switch to Grid View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fields Grid */}
      {viewMode === "grid" && (
        <>
          {filteredFields.length === 0 ? (
            <Empty
              icon="Square"
              title="No fields found"
              message={searchQuery ? 
                "No fields match your search criteria. Try adjusting your search terms." :
                "Start by adding your first field to begin managing your crops and tracking field activities."
              }
              actionLabel="Add First Field"
              onAction={handleCreateField}
              showAction={!searchQuery}
            />
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {filteredFields.length}
                  </div>
                  <p className="text-sm text-gray-600">Total Fields</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
<div className="text-2xl font-bold text-secondary mb-1">
                    {filteredFields.reduce((total, field) => total + (field.area_c || 0), 0).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Total Acres</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1">
                    {filteredFields.filter(field => field.cropName).length}
                  </div>
                  <p className="text-sm text-gray-600">Active Crops</p>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map((field) => (
                  <FieldCard key={field.Id} field={field} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Floating Action Button for Mobile */}
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