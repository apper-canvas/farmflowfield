import { getApperClient } from "@/services/apperClient";

class FieldService {
  constructor() {
    this.tableName = 'fields_c';
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
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "current_stage_c"}},
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
      console.error("Error fetching fields:", error?.response?.data?.message || error);
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
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "current_stage_c"}},
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
      console.error(`Error fetching field ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(fieldData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Name: fieldData.Name || fieldData.name,
        area_c: fieldData.area_c || fieldData.area,
        unit_c: fieldData.unit_c || fieldData.unit,
        soil_type_c: fieldData.soil_type_c || fieldData.soilType,
        coordinates_c: fieldData.coordinates_c || fieldData.coordinates,
        current_stage_c: fieldData.current_stage_c || fieldData.currentStage
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
          console.error(`Failed to create ${failed.length} fields:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating field:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, fieldData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: fieldData.Name || fieldData.name,
        area_c: fieldData.area_c || fieldData.area,
        unit_c: fieldData.unit_c || fieldData.unit,
        soil_type_c: fieldData.soil_type_c || fieldData.soilType,
        coordinates_c: fieldData.coordinates_c || fieldData.coordinates,
        current_stage_c: fieldData.current_stage_c || fieldData.currentStage
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
          console.error(`Failed to update ${failed.length} fields:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating field:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} fields:`, failed);
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting field:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new FieldService();