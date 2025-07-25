/**
 * Flight Risk Analysis Engine
 * Predicts employee turnover probability using multiple factors
 */
class RiskAnalyzer {
  constructor(config = {}) {
    this.config = {
      weights: {
        flightRisk: 0.3,
        skillCriticality: 0.2,
        performanceRisk: 0.15,
        engagementRisk: 0.15,
        careerProgressionRisk: 0.2
      },
      thresholds: {
        low: 0.4,
        medium: 0.7
      },
      ...config
    };
  }

  calculateSalaryRisk(salary, role) {
    const marketRanges = {
      'developer': { min: 70000, max: 120000 },
      'senior': { min: 90000, max: 150000 },
      'lead': { min: 110000, max: 180000 },
      'manager': { min: 120000, max: 200000 },
      'director': { min: 150000, max: 250000 },
      junior: { min: 50000, max: 80000 }
    };

    const roleKey = Object.keys(marketRanges).find(key => 
      role.toLowerCase().includes(key)
    ) || 'developer';

    const range = marketRanges[roleKey];
    const midpoint = (range.min + range.max) / 2;

    if (salary < range.min * 0.9) return 0.8;
    if (salary < midpoint * 0.9) return 0.6;
    if (salary > range.max * 1.1) return 0.2;
    
    return 0.3;
  }

  calculatePromotionRisk(tenureMonths, role) {
    let risk = 0.2;
    
    if (tenureMonths > 24) risk += 0.3;
    if (tenureMonths > 36) risk += 0.2;
    
    if (role && !role.toLowerCase().includes('senior') && !role.toLowerCase().includes('lead')) {
      risk += 0.2;
    }
    
    return Math.min(risk, 1.0);
  }

  analyzeEmployee(employee) {
    if (!employee || !employee.id) {
      throw new Error('Invalid employee data: missing id');
    }

    const factors = this.calculateRiskFactors(employee);
    const overallRisk = this.calculateOverallRisk(factors);
    const riskLevel = this.determineRiskLevel(overallRisk);
    const recommendations = this.generateRecommendations(factors, employee);
       return {
    employeeId: employee.id,
    score: Math.round(overallRisk * 100),
    overallRisk,
    level: riskLevel, 
    factors,
    recommendations
   };
  }

  analyzeBatch(employees) {
    if (!Array.isArray(employees)) {
      throw new Error('Expected array of employees');
    }
    return employees.map(employee => this.analyzeEmployee(employee));
  }

  calculateRiskFactors(employee) {
    return {
      flightRisk: this.calculateFlightRisk(employee),
      skillCriticality: this.calculateSkillCriticality(employee),
      performanceRisk: this.calculatePerformanceRisk(employee),
      engagementRisk: this.calculateEngagementRisk(employee),
      careerProgressionRisk: this.calculateCareerProgressionRisk(employee),
      tenureRisk: this.calculateTenureRisk(employee),
      salaryRisk: this.calculateSalaryRisk(employee.salary || 0, employee.role || ''),
      tenure: {
      years: this.calculateTenure(employee),
      risk: this.calculateTenureRisk(employee)
    }
    };
  }

  calculateFlightRisk(employee) {
    let risk = 0.3; // Base risk
    
    // Performance-based risk
    const performanceRating = employee.performanceRating || 3.0;
    if (performanceRating < 3.0) risk += 0.2;
    else if (performanceRating > 4.5) risk += 0.1;
    
    // Engagement-based risk
    const engagementScore = employee.engagementScore || 3.5;
    if (engagementScore < 3.0) risk += 0.3;
    else if (engagementScore < 3.5) risk += 0.1;
    
    // Tenure-based risk
    const yearsOfService = this.calculateTenure(employee);
    if (yearsOfService < 1) risk += 0.2;
    
    // Role-based risk
    const role = (employee.role || '').toLowerCase();
    if (role.includes('senior') || role.includes('principal')) risk += 0.1;
    
    // Salary risk impact
    const salaryRisk = this.calculateSalaryRisk(employee.salary || 0, role);
    risk += salaryRisk * 0.2;
    
    return Math.min(risk, 1.0);
  }

  calculateSkillCriticality(employee) {
    const skills = employee.skills || [];
    const criticalSkills = [
      'leadership', 'architecture', 'security', 'devops', 
      'machine learning', 'cloud'
    ];
    
    let criticalityScore = 0.2;
    
    skills.forEach(skill => {
      const skillName = (skill.name || skill).toString().toLowerCase();
      if (criticalSkills.some(critical => skillName.includes(critical))) {
        criticalityScore += 0.1;
      }
    });
    
    return Math.min(criticalityScore, 1.0);
  }

  calculatePerformanceRisk(employee) {
    const performanceRating = employee.performanceRating;
    if (performanceRating === undefined || performanceRating === null) return 0.5;
    
    if (performanceRating < 2.5) return 0.8;
    if (performanceRating < 3.5) return 0.4;
    if (performanceRating > 4.5) return 0.1;
    
    return 0.2;
  }

