import inventoryData from "@/services/mockData/inventory.json";

class InventoryService {
  constructor() {
    this.items = [...inventoryData];
  }

  async getAll() {
    await this.delay();
    return [...this.items];
  }

  async getById(id) {
    await this.delay();
    const item = this.items.find(i => i.Id === parseInt(id));
    if (!item) {
      throw new Error("Inventory item not found");
    }
    return { ...item };
  }

  async create(itemData) {
    await this.delay();
    const newItem = {
      Id: Math.max(...this.items.map(i => i.Id)) + 1,
      ...itemData,
      lastRestocked: new Date().toISOString()
    };
    this.items.push(newItem);
    return { ...newItem };
  }

  async update(id, itemData) {
    await this.delay();
    const index = this.items.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Inventory item not found");
    }
    
    this.items[index] = {
      ...this.items[index],
      ...itemData,
      Id: parseInt(id)
    };
    
    return { ...this.items[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.items.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Inventory item not found");
    }
    
    this.items.splice(index, 1);
    return true;
  }

  async updateQuantity(id, quantity) {
    await this.delay();
    const index = this.items.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Inventory item not found");
    }
    
    this.items[index] = {
      ...this.items[index],
      quantity: quantity,
      lastRestocked: new Date().toISOString()
    };
    
    return { ...this.items[index] };
  }

  async getLowStockItems() {
    await this.delay();
    return this.items.filter(item => item.quantity <= item.reorderLevel);
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new InventoryService();