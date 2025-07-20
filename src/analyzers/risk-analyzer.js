/**
 * Risk Analysis Engine
 * Calculates flight risk and other HR-related risks
 */

export class RiskAnalyzer {
  constructor() {
    this.riskFactors = {
      tenure: { weight: 0.2, thresholds: { low: 36, high: 12 } }, // months
      performance: { weight: 0.25, thresholds: { low: 3.5, high: 4.5 } }, // 1-5 scale
      salary: { weight: 0.2, thresholds: { low: 0.9, high: 1.1 } }, // market ratio
      engagement: { weight: 0.15, thresholds: { low: 3.5, high: 4.0 } }, // 1-5 scale
      promotion: { weight: 0.1, thresholds: { low: 24, high: 48 } }, // months since last
      manager: { weight: 0.1, thresholds: { low: 4.0, high: 3.0 } } // manager rating
    };
  }

  async initialize() {
    await this.loadRiskModels();
  }

  async loadRiskModels() {
    console.log('Risk models loaded');
  }

  async calculateFlightRisk(employee) {
    const factors = this.analyzeRiskFactors(employee);
    const score = this.calculateRiskScore(factors);
    const level = this.determineRiskLevel(score);
    const recommendations = this.generateRecommendations(factors, level);

    return {
      score,
      level,
      factors,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  analyzeRiskFactors(employee) {
    const factors = {};

    const tenureMonths = this.calculateTenure(employee.startDate || employee.hireDate);
    factors.tenure = {
      value: tenureMonths,
      risk: this.calculateTenureRisk(tenureMonths),
      weight: this.riskFactors.tenure.weight
    };

    const performance = parseFloat(employee.performanceRating || employee.rating || 3.0);
    factors.performance = {
      value: performance,
      risk: this.calculatePerformanceRisk(performance),
      weight: this.riskFactors.performance.weight
    };

    const salaryRatio = this.calculateSalaryMarketRatio(employee);
    factors.salary = {
      value: salaryRatio,
      risk: this.calculateSalaryRisk(salaryRatio),
      weight: this.riskFactors.salary.weight
    };

    const engagement = parseFloat(employee.engagementScore || employee.satisfaction || 3.0);
    factors.engagement = {
      value: engagement,
      risk: this.calculateEngagementRisk(engagement),
      weight: this.riskFactors.engagement.weight
    };

    const monthsSincePromotion = this.calculateMonthsSincePromotion(employee);
    factors.promotion = {
      value: monthsSincePromotion,
      risk: this.calculatePromotionRisk(monthsSincePromotion),
      weight: this.riskFactors.promotion.weight
    };

    const managerRating = parseFloat(employee.managerRating || employee.supervisorRating || 3.5);
    factors.manager = {
      value: managerRating,
      risk: this.calculateManagerRisk(managerRating),
      weight: this.riskFactors.manager.weight
    };

    return factors;
  }

  calculateRiskScore(factors) {
    let weightedScore = 0;
    let totalWeight = 0;

    Object.values(factors).forEach(factor => {
      weightedScore += factor.risk * factor.weight;
      totalWeight += factor.weight;
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  determineRiskLevel(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  generateRecommendations(factors, level) {
    const recommendations = [];

    if (level === 'high') {
      recommendations.push('Schedule immediate retention conversation');
      recommendations.push('Review compensation and benefits');
      recommendations.push('Discuss career development opportunities');
    }

    if (factors.salary?.risk > 0.6) {
      recommendations.push('Conduct salary market analysis');
    }

    if (factors.engagement?.risk > 0.6) {
      recommendations.push('Investigate engagement issues');
      recommendations.push('Consider role adjustment or team change');
    }

    if (factors.promotion?.risk > 0.6) {
      recommendations.push('Discuss promotion timeline and requirements');
    }

    if (factors.manager?.risk > 0.6) {
      recommendations.push('Address manager relationship concerns');
    }

    return recommendations;
  }

  calculateTenure(startDate) {
    if (!startDate) return 12;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24 * 30.44));
  }

  calculateTenureRisk(months) {
    const thresholds = this.riskFactors.tenure.thresholds;
    if (months < thresholds.high) return 0.8;
    if (months > thresholds.low) return 0.3;
    return 0.5;
  }

  calculatePerformanceRisk(rating) {
    const thresholds = this.riskFactors.performance.thresholds;
    if (rating > thresholds.high) return 0.2;
    if (rating < thresholds.low) return 0.8;
    return 0.4;
  }

  calculateSalaryMarketRatio(employee) {
    const salary = parseFloat(employee.salary || employee.compensation || 50000);
    const marketSalary = this.getMarketSalary(employee.role || employee.position || 'general');
    return salary / marketSalary;
  }

  getMarketSalary(role) {
    const marketSalaries = {
      'software engineer': 80000,
      'data scientist': 95000,
      'product manager': 110000,
      'designer': 70000,
      'general': 60000
    };
    
    const normalizedRole = role.toLowerCase();
    return marketSalaries[normalizedRole] || marketSalaries.general;
  }

  calculateSalaryRisk(ratio) {
    if (ratio < 0.8) return 0.9;
    if (ratio < 0.9) return 0.7;
    if (ratio > 1.2) return 0.2;
    return 0.3;
  }

  calculateEngagementRisk(score) {
    const thresholds = this.riskFactors.engagement.thresholds;
    if (score < 2.0) return 0.9;
    if (score < thresholds.high) return 0.7;
    if (score > thresholds.low) return 0.2;
    return 0.4;
  }

  calculateMonthsSincePromotion(employee) {
    if (!employee.lastPromotionDate && !employee.promotionDate) {
      return this.calculateTenure(employee.startDate || employee.hireDate);
    }
    
    const promotionDate = new Date(employee.lastPromotionDate || employee.promotionDate);
    const now = new Date();
    return Math.floor((now - promotionDate) / (1000 * 60 * 60 * 24 * 30.44));
  }

  calculatePromotionRisk(months) {
    const thresholds = this.riskFactors.promotion.thresholds;
    if (months > thresholds.high) return 0.8;
    if (months < thresholds.low) return 0.2;
    return 0.5;
  }

  calculateManagerRisk(rating) {
    const thresholds = this.riskFactors.manager.thresholds;
    if (rating < thresholds.high) return 0.8;
    if (rating > thresholds.low) return 0.2;
    return 0.4;
  }
}

export default RiskAnalyzer;