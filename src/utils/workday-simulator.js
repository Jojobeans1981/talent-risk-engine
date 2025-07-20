// src/utils/workday-simulator.js
class WorkdaySimulator {
  constructor() {
    this.employees = new Map();
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        resolve();
      }, 50); // Reduced timeout for tests
    });
  }

  async addEmployee(employee) {
    if (!this.isConnected) throw new Error('Not connected');
    if (!employee?.name) throw new Error('Name required');
    
    const id = `mock-${Date.now()}`;
    const newEmployee = { ...employee, id };
    this.employees.set(id, newEmployee);
    return newEmployee;
  }

  async getEmployee(id) {
    if (!this.isConnected) throw new Error('Not connected');
    const employee = this.employees.get(id);
    if (!employee) throw new Error('Employee not found');
    return employee;
  }
}

export default WorkdaySimulator;