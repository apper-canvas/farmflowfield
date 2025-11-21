import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByFieldId(fieldId) {
    await this.delay();
    return this.tasks.filter(t => t.fieldId === fieldId.toString());
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id)) + 1,
      ...taskData,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id)
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  async markCompleted(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      status: "completed",
      completedDate: new Date().toISOString()
    };
    
    return { ...this.tasks[index] };
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TaskService();