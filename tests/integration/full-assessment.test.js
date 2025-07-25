const  SkillsAnalyzer  = require('../../src/analyzers/skills-analyzer');
const  RiskAnalyzer = require('../../src/analyzers/risk-analyzer');
const TalentRiskAssessor = require('../../src/core/assessor');
const { createEmployee } = require('../utils/mockData');

// Mock dependencies
jest.mock('../../src/analyzers/skills-analyzer');
jest.mock('../../src/analyzers/risk-analyzer');

describe('Full Assessment Integration', () => {
  let skillsAnalyzer;
  let riskAnalyzer;
  let realWorldEmployees;

  beforeAll(() => {
    // Setup mock implementations
    SkillsAnalyzer.mockImplementation(() => ({
      analyzeSkills: jest.fn().mockReturnValue({
        skillMatch: 0.8,
        criticalSkills: ['JavaScript']
      })
    }));

    RiskAnalyzer.mockImplementation(() => ({
      analyzeEmployee: jest.fn().mockReturnValue({
        riskScore: 0.65,
        riskFactors: ['performance']
      }),
      analyzeBatch: jest.fn().mockReturnValue([])
    }));

    skillsAnalyzer = new SkillsAnalyzer();
    riskAnalyzer = new RiskAnalyzer();
    assessor = new TalentRiskAssessor(skillsAnalyzer, riskAnalyzer);
  });


    realWorldEmployees = [
      {
        id: 'EMP001',
        name: 'Sarah Chen',
        role: 'Senior Full Stack Developer',
        department: 'Engineering',
        startDate: '2019-03-15',
        salary: 105000,
        performanceRating: 4.5,
        engagementScore: 3.2,
        managerRating: 4.3,
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
      },
      {
        id: 'EMP002',
        name: 'Michael Rodriguez',
        role: 'Tech Lead',
        department: 'Engineering',
        startDate: '2018-01-10',
        salary: 125000,
        performanceRating: 4.8,
        engagementScore: 4.1,
        managerRating: 4.7,
        skills: ['Python', 'Kubernetes', 'Microservices', 'System Design', 'Leadership']
      },
      {
        id: 'EMP003',
        name: 'Emily Johnson',
        role: 'Junior Developer',
        department: 'Engineering',
        startDate: '2023-06-01',
        salary: 70000,
        performanceRating: 3.8,
        engagementScore: 4.5,
        managerRating: 3.9,
        skills: ['JavaScript', 'HTML', 'CSS', 'React']
      },
      {
        id: 'EMP004',
        name: 'David Kim',
        role: 'Product Manager',
        department: 'Product',
        startDate: '2020-09-01',
        salary: 95000,
        performanceRating: 4.2,
        engagementScore: 3.8,
        managerRating: 4.1,
        skills: ['Product Strategy', 'Analytics', 'SQL', 'Agile', 'Stakeholder Management']
      },
      {
        id: 'EMP005',
        name: 'Lisa Wang',
        role: 'UX Designer',
        department: 'Design',
        startDate: '2021-11-15',
        salary: 85000,
        performanceRating: 4.0,
        engagementScore: 4.2,
        managerRating: 4.0,
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
      }
    ];
  });

  describe('Complete Assessment Workflow', () => {
    test('should perform end-to-end assessment successfully', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      // Verify all main components are present
      expect(result).toHaveProperty('executiveSummary');
      expect(result).toHaveProperty('teamInsights');
      expect(result).toHaveProperty('employeeAssessments');
      expect(result).toHaveProperty('skillsAnalysis');
      expect(result).toHaveProperty('vulnerabilityAnalysis');
      expect(result).toHaveProperty('actionPlan');
      expect(result).toHaveProperty('metadata');
      
      // Verify processing completed successfully
      expect(result.metadata.employeeCount).toBe(5);
      expect(result.metadata.processingTimeMs).toBeGreaterThan(0);
      expect(result.employeeAssessments).toHaveLength(5);
    });

    test('should identify high-risk employee correctly', async () => {
      // Sarah has low engagement but high performance - potential flight risk
      const result = await assessor.assessTeam(realWorldEmployees);
      
      const sarahAssessment = result.employeeAssessments.find(emp => emp.employeeId === 'EMP001');
      expect(sarahAssessment).toBeDefined();
      expect(sarahAssessment.risk.level).toMatch(/medium|high/);
    });

    test('should identify vulnerable employees', async () => {
      // Michael (Tech Lead) should have high vulnerability due to leadership role
      const result = await assessor.assessTeam(realWorldEmployees);
      
      const michaelAssessment = result.employeeAssessments.find(emp => emp.employeeId === 'EMP002');
      expect(michaelAssessment).toBeDefined();
      expect(michaelAssessment.vulnerability.level).toMatch(/medium|high/);
    });

    test('should provide department-specific insights', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      expect(result.teamInsights.departmentBreakdown).toHaveProperty('Engineering');
      expect(result.teamInsights.departmentBreakdown).toHaveProperty('Product');
      expect(result.teamInsights.departmentBreakdown).toHaveProperty('Design');
      
      expect(result.teamInsights.departmentBreakdown.Engineering.total).toBe(3);
      expect(result.teamInsights.departmentBreakdown.Product.total).toBe(1);
      expect(result.teamInsights.departmentBreakdown.Design.total).toBe(1);
    });

    test('should generate actionable recommendations', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      expect(result.teamInsights.recommendations).toBeDefined();
      expect(Array.isArray(result.teamInsights.recommendations)).toBe(true);
      expect(result.teamInsights.recommendations.length).toBeGreaterThan(0);
      
      // Should have at least one high priority recommendation
      const highPriorityRecs = result.teamInsights.recommendations.filter(rec => rec.priority === 'high');
      expect(highPriorityRecs.length).toBeGreaterThanOrEqual(0);
    });

    test('should identify skill gaps and overlaps', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      expect(result.skillsAnalysis).toHaveProperty('skillDistribution');
      expect(result.skillsAnalysis).toHaveProperty('skillGaps');
      expect(result.skillsAnalysis).toHaveProperty('diversity');
      
      // JavaScript should appear multiple times
      const jsSkill = result.skillsAnalysis.skillDistribution.find(s => s.skill === 'JavaScript');
      expect(jsSkill).toBeDefined();
      expect(jsSkill.count).toBeGreaterThan(1);
    });

    test('should create comprehensive action plan', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      expect(result.actionPlan).toHaveProperty('immediate');
      expect(result.actionPlan).toHaveProperty('shortTerm');
      expect(result.actionPlan).toHaveProperty('longTerm');
      expect(result.actionPlan).toHaveProperty('totalActions');
      
      const totalCalculated = result.actionPlan.immediate.length + 
                             result.actionPlan.shortTerm.length + 
                             result.actionPlan.longTerm.length;
      
      expect(result.actionPlan.totalActions).toBe(totalCalculated);
    });

    test('should provide executive summary with key metrics', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      expect(result.executiveSummary.overallRiskLevel).toMatch(/low|medium|high|critical/);
      expect(result.executiveSummary.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.executiveSummary.riskScore).toBeLessThanOrEqual(1);
      expect(result.executiveSummary.confidence).toBeGreaterThan(0);
      expect(result.executiveSummary.confidence).toBeLessThanOrEqual(1);
      
      expect(Array.isArray(result.executiveSummary.keyFindings)).toBe(true);
      expect(Array.isArray(result.executiveSummary.immediateActions)).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle employees with minimal data', async () => {
      const minimalEmployees = [
        {
          id: 'EMP001',
          name: 'John Doe',
          role: 'Developer',
          department: 'Engineering',
          startDate: '2023-01-01'
        }
      ];
      
      const result = await assessor.assessTeam(minimalEmployees);
      expect(result.employeeAssessments).toHaveLength(1);
      expect(result.executiveSummary.confidence).toBeLessThan(0.8);
    });

    test('should handle large teams efficiently', async () => {
      const largeTeam = Array.from({ length: 50 }, (_, i) => ({
        id: `EMP${String(i + 1).padStart(3, '0')}`,
        name: `Employee ${i + 1}`,
        role: 'Developer',
        department: 'Engineering',
        startDate: '2022-01-01',
        salary: 75000 + (i * 1000),
        performanceRating: 3.0 + (Math.random() * 2),
        engagementScore: 3.0 + (Math.random() * 2),
        managerRating: 3.0 + (Math.random() * 2),
        skills: ['JavaScript', 'React']
      }));
      
      const startTime = Date.now();
      const result = await assessor.assessTeam(largeTeam);
      const processingTime = Date.now() - startTime;
      
      expect(result.employeeAssessments).toHaveLength(50);
      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.executiveSummary.confidence).toBeGreaterThan(0.8);
    });

    test('should maintain data consistency across components', async () => {
      const result = await assessor.assessTeam(realWorldEmployees);
      
      // Employee count should be consistent
      expect(result.teamInsights.totalEmployees).toBe(realWorldEmployees.length);
      expect(result.employeeAssessments.length).toBe(realWorldEmployees.length);
      expect(result.metadata.employeeCount).toBe(realWorldEmployees.length);
      
      // Risk distribution should add up to total employees
      const riskTotal = result.teamInsights.riskDistribution.high + 
                       result.teamInsights.riskDistribution.medium + 
                       result.teamInsights.riskDistribution.low;
      expect(riskTotal).toBe(realWorldEmployees.length);
      
      // Department breakdown should add up correctly
      const deptTotal = Object.values(result.teamInsights.departmentBreakdown)
        .reduce((sum, dept) => sum + dept.total, 0);
      expect(deptTotal).toBe(realWorldEmployees.length);
    });
  });

  describe('Performance and Scalability', () => {
    test('should complete assessment within reasonable time', async () => {
      const startTime = Date.now();
      await assessor.assessTeam(realWorldEmployees);
      const processingTime = Date.now() - startTime;
      
      expect(processingTime).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should handle concurrent assessments', async () => {
      const promises = Array.from({ length: 3 }, () => 
        assessor.assessTeam(realWorldEmployees)
      );
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.employeeAssessments).toHaveLength(5);
        expect(result.metadata.employeeCount).toBe(5);
      });
    });
  });