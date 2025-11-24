import { getApperClient } from '@/services/apperClient';

class IncomeService {
  constructor() {
    this.tableName = 'income_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income records:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching income record ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ],
        where: [
          {
            "FieldName": "date_c",
            "Operator": "GreaterThanOrEqualTo", 
            "Values": [startDate],
            "Include": true
          },
          {
            "FieldName": "date_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [endDate],
            "Include": true
          }
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income by date range:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "receipt_c"}}
        ],
        where: [
          {
            "FieldName": "category_c",
            "Operator": "EqualTo",
            "Values": [category],
            "Include": true
          }
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income by category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(incomeData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          title_c: incomeData.title_c,
          category_c: incomeData.category_c,
          amount_c: incomeData.amount_c,
          date_c: incomeData.date_c,
          description_c: incomeData.description_c,
          payment_method_c: incomeData.payment_method_c,
          field_id_c: incomeData.field_id_c
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} income records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating income record:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, incomeData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          title_c: incomeData.title_c,
          category_c: incomeData.category_c,
          amount_c: incomeData.amount_c,
          date_c: incomeData.date_c,
          description_c: incomeData.description_c,
          payment_method_c: incomeData.payment_method_c,
          field_id_c: incomeData.field_id_c
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} income records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating income record:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} income records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length === 1;
      }

      return false;
    } catch (error) {
      console.error("Error deleting income record:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTotalByMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const incomeData = await this.getByDateRange(startDate, endDate);
      return incomeData.reduce((total, income) => total + (income.amount_c || 0), 0);
    } catch (error) {
      console.error("Error calculating monthly total:", error);
      throw error;
    }
  }
}

export default new IncomeService();