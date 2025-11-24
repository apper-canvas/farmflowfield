import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import fieldService from '@/services/api/fieldService';

const TaskCreateForm = ({ onTaskCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    priority_c: 'medium',
    status_c: 'pending',
    duedate_c: '',
    fieldid_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setFieldsLoading(true);
    try {
      const fieldsData = await fieldService.getAll();
      setFields(fieldsData || []);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Failed to load fields');
    } finally {
      setFieldsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c.trim()) {
      toast.error('Task name is required');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        fieldid_c: formData.fieldid_c ? parseInt(formData.fieldid_c) : null,
        duedate_c: formData.duedate_c || null
      };

      const newTask = await taskService.create(taskData);
      if (newTask) {
        onTaskCreated(newTask);
        toast.success('Task created successfully');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name_c" className="block text-sm font-medium text-gray-700 mb-1">
                Task Name *
              </label>
              <Input
                id="name_c"
                name="name_c"
                type="text"
                value={formData.name_c}
                onChange={handleInputChange}
                placeholder="Enter task name"
                required
              />
            </div>

            <div>
              <label htmlFor="description_c" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description_c"
                name="description_c"
                value={formData.description_c}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows={3}
                className="form-field resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  id="priority_c"
                  name="priority_c"
                  value={formData.priority_c}
                  onChange={handleInputChange}
                  options={priorityOptions}
                />
              </div>

              <div>
                <label htmlFor="status_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  id="status_c"
                  name="status_c"
                  value={formData.status_c}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
              </div>
            </div>

            <div>
              <label htmlFor="duedate_c" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input
                id="duedate_c"
                name="duedate_c"
                type="date"
                value={formData.duedate_c}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="fieldid_c" className="block text-sm font-medium text-gray-700 mb-1">
                Field
              </label>
              <Select
                id="fieldid_c"
                name="fieldid_c"
                value={formData.fieldid_c}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'Select a field (optional)' },
                  ...fields.map(field => ({
                    value: field.Id.toString(),
                    label: field.name_c || field.Name || `Field ${field.Id}`
                  }))
                ]}
                disabled={fieldsLoading}
              />
              {fieldsLoading && (
                <p className="text-sm text-gray-500 mt-1">Loading fields...</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskCreateForm;