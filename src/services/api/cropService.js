import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await this.delay();
    return [...this.crops];
  }

  async getById(id) {
    await this.delay();
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  }

  async getByFieldId(fieldId) {
    await this.delay();
    return this.crops.filter(c => c.fieldId === fieldId.toString());
  }

  async create(cropData) {
    await this.delay();
    const newCrop = {
      Id: Math.max(...this.crops.map(c => c.Id)) + 1,
      ...cropData,
      createdAt: new Date().toISOString()
    };
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id)
    };
    
    return { ...this.crops[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops.splice(index, 1);
    return true;
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CropService();