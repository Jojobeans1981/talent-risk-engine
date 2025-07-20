                  /**
 * Skills Analysis Engine
 * Analyzes workforce skills, gaps, and trends
 */

export class SkillsAnalyzer {
  constructor() {
    this.skillCategories = new Map();
    this.industryBenchmarks = new Map();
  }

  async initialize() {
    // Initialize skill categories and benchmarks
    this.setupSkillCategories();
    this.loadIndustryBenchmarks();
  }

  setupSkillCategories() {
    this.skillCategories.set('technical', [
      'programming', 'data-analysis', 'cloud-computing', 'cybersecurity',
      'machine-learning', 'devops', 'database-management'
    ]);
    
    this.skillCategories.set('soft', [
      'leadership', 'communication', 'problem-solving', 'teamwork',
      'adaptability', 'creativity', 'time-management'
    ]);
    
    this.skillCategories.set('domain', [
      'finance', 'marketing', 'sales', 'hr', 'operations',
      'strategy', 'project-management'
    ]);
  }

  loadIndustryBenchmarks() {
    // Mock industry benchmarks - in real implementation, load from external source
    this.industryBenchmarks.set('programming', { demand: 0.8, growth: 0.15 });
    this.industryBenchmarks.set('data-analysis', { demand: 0.9, growth: 0.25 });
    this.industryBenchmarks.set('leadership', { demand: 0.7, growth: 0.1 });
  }

  async analyzeWorkforce(employees) {
    const analysis = {
      totalEmployees: employees.length,
      skillDistribution: this.analyzeSkillDistribution(employees),
      skillGaps: this.identifySkillGaps(employees),
      emergingSkills: this.identifyEmergingSkills(employees),
      criticalGaps: this.identifyCriticalGaps(employees),
      totalUniqueSkills: this.countUniqueSkills(employees)
    };

    return analysis;
  }

  analyzeSkillDistribution(employees) {
    const distribution = new Map();
    
    employees.forEach(employee => {
      const skills = this.extractSkills(employee);
      skills.forEach(skill => {
        const count = distribution.get(skill) || 0;
        distribution.set(skill, count + 1);
      });
    });

    // Convert to array and sort by frequency
    return Array.from(distribution.entries())
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: (count / employees.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  identifySkillGaps(employees) {
    const gaps = [];
    const currentSkills = new Set();
    
    // Collect all current skills
    employees.forEach(employee => {
      this.extractSkills(employee).forEach(skill => {
        currentSkills.add(skill);
      });
    });

    // Compare with industry benchmarks
    this.industryBenchmarks.forEach((benchmark, skill) => {
      const currentCount = this.countEmployeesWithSkill(employees, skill);
      const currentPercentage = currentCount / employees.length;
      
      if (currentPercentage < benchmark.demand) {
        gaps.push({
          skill,
          currentPercentage,
          requiredPercentage: benchmark.demand,
          gap: benchmark.demand - currentPercentage,
          priority: this.calculateGapPriority(benchmark)
        });
      }
    });

    return gaps.sort((a, b) => b.priority - a.priority);
  }

  identifyEmergingSkills(employees) {
    // Mock implementation - in real scenario, analyze trends over time
    const emergingSkills = [
      { skill: 'ai-prompt-engineering', growth: 0.45, demand: 0.3 },
      { skill: 'quantum-computing', growth: 0.35, demand: 0.15 },
      { skill: 'sustainability', growth: 0.25, demand: 0.4 }
    ];

    return emergingSkills;
  }

  identifyCriticalGaps(employees) {
    const skillGaps = this.identifySkillGaps(employees);
    return skillGaps.filter(gap => gap.priority > 0.7 && gap.gap > 0.3);
  }

  countUniqueSkills(employees) {
    const uniqueSkills = new Set();
    employees.forEach(employee => {
      this.extractSkills(employee).forEach(skill => {
        uniqueSkills.add(skill);
      });
    });
    return uniqueSkills.size;
  }

  extractSkills(employee) {
    const skills = [];
    
    // Extract from various employee fields
    if (employee.skills) {
      if (Array.isArray(employee.skills)) {
        skills.push(...employee.skills);
      } else if (typeof employee.skills === 'string') {
        skills.push(...employee.skills.split(',').map(s => s.trim().toLowerCase()));
      }
    }
    
    if (employee.technologies) {
      if (Array.isArray(employee.technologies)) {
        skills.push(...employee.technologies);
      } else if (typeof employee.technologies === 'string') {
        skills.push(...employee.technologies.split(',').map(s => s.trim().toLowerCase()));
      }
    }

    return skills.filter(skill => skill && skill.length > 0);
  }

  countEmployeesWithSkill(employees, targetSkill) {
    return employees.filter(employee => {
      const skills = this.extractSkills(employee);
      return skills.some(skill => 
        skill.toLowerCase().includes(targetSkill.toLowerCase()) ||
        targetSkill.toLowerCase().includes(skill.toLowerCase())
      );
    }).length;
  }

  calculateGapPriority(benchmark) {
    // Priority based on demand and growth
    return (benchmark.demand * 0.6) + (benchmark.growth * 0.4);
  }
}

export default SkillsAnalyzer;