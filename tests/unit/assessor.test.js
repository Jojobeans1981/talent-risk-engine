const  SkillsAnalyzer  = require('../../src/analyzers/skills-analyzer');
const  RiskAnalyzer  = require('../../src/analyzers/risk-analyzer');
const  TalentRiskAssessor  = require('../../src/core/assessor');
const { createEmployee } = require('../utils/mockData');  // Adjust path as needed

// Mock the dependencies
jest.mock('../../src/analyzers/skills-analyzer', () => {
  return {
    SkillsAnalyzer: jest.fn().mockImplementation(() => ({
      analyzeSkills: jest.fn().mockReturnValue({
        skillMatch: 0.8,
        criticalSkills: ['JavaScript']
      })
    }))
  };
});

jest.mock('../../src/analyzers/risk-analyzer', () => {
  return {
    RiskAnalyzer: jest.fn().mockImplementation(() => ({
      analyzeEmployee: jest.fn().mockReturnValue({
        riskScore: 0.65,
        riskFactors: ['performance']
      })
    }))
  };
});

describe('TalentRiskAssessor', () => {
  let talentRiskAssessor;
  let skillsAnalyzer;
  let riskAnalyzer;
  
  beforeEach(() => {
    // These will now use the mocked versions
    skillsAnalyzer = new SkillsAnalyzer();
    riskAnalyzer = new RiskAnalyzer();
    talentRiskAssessor = new TalentRiskAssessor(skillsAnalyzer, riskAnalyzer);
  });

  mockEmployee = createEmployee({
    id: 'EMP001',
    name: 'John Doe',
    skills: ['JavaScript', 'React'],
    performanceRating: 3.5,
      engagementScore: 4.0,
      tenure: 2.5,
      department: 'Engineering'
    });
  });

  describe('assessEmployee', () => {
    test('should assess individual employee comprehensively', () => {
      const assessment = talentRiskAssessor.assessEmployee(mockEmployee);

      expect(assessment).toEqual(expect.objectContaining({
        employeeId: expect.any(String),
        skillsAnalysis: expect.objectContaining({
          skillMatch: expect.any(Number),
          criticalSkills: expect.any(Array)
        }),
        riskAnalysis: expect.objectContaining({
          riskScore: expect.any(Number),
          riskFactors: expect.any(Array)
        })
      }));
    });

    test('should handle missing performance data', () => {
      const employeeWithoutPerformance = {
        ...mockEmployee,
        performanceRating: undefined
      };
      
      const assessment = talentRiskAssessor.assessEmployee(employeeWithoutPerformance);
      expect(assessment.riskAnalysis.riskFactors).toContain('Missing performance data');
    });
  });

  describe('calculateConfidenceScore', () => {
    test('should adjust confidence based on team size', () => {
      const smallTeam = Array(2).fill().map(() => createEmployee());
      const largeTeam = Array(5).fill().map(() => createEmployee());
      
      const smallConfidence = talentRiskAssessor.calculateConfidenceScore(smallTeam);
      const largeConfidence = talentRiskAssessor.calculateConfidenceScore(largeTeam);
      
      expect(smallConfidence).toBeLessThan(largeConfidence);
      expect(largeConfidence).toBeLessThanOrEqual(1);
    });

    test('should return lower confidence for incomplete data', () => {
      const incompleteEmployee = { id: 'EMP001', name: 'Incomplete' }; // Missing required fields
      const confidence = talentRiskAssessor.calculateConfidenceScore([incompleteEmployee]);
      expect(confidence).toBeLessThan(0.5);
    });
  });

  describe('identifyTopConcerns', () => {
    test('should identify critical flight risk concerns', () => {
      const highRiskEmployee = createEmployee({
        performanceRating: 2.0,
        engagementScore: 2.0
      });
      
      const assessment = talentRiskAssessor.assessEmployee(highRiskEmployee);
      const concerns = talentRiskAssessor.identifyTopConcerns([assessment]);

      expect(concerns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringMatching(/performance|engagement/),
            severity: expect.stringMatching(/high|medium/)
          })
        ])
      );
    });

    test('should identify skill obsolescence concerns', () => {
      const obsoleteSkillEmployee = createEmployee({
        skills: ['COBOL']
      });
      
      const assessment = talentRiskAssessor.assessEmployee(obsoleteSkillEmployee);
      const concerns = talentRiskAssessor.identifyTopConcerns([assessment]);

      expect(concerns.some(c => c.type === 'skill_obsolescence')).toBeTruthy();
    });
  });

  describe('generateTeamInsights', () => {
    test('should provide team-level statistics', () => {
      const team = [
        createEmployee({ department: 'Engineering' }),
        createEmployee({ department: 'Marketing' }),
        createEmployee({ department: 'Engineering' })
      ];
      
      const insights = talentRiskAssessor.generateTeamInsights(team);
      
      expect(insights).toEqual(expect.objectContaining({
        teamSize: 3,
        averageRiskScore: expect.any(Number),
        departmentBreakdown: expect.objectContaining({
          Engineering: 2,
          Marketing: 1
        })
      }));
    });
  });

  describe('calculateTeamRiskScore', () => {
    test('should calculate weighted average team risk score', () => {
      const team = [
        createEmployee({ performanceRating: 1.0, tenure: 0.5 }), // High risk
        createEmployee({ performanceRating: 5.0, tenure: 5.0 })  // Low risk
      ];
      
      const teamScore = talentRiskAssessor.calculateTeamRiskScore(team);
      expect(teamScore).toBeGreaterThan(0);
      expect(teamScore).toBeLessThan(1);
    });

    test('should handle empty team', () => {
      const teamScore = talentRiskAssessor.calculateTeamRiskScore([]);
      expect(teamScore).toBe(0);
    });
  });

  describe('integration', () => {
    test('should provide consistent results across assessments', () => {
      const firstAssessment = talentRiskAssessor.assessEmployee(mockEmployee);
      const secondAssessment = talentRiskAssessor.assessEmployee(mockEmployee);
      
      expect(firstAssessment.riskAnalysis.riskScore)
        .toBeCloseTo(secondAssessment.riskAnalysis.riskScore);
    });
  });