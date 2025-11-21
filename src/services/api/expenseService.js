import expensesData from "@/services/mockData/expenses.json";

class ExpenseService {
  constructor() {
    this.expenses = [...expensesData];
  }

  async getAll() {
    await this.delay();
    return [...this.expenses];
  }

  async getById(id) {
    await this.delay();
    const expense = this.expenses.find(e => e.Id === parseInt(id));
    if (!expense) {
      throw new Error("Expense not found");
    }
    return { ...expense };
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }

  async getByCategory(category) {
    await this.delay();
    return this.expenses.filter(expense => expense.category === category);
  }

  async create(expenseData) {
    await this.delay();
    const newExpense = {
      Id: Math.max(...this.expenses.map(e => e.Id)) + 1,
      ...expenseData,
      date: expenseData.date || new Date().toISOString()
    };
    this.expenses.push(newExpense);
    return { ...newExpense };
  }

  async update(id, expenseData) {
    await this.delay();
    const index = this.expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    
    this.expenses[index] = {
      ...this.expenses[index],
      ...expenseData,
      Id: parseInt(id)
    };
    
    return { ...this.expenses[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    
    this.expenses.splice(index, 1);
    return true;
  }

  async getTotalByMonth(year, month) {
    await this.delay();
    const monthExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
    });
    
    return monthExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ExpenseService();