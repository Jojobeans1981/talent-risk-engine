/**
 * Generic Data Loader
 * Handles loading and saving various data formats
 */

import { readFileSync, writeFileSync } from 'fs';
import { CSVLoader } from './csv-loader.js';

export class DataLoader {
  constructor() {
    this.csvLoader = new CSVLoader();
  }

  async loadJSON(filePath) {
    try {
      const content = readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load JSON file ${filePath}: ${error.message}`);
    }
  }

  async saveJSON(filePath, data) {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      writeFileSync(filePath, jsonContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save JSON file ${filePath}: ${error.message}`);
    }
  }

  async loadCSV(filePath) {
    return this.csvLoader.load(filePath);
  }

  async saveCSV(filePath, data) {
    return this.csvLoader.save(filePath, data);
  }

  async load(filePath, format = 'auto') {
    if (format === 'auto') {
      format = this.detectFormat(filePath);
    }

    switch (format.toLowerCase()) {
      case 'json':
        return this.loadJSON(filePath);
      case 'csv':
        return this.loadCSV(filePath);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  async save(filePath, data, format = 'auto') {
    if (format === 'auto') {
      format = this.detectFormat(filePath);
    }

    switch (format.toLowerCase()) {
      case 'json':
        return this.saveJSON(filePath, data);
      case 'csv':
        return this.saveCSV(filePath, data);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  detectFormat(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'json':
        return 'json';
      case 'csv':
        return 'csv';
      default:
        return 'json';
    }
  }

  normalizeEmployeeData(employees) {
    if (!Array.isArray(employees)) {
      return [];
    }

    return employees.map(emp => ({
      id: emp.id || emp.employeeId || emp.emp_id,
      name: emp.name || emp.fullName || emp.employee_name,
      email: emp.email || emp.emailAddress || emp.work_email,
      department: emp.department || emp.dept || emp.division,
      role: emp.role || emp.position || emp.job_title,
      startDate: emp.startDate || emp.hireDate || emp.start_date,
      salary: parseFloat(emp.salary || emp.compensation || emp.annual_salary || 0),
      performanceRating: parseFloat(emp.performanceRating || emp.performance || emp.rating || 3.0),
      engagementScore: parseFloat(emp.engagementScore || emp.engagement || emp.satisfaction || 3.0),
      managerRating: parseFloat(emp.managerRating || emp.manager_rating || emp.supervisor_rating || 3.5),
      skills: emp.skills || emp.skill_set || emp.competencies || '',
      lastPromotionDate: emp.lastPromotionDate || emp.promotion_date || emp.last_promotion,
      _original: emp
    }));
  }
}

export default DataLoader;