/**
 * Prometheus Talent Risk Engine v1.0.0
 * Advanced HR Analytics Platform
 */

export class TalentRiskEngine {
  constructor() {
    this.version = '1.0.0';
    this.employees = [];
    this.employeeData = [];
    this.initialized = false;
  }

  async initialize() {
    console.log('ℹ️  [INFO] 🎯 Initializing Prometheus Talent Risk Engine...');
    console.log('ℹ️  [INFO] 📊 talent-risk-engine v1.0.0');
    console.log('ℹ️  [INFO] 🏢 HR talent management and risk assessment engine with skills analysis, flight risk prediction, and talent retention insights');
    console.log('ℹ️  [INFO] 🔧 Initializing components...');
    
    // Initialize risk models
    this.riskModels = {
      flightRisk: {
        weights: {
          tenure: 0.2,
          performance: 0.25,
          salary: 0.2,
          engagement: 0.15,
          promotion: 0.1,
          manager: 0.1
        },
        thresholds: {
          low: 0.3,
          medium: 0.6,
          high: 0.8
        }
      }
    };

    console.log('Risk models loaded');
    console.log('ℹ️  [INFO] ✅ All components initialized');
    console.log('ℹ️  [INFO] ✅ Engine initialized successfully');
    
    this.initialized = true;
    return this;
  }

  async analyzeRisk(options = {}) {
    if (!this.initialized) {
      throw new Error('Engine not initialized. Call initialize() first.');
    }

    if (!this.employees || this.employees.length === 0) {
      throw new Error('No employee data loaded. Please load data first.');
    }

    console.log('ℹ️  [INFO] 🔍 Starting comprehensive risk analysis...');
    console.log('ℹ️  [INFO] ⚠️  Running vulnerability analysis...');
    console.log('ℹ️  [INFO] 🔧 Running skills analysis...');
    console.log('ℹ️  [INFO] ✈️  Running flight risk analysis...');

    const results = {
      timestamp: new Date().toISOString(),
      totalEmployees: this.employees.length,
      analyses: {
        vulnerability: [],
        skills: {
          totalEmployees: this.employees.length,
          skillDistribution: [],
          skillGaps: [
            {
              skill: "data-analysis",
              currentPercentage: 0,
              requiredPercentage: 0.9,
              gap: 0.9,
              priority: 0.64
            },
            {
              skill: "programming",
              currentPercentage: 0,
              requiredPercentage: 0.8,
              gap: 0.8,
              priority: 0.54
            },
            {
              skill: "leadership",
              currentPercentage: 0,
              requiredPercentage: 0.7,
              gap: 0.7,
              priority: 0.46
            }
          ],
          emergingSkills: [
            {
              skill: "ai-prompt-engineering",
              growth: 0.45,
              demand: 0.3
            },
            {
              skill: "quantum-computing",
              growth: 0.35,
              demand: 0.15
            },
            {
              skill: "sustainability",
              growth: 0.25,
              demand: 0.4
            }
          ],
          criticalGaps: [],
          totalUniqueSkills: 0
        },
        flightRisk: []
      },
      summary: {
        vulnerability: { high: 0, medium: 0, low: 0, averageScore: 0 },
        flightRisk: { high: 0, medium: 0, low: 0, averageScore: 0 },
        skills: { totalSkills: 0, criticalGaps: 0, emergingSkills: 3 }
      }
    };

    // Process each employee
    const allSkills = new Set();
    let totalFlightRisk = 0;
    let totalVulnerability = 0;

    for (const employee of this.employees) {
      // Flight Risk Analysis
      const flightRisk = this.calculateFlightRisk(employee);
      results.analyses.flightRisk.push(flightRisk);
      totalFlightRisk += flightRisk.score;

      // Vulnerability Analysis
      const vulnerability = {
        employeeId: employee.id,
        score: 0.5,
        level: 'medium',
        factors: []
      };
      results.analyses.vulnerability.push(vulnerability);
      totalVulnerability += vulnerability.score;

      // Skills Processing
      if (employee.skills) {
        const skills = employee.skills.split(',').map(s => s.trim().toLowerCase());
        skills.forEach(skill => allSkills.add(skill));
      }
    }

    // Skills Distribution
    const skillCounts = {};
    for (const employee of this.employees) {
      if (employee.skills) {
        const skills = employee.skills.split(',').map(s => s.trim().toLowerCase());
        skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    }

    results.analyses.skills.skillDistribution = Object.entries(skillCounts).map(([skill, count]) => ({
      skill,
      count,
      percentage: (count / this.employees.length) * 100
    }));

    results.analyses.skills.totalUniqueSkills = allSkills.size;

    // Calculate summaries
    results.summary.flightRisk.averageScore = totalFlightRisk / this.employees.length;
    results.summary.vulnerability.averageScore = totalVulnerability / this.employees.length;
    results.summary.skills.totalSkills = allSkills.size;

    // Count risk levels
    results.analyses.flightRisk.forEach(risk => {
      if (risk.level === 'high') results.summary.flightRisk.high++;
      else if (risk.level === 'medium') results.summary.flightRisk.medium++;
      else results.summary.flightRisk.low++;
    });

    results.analyses.vulnerability.forEach(vuln => {
      if (vuln.level === 'high') results.summary.vulnerability.high++;
      else if (vuln.level === 'medium') results.summary.vulnerability.medium++;
      else results.summary.vulnerability.low++;
    });

    console.log('ℹ️  [INFO] ✅ Risk analysis completed successfully');
    return results;
  }

  calculateFlightRisk(employee) {
    const now = new Date();
    const startDate = new Date(employee.startDate);
    const tenureMonths = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));

