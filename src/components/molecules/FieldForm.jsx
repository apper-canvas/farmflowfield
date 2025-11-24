import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import fieldService from '@/services/api/fieldService';

const FieldForm = ({ field = null, onSubmit, onCancel, isLoading: externalLoading = false }) => {
const [formData, setFormData] = useState({
    Name: '',
    area_c: '',
    unit_c: '',
    soil_type_c: '',
    coordinates_c: '',
    current_stage_c: '',
    CreatedOn: '',
    CreatedBy: null,
    ModifiedOn: '',
    ModifiedBy: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form if editing existing field
  useEffect(() => {
if (field) {
      setFormData({
        Name: field.Name || '',
        area_c: field.area_c || '',
        unit_c: field.unit_c || '',
        soil_type_c: field.soil_type_c || '',
        coordinates_c: field.coordinates_c || '',
        current_stage_c: field.current_stage_c || '',
        CreatedOn: field.CreatedOn || '',
        CreatedBy: field.CreatedBy || null,
        ModifiedOn: field.ModifiedOn || '',
        ModifiedBy: field.ModifiedBy || null
      });
    }
  }, [field]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Field name is required';
    }

    if (formData.area_c && isNaN(parseFloat(formData.area_c))) {
      newErrors.area_c = 'Area must be a valid number';
    }

    if (formData.coordinates_c && (isNaN(parseFloat(formData.coordinates_c)) || parseFloat(formData.coordinates_c) > 5)) {
      newErrors.coordinates_c = 'Coordinates must be a number between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data with proper type conversion
      const preparedData = { ...formData };
      
      // Convert numeric fields to proper types and filter out empty values
      if (preparedData.area_c && preparedData.area_c.trim() !== '') {
        preparedData.area_c = parseFloat(preparedData.area_c);
      } else {
        delete preparedData.area_c; // Remove empty values
      }
      
      if (preparedData.coordinates_c && preparedData.coordinates_c.trim() !== '') {
        preparedData.coordinates_c = parseFloat(preparedData.coordinates_c);
      } else {
        delete preparedData.coordinates_c; // Remove empty values
      }

      // Remove other empty string values
      Object.keys(preparedData).forEach(key => {
        if (preparedData[key] === '' || preparedData[key] === null || preparedData[key] === undefined) {
          delete preparedData[key];
        }
      });

      let result;
      if (field) {
        // Update existing field
        result = await fieldService.update(field.Id, preparedData);
        if (result) {
          toast.success('Field updated successfully!');
        } else {
          toast.error('Failed to update field');
          setLoading(false);
          return;
        }
      } else {
        // Create new field
        result = await fieldService.create(preparedData);
        if (result) {
          toast.success('Field created successfully!');
        } else {
          toast.error('Failed to create field');
          setLoading(false);
          return;
        }
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Error submitting field:', error);
      toast.error('An error occurred while saving the field');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || externalLoading;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {field ? 'Edit Field' : 'Create New Field'}
        </h2>
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="p-2"
            disabled={isSubmitDisabled}
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Field Name */}
        <div>
          <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-2">
            Field Name *
          </label>
          <Input
            id="Name"
            name="Name"
            type="text"
            value={formData.Name}
            onChange={handleInputChange}
            placeholder="Enter field name"
            disabled={isSubmitDisabled}
            className={errors.Name ? 'border-red-500' : ''}
          />
          {errors.Name && (
            <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label htmlFor="area_c" className="block text-sm font-medium text-gray-700 mb-2">
            Area
          </label>
          <Input
            id="area_c"
            name="area_c"
            type="number"
            step="0.01"
            value={formData.area_c}
            onChange={handleInputChange}
            placeholder="Enter area"
            disabled={isSubmitDisabled}
            className={errors.area_c ? 'border-red-500' : ''}
          />
          {errors.area_c && (
            <p className="mt-1 text-sm text-red-600">{errors.area_c}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit_c" className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <Select
            id="unit_c"
            name="unit_c"
            value={formData.unit_c}
            onChange={handleInputChange}
            disabled={isSubmitDisabled}
          >
            <option value="">Select unit</option>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
          </Select>
        </div>

        {/* Soil Type */}
<div>
          <label htmlFor="soil_type_c" className="block text-sm font-medium text-gray-700 mb-2">
            Soil Type
          </label>
          <Select
            id="soil_type_c"
            name="soil_type_c"
            value={formData.soil_type_c}
            onChange={handleInputChange}
            disabled={isSubmitDisabled}
          >
            <option value="">Select soil type</option>
            <option value="Clay">Clay</option>
            <option value="Sandy">Sandy</option>
            <option value="Loamy">Loamy</option>
            <option value="Silty">Silty</option>
            <option value="Peaty">Peaty</option>
            <option value="Chalky">Chalky</option>
            <option value="Rocky">Rocky</option>
            <option value="Alluvial">Alluvial</option>
            <option value="Black Cotton">Black Cotton</option>
            <option value="Red Laterite">Red Laterite</option>
          </Select>
        </div>

        {/* Coordinates */}
        <div>
          <label htmlFor="coordinates_c" className="block text-sm font-medium text-gray-700 mb-2">
            Coordinates (0-5)
          </label>
          <Input
            id="coordinates_c"
            name="coordinates_c"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.coordinates_c}
            onChange={handleInputChange}
            placeholder="Enter coordinates"
            disabled={isSubmitDisabled}
            className={errors.coordinates_c ? 'border-red-500' : ''}
          />
          {errors.coordinates_c && (
            <p className="mt-1 text-sm text-red-600">{errors.coordinates_c}</p>
          )}
        </div>

        {/* Current Stage */}
        <div>
          <label htmlFor="current_stage_c" className="block text-sm font-medium text-gray-700 mb-2">
            Current Stage
          </label>
          <Input
            id="current_stage_c"
            name="current_stage_c"
            type="text"
            value={formData.current_stage_c}
            onChange={handleInputChange}
            placeholder="Enter current stage"
            disabled={isSubmitDisabled}
          />
        </div>
{/* System Fields - Only show when editing existing field */}
        {field && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Created On
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {formData.CreatedOn ? format(new Date(formData.CreatedOn), 'MMM dd, yyyy h:mm a') : 'Not available'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Created By
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {formData.CreatedBy?.Name || 'Not available'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Modified On
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {formData.ModifiedOn ? format(new Date(formData.ModifiedOn), 'MMM dd, yyyy h:mm a') : 'Not available'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Modified By
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {formData.ModifiedBy?.Name || 'Not available'}
              </div>
            </div>
          </div>
        )}
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 sm:flex-none"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                {field ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                {field ? 'Update Field' : 'Create Field'}
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitDisabled}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default FieldForm;