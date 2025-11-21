import { getApperClient } from "@/services/apperClient";

class CropService {
  constructor() {
    this.tableName = 'crops_c';
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "current_stage_c"}},
          {"field": {"Name": "stages_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "current_stage_c"}},
          {"field": {"Name": "stages_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "current_stage_c"}},
          {"field": {"Name": "stages_c"}},
          {"field": {"Name": "field_id_c"}}
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
      console.error(`Error fetching crops for field ${fieldId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Name: cropData.Name || cropData.name,
        variety_c: cropData.variety_c || cropData.variety,
        planting_date_c: cropData.planting_date_c || cropData.plantingDate,
        expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
        status_c: cropData.status_c || cropData.status,
        current_stage_c: cropData.current_stage_c || cropData.currentStage,
        stages_c: cropData.stages_c || (cropData.stages ? JSON.stringify(cropData.stages) : undefined),
        field_id_c: cropData.field_id_c ? parseInt(cropData.field_id_c) : (cropData.fieldId ? parseInt(cropData.fieldId) : undefined)
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
          console.error(`Failed to create ${failed.length} crops:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: cropData.Name || cropData.name,
        variety_c: cropData.variety_c || cropData.variety,
        planting_date_c: cropData.planting_date_c || cropData.plantingDate,
        expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
        status_c: cropData.status_c || cropData.status,
        current_stage_c: cropData.current_stage_c || cropData.currentStage,
        stages_c: cropData.stages_c || (cropData.stages ? JSON.stringify(cropData.stages) : undefined),
        field_id_c: cropData.field_id_c ? parseInt(cropData.field_id_c) : (cropData.fieldId ? parseInt(cropData.fieldId) : undefined)
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
          console.error(`Failed to update ${failed.length} crops:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} crops:`, failed);
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new CropService();