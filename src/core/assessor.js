const RiskAnalyzer = require('../../src/analyzers/risk-analyzer');


class TalentRiskAssessor {
  constructor(skillsAnalyzer, riskAnalyzer, complianceAnalyzer) {
    if (!skillsAnalyzer) {
      throw new Error('SkillsAnalyzer is required');
    }
    this.skillsAnalyzer = skillsAnalyzer;
    this.riskAnalyzer = riskAnalyzer || new RiskAnalyzer();
    this.complianceAnalyzer = complianceAnalyzer;
  }

  analyzeIndividualSkills(employee) {
    // Validate employee and skills data
    if (!employee || !employee.skills) {
      throw new Error('Invalid employee data or missing skills');
    }

    // Ensure the skillsAnalyzer has the method
    if (typeof this.skillsAnalyzer.analyzeIndividualSkills !== 'function') {
      throw new Error('SkillsAnalyzer does not have analyzeIndividualSkills method');
    }

    return this.skillsAnalyzer.analyzeIndividualSkills(employee);
  }

  assessEmployee(employee) {
    try {
      // Validate employee data
      if (!employee) {
        throw new Error('No employee data provided');
      }

      // Perform skills analysis
      const skillsAnalysis = this.analyzeIndividualSkills(employee);

      // Additional analyses
      const riskAnalysis = this.riskAnalyzer 
        ? this.riskAnalyzer.assessIndividualRisk(employee) 
        : null;
      
      const complianceAnalysis = this.complianceAnalyzer 
        ? this.complianceAnalyzer.checkEmployeeCompliance(employee) 
        : null;

      return {
        employeeId: employee.id,
        skillsAnalysis,
        riskAnalysis,
        complianceAnalysis
      };
    } catch (error) {
      console.error(`Employee assessment error for ${employee?.id}:`, error);
      throw new Error(`Employee assessment failed: ${error.message}`);
    }
  }

  assessTeam(employees) {
    try {
      // Validate input
      if (!employees || !Array.isArray(employees) || employees.length === 0) {
        throw new Error('Invalid or empty employee list');
      }

      // Perform individual employee assessments
      const teamAssessments = employees.map(employee => {
        try {
          return this.assessEmployee(employee);
        } catch (individualError) {
          console.warn(`Failed to assess employee ${employee?.id}:`, individualError);
          return null;
        }
      }).filter(assessment => assessment !== null);

      // Generate team-level insights
      const teamInsights = this.generateTeamInsights(teamAssessments);
      const overallRisk = this.calculateOverallTeamRisk(teamAssessments);

      return {
        teamAssessments,
        teamInsights,
        overallRisk
      };
    } catch (error) {
      console.error('Assessment error:', error);
      throw new Error(`Assessment failed: ${error.message}`);
    }
  }

  generateTeamInsights(teamAssessments) {
    // Implement team insights generation
    return {
      averageSkillLevel: this.calculateAverageSkillLevel(teamAssessments),
      departmentBreakdown: this.breakdownByDepartment(teamAssessments)
    };
  }

  calculateAverageSkillLevel(teamAssessments) {
    // Implement average skill level calculation
    if (!teamAssessments || teamAssessments.length === 0) return 0;
    
    const skillLevels = teamAssessments.map(assessment => 
      assessment.skillsAnalysis?.overallSkillLevel || 0
    );
    
    return skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
  }

  breakdownByDepartment(teamAssessments) {
    // Implement department breakdown logic
    const departmentMap = {};
    
    teamAssessments.forEach(assessment => {
      const dept = assessment.employeeId?.split('-')[0] || 'Unknown';
      if (!departmentMap[dept]) {
        departmentMap[dept] = [];
      }
      departmentMap[dept].push(assessment);
    });

    return departmentMap;
  }

  calculateOverallTeamRisk(teamAssessments) {
    // Implement team risk calculation
    if (!teamAssessments || teamAssessments.length === 0) return 'low';
    
    const riskScores = teamAssessments
      .map(assessment => assessment.riskAnalysis?.riskScore || 0)
      .filter(score => score > 0);
    
    const averageRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    
    return averageRisk > 0.7 ? 'high' : averageRisk > 0.4 ? 'medium' : 'low';
  }

  calculateOverallThreat(risk, vulnerability) {
    // Implement threat calculation logic
    if (risk > 0.7 && vulnerability > 0.7) return 'critical';
    if (risk > 0.5 && vulnerability > 0.5) return 'high';
    if (risk > 0.3 && vulnerability > 0.3) return 'medium';
    return 'low';
  }

  calculateTeamRiskScore(teamAssessments) {
    if (!teamAssessments || teamAssessments.length === 0) return 0;
    
    const riskScores = teamAssessments
      .map(assessment => assessment.riskAnalysis?.riskScore || 0)
      .filter(score => score > 0);
    
    return riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
  }

  calculateConfidenceScore(assessments) {
  if (!assessments || !assessments.length) return 0;
  
  const teamSize = assessments.length;
  // Ensure confidence is always < 1 for comparison
  return Math.min(0.99, 0.7 + (teamSize * 0.01));
}
    
  identifyTopConcerns(teamAssessments) {
  const concerns = [];
  const obsoleteSkills = teamAssessments.filter(a => 
    a.factors?.skillObsolescence > 0.5
  );
    if (obsoleteSkills.length > 0) {
    concerns.push({
      type: 'skill_obsolescence',
      severity: 'medium',
      count: obsoleteSkills.length
    });
  }

  // Example concern identification logic
  const flightRiskEmployees = teamAssessments
    .filter(assessment => assessment.riskAnalysis?.flightRisk > 0.7)
    .map(assessment => assessment.employeeId);

    if (flightRiskEmployees.length > 0) {
      concerns.push({
        type: 'critical_flight_risk',
        count: flightRiskEmployees.length,
        employees: flightRiskEmployees
      });
    }
    
    return concerns;
  }
}

module.exports = TalentRiskAssessor;