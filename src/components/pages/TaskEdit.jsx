import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import fieldService from '@/services/api/fieldService';
import cropService from '@/services/api/cropService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';

export default function TaskEdit() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    field_id_c: '',
    crop_id_c: '',
    category_c: '',
    priority_c: '',
    status_c: '',
    start_date_c: '',
    end_date_c: '',
    estimated_hours_c: ''
  });

  useEffect(() => {
    loadData();
  }, [taskId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load task, fields, and crops in parallel
      const [taskData, fieldsData, cropsData] = await Promise.all([
        taskService.getById(parseInt(taskId)),
        fieldService.getAll(),
        cropService.getAll()
      ]);
      
      if (!taskData) {
        setError('Task not found');
        return;
      }
      
      setTask(taskData);
      setFields(fieldsData || []);
      setCrops(cropsData || []);
      
      // Initialize form data with task values
      setFormData({
        name_c: taskData.name_c || '',
        description_c: taskData.description_c || '',
        field_id_c: taskData.field_id_c?.Id || taskData.field_id_c || '',
        crop_id_c: taskData.crop_id_c?.Id || taskData.crop_id_c || '',
        category_c: taskData.category_c || '',
        priority_c: taskData.priority_c || '',
        status_c: taskData.status_c || '',
        start_date_c: taskData.start_date_c ? taskData.start_date_c.split('T')[0] : '',
        end_date_c: taskData.end_date_c ? taskData.end_date_c.split('T')[0] : '',
        estimated_hours_c: taskData.estimated_hours_c || ''
      });
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c.trim()) {
      toast.error('Task name is required');
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare data for submission
      const updateData = { ...formData };
      
      // Convert field and crop IDs to integers
      if (updateData.field_id_c) {
        updateData.field_id_c = parseInt(updateData.field_id_c);
      }
      if (updateData.crop_id_c) {
        updateData.crop_id_c = parseInt(updateData.crop_id_c);
      }
      
      // Convert estimated hours to number
      if (updateData.estimated_hours_c) {
        updateData.estimated_hours_c = parseFloat(updateData.estimated_hours_c);
      }
      
      // Remove empty values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });
      
      const updatedTask = await taskService.update(parseInt(taskId), updateData);
      
      if (updatedTask) {
        toast.success('Task updated successfully');
        navigate(`/tasks/${taskId}`);
      }
      
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} />;
  if (!task) return <ErrorView message="Task not found" />;

  const categoryOptions = [
    { value: 'Planting', label: 'Planting' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Harvesting', label: 'Harvesting' },
    { value: 'Irrigation', label: 'Irrigation' },
    { value: 'Fertilizing', label: 'Fertilizing' },
    { value: 'Pest Control', label: 'Pest Control' },
    { value: 'Other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/tasks/${taskId}`)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Task Name *
            </label>
            <Input
              id="name"
              value={formData.name_c}
              onChange={(e) => handleInputChange('name_c', e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description_c}
              onChange={(e) => handleInputChange('description_c', e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className="form-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2">
                Field
              </label>
              <Select
                id="field"
                value={formData.field_id_c}
                onChange={(value) => handleInputChange('field_id_c', value)}
                options={[
                  { value: '', label: 'Select a field' },
                  ...fields.map(field => ({ 
                    value: field.Id.toString(), 
                    label: field.name_c || field.Name || `Field ${field.Id}` 
                  }))
                ]}
              />
            </div>

            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">
                Crop
              </label>
              <Select
                id="crop"
                value={formData.crop_id_c}
                onChange={(value) => handleInputChange('crop_id_c', value)}
                options={[
                  { value: '', label: 'Select a crop' },
                  ...crops.map(crop => ({ 
                    value: crop.Id.toString(), 
                    label: crop.name_c || crop.Name || `Crop ${crop.Id}` 
                  }))
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                id="category"
                value={formData.category_c}
                onChange={(value) => handleInputChange('category_c', value)}
                options={categoryOptions}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select
                id="priority"
                value={formData.priority_c}
                onChange={(value) => handleInputChange('priority_c', value)}
                options={priorityOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                id="status"
                value={formData.status_c}
                onChange={(value) => handleInputChange('status_c', value)}
                options={statusOptions}
              />
            </div>

            <div>
              <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <Input
                id="estimated_hours"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_hours_c}
                onChange={(e) => handleInputChange('estimated_hours_c', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date_c}
                onChange={(e) => handleInputChange('start_date_c', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date_c}
                onChange={(e) => handleInputChange('end_date_c', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  Save Changes
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}