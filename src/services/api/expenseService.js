import { getApperClient } from "@/services/apperClient";

class ExpenseService {
  constructor() {
    this.tableName = 'expenses_c';
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "Between",
          "Values": [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses by category:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Name: expenseData.Name || expenseData.name || expenseData.description_c || expenseData.description,
        category_c: expenseData.category_c || expenseData.category,
        amount_c: expenseData.amount_c || expenseData.amount,
        date_c: expenseData.date_c || expenseData.date || new Date().toISOString().split('T')[0],
        description_c: expenseData.description_c || expenseData.description,
        payment_method_c: expenseData.payment_method_c || expenseData.paymentMethod,
        field_id_c: expenseData.field_id_c ? parseInt(expenseData.field_id_c) : (expenseData.fieldId ? parseInt(expenseData.fieldId) : undefined),
        receipt_c: expenseData.receipt_c || expenseData.receipt
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
          console.error(`Failed to create ${failed.length} expenses:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating expense:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: expenseData.Name || expenseData.name || expenseData.description_c || expenseData.description,
        category_c: expenseData.category_c || expenseData.category,
        amount_c: expenseData.amount_c || expenseData.amount,
        date_c: expenseData.date_c || expenseData.date,
        description_c: expenseData.description_c || expenseData.description,
        payment_method_c: expenseData.payment_method_c || expenseData.paymentMethod,
        field_id_c: expenseData.field_id_c ? parseInt(expenseData.field_id_c) : (expenseData.fieldId ? parseInt(expenseData.fieldId) : undefined),
        receipt_c: expenseData.receipt_c || expenseData.receipt
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
          console.error(`Failed to update ${failed.length} expenses:`, failed);
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating expense:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} expenses:`, failed);
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getTotalByMonth(year, month) {
    try {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const expenses = await this.getByDateRange(startDate, endDate);
      return expenses.reduce((total, expense) => total + (expense.amount_c || 0), 0);
    } catch (error) {
      console.error("Error getting total by month:", error);
      return 0;
    }
  }
}

export default new ExpenseService();