  calculateEngagementRisk(employee) {
    const engagementScore = employee.engagementScore || 3.5;
    
    if (engagementScore < 2.5) return 0.8;
    if (engagementScore < 3.0) return 0.6;
    if (engagementScore < 3.5) return 0.4;
    if (engagementScore > 4.5) return 0.1;
    
    return 0.2;
  }

  calculateCareerProgressionRisk(employee) {
    const yearsOfService = this.calculateTenure(employee);
    const role = (employee.role || '').toLowerCase();
    
    let risk = 0.3;
    
    if (yearsOfService > 3 && !role.includes('senior') && !role.includes('lead')) {
      risk += 0.3;
    }
    
    const performanceRating = employee.performanceRating || 3.0;
    if (performanceRating > 4.0 && yearsOfService > 2 && !role.includes('senior')) {
      risk += 0.2;
    }
    
    // Add promotion risk factor
    const promotionRisk = this.calculatePromotionRisk(
      (yearsOfService * 12), 
      role
    );
    risk += promotionRisk * 0.2;
    
    return Math.min(risk, 1.0);
  }

  calculateTenureRisk(employee) {
    const yearsOfService = this.calculateTenure(employee);
    
    if (yearsOfService < 1) return 0.7;
    if (yearsOfService > 10) return 0.6;
    if (yearsOfService < 3) return 0.4;
    
    return 0.2;
  }

  calculateOverallRisk(factors) {
    let totalRisk = 0;
    const weights = this.config.weights;
    
    Object.keys(weights).forEach(factor => {
      totalRisk += (factors[factor] || 0) * weights[factor];
    });
    
    return Math.min(1, Math.max(0, totalRisk));
  }

  determineRiskLevel(riskScore) {
    const { low, medium } = this.config.thresholds;
    if (riskScore >= medium) return 'high';
    if (riskScore >= low) return 'medium';
    return 'low';
  }

  generateRecommendations(factors, employee) {
    const recommendations = [];
    
    // High flight risk recommendations
    if (factors.flightRisk > 0.6) {
      recommendations.push('Immediate retention conversation needed');
      recommendations.push('Review compensation and career development');
      recommendations.push('Investigate engagement issues through 1:1 meetings');
    }
    
    // Engagement risk recommendations
    if (factors.engagementRisk > 0.6) {
      recommendations.push('Focus on employee engagement initiatives');
      recommendations.push('Conduct stay interview');
    }
    
    // Career progression recommendations
    if (factors.careerProgressionRisk > 0.6) {
      recommendations.push('Discuss career advancement opportunities');
      recommendations.push('Create development plan');
    }
    
    // Performance risk recommendations
    if (factors.performanceRisk > 0.6) {
      recommendations.push('Implement performance improvement plan');
    }
    
    // Salary risk recommendations
    if (factors.salaryRisk > 0.6) {
      recommendations.push('Review compensation competitiveness');
    }
    
    // Default recommendation if no specific risks
    if (recommendations.length === 0) {
      recommendations.push('Continue regular check-ins');
    }
    
    return recommendations;
  }

  calculateTenure(employee) {
    if (!employee.startDate) return 0;
    const startDate = new Date(employee.startDate);
    return (new Date() - startDate) / (1000 * 60 * 60 * 24 * 365);
  }

  analyzeTeamRisk(employees) {
    if (!Array.isArray(employees)) {
      throw new Error('Expected array of employees');
    }

    const individualRisks = this.analyzeBatch(employees);
    const averageRisk = individualRisks.reduce((sum, risk) => sum + risk.overallRisk, 0) / individualRisks.length;
    
    return {
      averageRisk,
      teamRiskLevel: this.determineRiskLevel(averageRisk),
      highRiskEmployees: individualRisks.filter(risk => risk.riskLevel === 'high').length,
      riskDistribution: this.calculateRiskDistribution(individualRisks),
      recommendations: this.generateTeamRecommendations(individualRisks)
    };
  }

  calculateRiskDistribution(risks) {
    return risks.reduce((acc, risk) => {
      acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
      return acc;
    }, { high: 0, medium: 0, low: 0 });
  }

  generateTeamRecommendations(individualRisks) {
    const recommendations = [];
    const highRiskCount = individualRisks.filter(r => r.riskLevel === 'high').length;
    
    if (highRiskCount > 0) {
      recommendations.push(`Address ${highRiskCount} high-risk employees`);
    }
    
    const engagementIssues = individualRisks.filter(r => r.factors.engagementRisk > 0.5).length;
    if (engagementIssues > individualRisks.length * 0.3) {
      recommendations.push('Team-wide engagement improvement needed');
    }
    
    const salaryIssues = individualRisks.filter(r => r.factors.salaryRisk > 0.6).length;
    if (salaryIssues > 0) {
      recommendations.push('Review team compensation structure');
    }
    
    return recommendations;
  }
}

module.exports = RiskAnalyzer;