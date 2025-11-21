import { getApperClient } from "@/services/apperClient";

class InventoryService {
  constructor() {
    this.tableName = 'inventory_c';
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "cost_per_unit_c"}},
          {"field": {"Name": "reorder_level_c"}},
          {"field": {"Name": "supplier_c"}},
          {"field": {"Name": "last_restocked_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory:", error?.response?.data?.message || error);
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "cost_per_unit_c"}},
          {"field": {"Name": "reorder_level_c"}},
          {"field": {"Name": "supplier_c"}},
          {"field": {"Name": "last_restocked_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(itemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Name: itemData.Name || itemData.name,
        category_c: itemData.category_c || itemData.category,
        quantity_c: itemData.quantity_c || itemData.quantity,
        unit_c: itemData.unit_c || itemData.unit,
        cost_per_unit_c: itemData.cost_per_unit_c || itemData.costPerUnit,
        reorder_level_c: itemData.reorder_level_c || itemData.reorderLevel,
        supplier_c: itemData.supplier_c || itemData.supplier,
        last_restocked_c: itemData.last_restocked_c || new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} inventory items:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating inventory item:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, itemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: itemData.Name || itemData.name,
        category_c: itemData.category_c || itemData.category,
        quantity_c: itemData.quantity_c || itemData.quantity,
        unit_c: itemData.unit_c || itemData.unit,
        cost_per_unit_c: itemData.cost_per_unit_c || itemData.costPerUnit,
        reorder_level_c: itemData.reorder_level_c || itemData.reorderLevel,
        supplier_c: itemData.supplier_c || itemData.supplier,
        last_restocked_c: itemData.last_restocked_c || itemData.lastRestocked
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
          console.error(`Failed to update ${failed.length} inventory items:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating inventory item:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} inventory items:`, failed);
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting inventory item:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateQuantity(id, quantity) {
    try {
      const sanitizedData = {
        quantity_c: quantity,
        last_restocked_c: new Date().toISOString()
      };

      return await this.update(id, sanitizedData);
    } catch (error) {
      console.error("Error updating quantity:", error);
      return null;
    }
  }

  async getLowStockItems() {
    try {
      const items = await this.getAll();
      return items.filter(item => 
        (item.quantity_c || 0) <= (item.reorder_level_c || 0)
      );
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      return [];
    }
  }
}

export default new InventoryService();
export default new InventoryService();