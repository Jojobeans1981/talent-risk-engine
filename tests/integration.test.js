// tests/integration.test.js
const { TalentRiskAssessor } = require('../../src/core/assessor');
const { createEmployee } = require('../utils/mockData');

// Mock the analyzer classes
jest.mock('../../src/analyzers/skills-analyzer', () => {
  return jest.fn().mockImplementation(() => ({
    analyzeSkills: jest.fn().mockReturnValue({
      skillMatch: 0.8,
      criticalSkills: ['JavaScript']
    })
  }));
});

jest.mock('../../src/analyzers/risk-analyzer', () => {
  return jest.fn().mockImplementation(() => ({
    analyzeEmployee: jest.fn().mockReturnValue({
      employeeId: 'EMP001',
      score: 65,
      level: 'medium',
      factors: {
        flightRisk: 0.6,
        skillCriticality: 0.4
      },
      recommendations: ['Regular check-ins']
    }),
    analyzeBatch: jest.fn().mockReturnValue([])
  }));
});

// Import after mocking
const SkillsAnalyzer = require('../../src/analyzers/skills-analyzer');
const RiskAnalyzer = require('../../src/analyzers/risk-analyzer');

describe('TalentRiskAssessor Integration Tests', () => {
  let assessor;
  let skillsAnalyzer;
  let riskAnalyzer;
  let sampleEmployees;

  beforeEach(() => {
    // Create fresh instances for each test
    skillsAnalyzer = new SkillsAnalyzer();
    riskAnalyzer = new RiskAnalyzer();
    assessor = new TalentRiskAssessor(skillsAnalyzer, riskAnalyzer);
    
    sampleEmployees = [
      createEmployee({
        id: 'EMP001',
        name: 'John Smith',
        skills: ['JavaScript'],
        performanceRating: 3.5,
        engagementScore: 4.0,
        tenure: 2.5,
        department: 'Engineering'
      }),
      createEmployee({
        id: 'EMP002',
        name: 'Jane Doe',
        skills: ['COBOL'],
        performanceRating: 2.0,
        engagementScore: 2.5,
        tenure: 10,
        department: 'Legacy Systems'
      })
    ];
  });

  test('should assess individual employee correctly', () => {
    const assessment = assessor.assessEmployee(sampleEmployees[0]);
    
    expect(assessment).toEqual(expect.objectContaining({
      employeeId: 'EMP001',
      score: 65,
      level: 'medium',
      factors: {
        flightRisk: 0.6,
        skillCriticality: 0.4
      },
      recommendations: ['Regular check-ins']
    }));
    
    // Verify the mocks were called correctly
    expect(skillsAnalyzer.analyzeSkills).toHaveBeenCalledWith(
      sampleEmployees[0],
      expect.any(Object)
    );
    expect(riskAnalyzer.analyzeEmployee).toHaveBeenCalledWith(
      sampleEmployees[0]
    );
  });

  test('should assess team comprehensively', () => {
    const teamAssessment = assessor.assessTeam(sampleEmployees);
    
    expect(teamAssessment).toEqual(expect.arrayContaining([
      expect.objectContaining({
        employeeId: expect.any(String),
        score: expect.any(Number)
      })
    ]));
    
    expect(riskAnalyzer.analyzeBatch).toHaveBeenCalledWith(sampleEmployees);
  });

  test('should identify high-risk employees correctly', () => {
    const highRiskEmployee = createEmployee({
      performanceRating: 1.5,
      engagementScore: 2.0
    });
    
    riskAnalyzer.analyzeEmployee.mockReturnValueOnce({
      employeeId: 'EMP003',
      score: 85,
      level: 'high',
      factors: {
        flightRisk: 0.9,
        performanceRisk: 0.8
      },
      recommendations: ['Immediate intervention needed']
    });
    
    const assessment = assessor.assessEmployee(highRiskEmployee);
    expect(assessment.level).toBe('high');
  });

  test('should detect skill obsolescence concerns', () => {
    const obsolescenceEmployee = createEmployee({
      skills: ['COBOL']
    });
    
    skillsAnalyzer.analyzeSkills.mockReturnValueOnce({
      skillMatch: 0.2,
      criticalSkills: [],
      obsoleteSkills: ['COBOL']
    });
    
    const assessment = assessor.assessEmployee(obsolescenceEmployee);
    expect(assessment.factors.skillCriticality).toBeLessThan(0.5);
  });
});