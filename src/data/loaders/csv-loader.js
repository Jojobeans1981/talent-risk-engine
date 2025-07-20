import { createReadStream } from 'fs';
import csv from 'csv-parser';

export class CSVLoader {
  constructor() {
    this.supportedFormats = ['.csv'];
  }

  async load(filePath) {
    return new Promise((resolve, reject) => {
      const employees = [];
      const errors = [];
      
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Basic normalization inline instead of external function
            const normalizedEmployee = this.normalizeEmployee(row);
            employees.push(normalizedEmployee);
          } catch (error) {
            errors.push({ row, error: error.message });
          }
        })
        .on('end', () => resolve({
          data: employees,
          errors,
          meta: {
            format: 'csv',
            filePath,
            timestamp: new Date().toISOString()
          }
        }))
        .on('error', reject);
    });
  }

  async save(filePath, data) {
    // TODO: Implement CSV saving functionality
    throw new Error('CSV saving not yet implemented');
  }

  // Built-in normalization method
  normalizeEmployee(row) {
    return {
      id: row.id || row.employeeId || row.emp_id,
      name: row.name || row.fullName || row.employee_name,
      email: row.email || row.emailAddress || row.work_email,
      department: row.department || row.dept || row.division,
      role: row.role || row.position || row.job_title,
      startDate: row.startDate || row.hireDate || row.start_date,
      salary: parseFloat(row.salary || row.compensation || row.annual_salary || 0),
      performanceRating: parseFloat(row.performanceRating || row.performance || row.rating || 3.0),
      engagementScore: parseFloat(row.engagementScore || row.engagement || row.satisfaction || 3.0),
      managerRating: parseFloat(row.managerRating || row.manager_rating || row.supervisor_rating || 3.5),
      skills: row.skills || row.skill_set || row.competencies || '',
      lastPromotionDate: row.lastPromotionDate || row.promotion_date || row.last_promotion,
      _original: row
    };
  }
}

export default CSVLoader;