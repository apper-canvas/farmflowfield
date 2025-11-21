import { getApperClient } from "@/services/apperClient";

class TaskService {
  constructor() {
    this.tableName = 'tasks_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByFieldId(fieldId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        where: [{
          "FieldName": "field_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(fieldId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for field ${fieldId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Name: taskData.Name || taskData.name || taskData.title_c || taskData.title,
        title_c: taskData.title_c || taskData.title,
        description_c: taskData.description_c || taskData.description,
        status_c: taskData.status_c || taskData.status || "pending",
        priority_c: taskData.priority_c || taskData.priority,
        due_date_c: taskData.due_date_c || taskData.dueDate,
        assigned_to_c: taskData.assigned_to_c || taskData.assignedTo,
        category_c: taskData.category_c || taskData.category,
        field_id_c: taskData.field_id_c ? parseInt(taskData.field_id_c) : (taskData.fieldId ? parseInt(taskData.fieldId) : undefined),
        crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : (taskData.cropId ? parseInt(taskData.cropId) : undefined)
      };

      // Remove undefined/null values
      Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] === undefined || sanitizedData[key] === null) {
          delete sanitizedData[key];
        }
      });

      const params = {
        records: [sanitizedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: taskData.Name || taskData.name || taskData.title_c || taskData.title,
        title_c: taskData.title_c || taskData.title,
        description_c: taskData.description_c || taskData.description,
        status_c: taskData.status_c || taskData.status,
        priority_c: taskData.priority_c || taskData.priority,
        due_date_c: taskData.due_date_c || taskData.dueDate,
        completed_date_c: taskData.completed_date_c || taskData.completedDate,
        assigned_to_c: taskData.assigned_to_c || taskData.assignedTo,
        category_c: taskData.category_c || taskData.category,
        field_id_c: taskData.field_id_c ? parseInt(taskData.field_id_c) : (taskData.fieldId ? parseInt(taskData.fieldId) : undefined),
        crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : (taskData.cropId ? parseInt(taskData.cropId) : undefined)
      };

      // Remove undefined/null values except Id
      Object.keys(sanitizedData).forEach(key => {
        if (key !== 'Id' && (sanitizedData[key] === undefined || sanitizedData[key] === null)) {
          delete sanitizedData[key];
        }
      });

      const params = {
        records: [sanitizedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }

  async markCompleted(id) {
    try {
      const sanitizedData = {
        status_c: "completed",
        completed_date_c: new Date().toISOString()
      };

      return await this.update(id, sanitizedData);
    } catch (error) {
      console.error("Error marking task completed:", error);
      return null;
    }
}
}

export default new TaskService();