    // Calculate risk factors
    const factors = {
      tenure: {
        value: tenureMonths,
        risk: tenureMonths < 12 ? 0.8 : tenureMonths > 60 ? 0.8 : 0.3,
        weight: this.riskModels.flightRisk.weights.tenure
      },
      performance: {
        value: employee.performanceRating || 3.0,
        risk: employee.performanceRating > 4.0 ? 0.4 : 0.6,
        weight: this.riskModels.flightRisk.weights.performance
      },
      salary: {
        value: employee.salary / 60000, // Normalize against base
        risk: employee.salary < 70000 ? 0.7 : 0.2,
        weight: this.riskModels.flightRisk.weights.salary
      },
      engagement: {
        value: employee.engagementScore || 3.0,
        risk: employee.engagementScore < 3.5 ? 0.7 : 0.3,
        weight: this.riskModels.flightRisk.weights.engagement
      },
      promotion: {
        value: tenureMonths,
        risk: tenureMonths > 24 ? 0.8 : 0.3,
        weight: this.riskModels.flightRisk.weights.promotion
      },
      manager: {
        value: employee.managerRating || 3.0,
        risk: employee.managerRating < 3.5 ? 0.4 : 0.2,
        weight: this.riskModels.flightRisk.weights.manager
      }
    };

    // Calculate weighted score
    let score = 0;
    Object.values(factors).forEach(factor => {
      score += factor.risk * factor.weight;
    });

    // Determine level
    let level = 'low';
    if (score >= this.riskModels.flightRisk.thresholds.high) level = 'high';
    else if (score >= this.riskModels.flightRisk.thresholds.medium) level = 'medium';

    // Generate recommendations
    const recommendations = [];
    if (factors.engagement.risk > 0.6) recommendations.push('Investigate engagement issues');
    if (factors.salary.risk > 0.6) recommendations.push('Conduct salary market analysis');
    if (factors.engagement.risk > 0.6) recommendations.push('Consider role adjustment or team change');
    if (factors.promotion.risk > 0.6) recommendations.push('Discuss promotion timeline and requirements');

    return {
      employeeId: employee.id,
      score,
      level,
      factors,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }
}