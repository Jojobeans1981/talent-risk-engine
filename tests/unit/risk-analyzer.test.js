const RiskAnalyzer = require('../../src/analyzers/risk-analyzer');
const { createEmployee } = require('../utils/mockData');
 

describe('RiskAnalyzer', () => {
  let analyzer;
  let employee;

  beforeEach(() => {
    analyzer = new RiskAnalyzer();
    employee = { 
      id: 'EMP001',
      name: 'John Doe',
      startDate: '2022-01-01',
      salary: 80000,
      role: 'Software Engineer',
      performanceRating: 3.5,
      engagementScore: 3.8,
      managerRating: 4.0
    };
  });

  describe('analyzeEmployee', () => {
    test('should return complete risk analysis', () => {
      const result = analyzer.analyzeEmployee(employee);
      
      expect(result).toHaveProperty('employeeId', 'EMP001');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('level');
      expect(result).toHaveProperty('factors');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('lastUpdated');
    });

    test('should calculate tenure risk correctly', () => {
      const newEmployee = { ...employee, startDate: new Date().toISOString() };
      const result = analyzer.analyzeEmployee(newEmployee);
      
      expect(result.factors.tenure.risk).toBeGreaterThan(0.5);
    });

    test('should handle missing performance data', () => {
      const incompleteEmployee = {
        id: 'EMP002',
        startDate: '2021-01-01',
        salary: 75000,
        role: 'Developer'
      };
      
      const result = analyzer.analyzeEmployee(incompleteEmployee);
      expect(result.score).toBeGreaterThan(0);
      expect(result.level).toBeDefined();
    });

    test('should identify high risk employees', () => {
  const highRiskEmployee = {
    id: 'high-risk-emp',
    performanceRating: 2.0, // Low performance
    engagementScore: 2.0, // Low engagement
    startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
    role: 'Senior Developer',
    skills: ['COBOL'], // Obsolete skill
    salary: 50000 // Below market
  };

  const result = analyzer.analyzeEmployee(highRiskEmployee);
  expect(result.level).toBe('high');
});
    test('should generate appropriate recommendations', () => {
      const lowEngagementEmployee = {
        ...employee,
        engagementScore: 2.0
      };
      
      const result = analyzer.analyzeEmployee(lowEngagementEmployee);
      expect(result.recommendations).toContain('Investigate engagement issues through 1:1 meetings');
    });
  });

  describe('analyzeBatch', () => {
    test('should analyze multiple employees', () => {
      const employees = [employee, { ...employee, id: 'EMP002' }];
      const results = analyzer.analyzeBatch(employees);
      
      expect(results).toHaveLength(2);
      expect(results[0].employeeId).toBe('EMP001');
      expect(results[1].employeeId).toBe('EMP002');
    });
  });

  describe('risk calculations', () => {
    test('should calculate salary risk based on market rates', () => {
      const underpaidEmployee = {
        ...employee,
        salary: 60000,
        role: 'Senior Software Engineer'
      };
      
      const salaryRisk = analyzer.calculateSalaryRisk(underpaidEmployee.salary, underpaidEmployee.role);
      expect(salaryRisk).toBeGreaterThan(0.5);
    });

    test('should calculate promotion risk for long tenure', () => {
      const longTenureEmployee = {
        ...mockEmployee,
        startDate: '2020-01-01',
        role: 'Junior Developer'
      };
      
      const now = new Date();
      const startDate = new Date(longTenureEmployee.startDate);
      const tenureMonths = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));
      
      const promotionRisk = analyzer.calculatePromotionRisk(tenureMonths, longTenureEmployee.role);
      expect(promotionRisk).toBeGreaterThan(0.5);
    });
  });
});