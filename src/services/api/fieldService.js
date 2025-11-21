import fieldsData from "@/services/mockData/fields.json";

class FieldService {
  constructor() {
    this.fields = [...fieldsData];
  }

  async getAll() {
    await this.delay();
    return [...this.fields];
  }

  async getById(id) {
    await this.delay();
    const field = this.fields.find(f => f.Id === parseInt(id));
    if (!field) {
      throw new Error("Field not found");
    }
    return { ...field };
  }

  async create(fieldData) {
    await this.delay();
    const newField = {
      Id: Math.max(...this.fields.map(f => f.Id)) + 1,
      ...fieldData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    this.fields.push(newField);
    return { ...newField };
  }

  async update(id, fieldData) {
    await this.delay();
    const index = this.fields.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Field not found");
    }
    
    this.fields[index] = {
      ...this.fields[index],
      ...fieldData,
      Id: parseInt(id),
      lastModified: new Date().toISOString()
    };
    
    return { ...this.fields[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.fields.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Field not found");
    }
    
    this.fields.splice(index, 1);
    return true;
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new FieldService();