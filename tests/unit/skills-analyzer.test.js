const SkillsAnalyzer = require('../../src/analyzers/skills-analyzer');
const { createEmployee } = require('../utils/mockData');  // Adjust path as needed


describe('SkillsAnalyzer', () => {
    describe('analyzeIndividualSkills', () => {
    it('should calculate market demand correctly', () => {
      const marketData = {
        javascript: 0.9,
        react: 0.85,
        'node.js': 0.8
      };
      
      const analyzer = new SkillsAnalyzer(marketData);
      
      // Test with both string and object skill formats
      const employee = {
        id: 'emp1',
        name: 'Test Employee',
        skills: [
          'JavaScript', // string format
          { name: 'React', type: 'technical' }, // object format
          'Node.js'
        ]
      };
      
      const result = analyzer.analyzeIndividualSkills(employee);
      
      expect(result.avgMarketDemand).toBeDefined();
      expect(result.avgMarketDemand).toBeGreaterThan(0.7);      // Should be approximately (0.9 + 0.85 + 0.8)/3 = 0.85
      expect(result.avgMarketDemand).toBeCloseTo(0.85, 2);
    });

    it('should handle missing market data', () => {
      const analyzer = new SkillsAnalyzer();
      const employee = {
        id: 'emp2',
        name: 'Test Employee',
        skills: ['COBOL', 'Fortran'] // No market data
      };
      
      const result = analyzer.analyzeIndividualSkills(employee);
      expect(result.avgMarketDemand).toBe(0.5); // Default value
    });
  });
});