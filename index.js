const { TalentRiskAssessor } = require('./src/assessor');

// Export the main class and any utilities
module.exports = {
  TalentRiskAssessor,
  
  // Quick assessment function for simple use cases
  async assessTeam(employees) {
    const assessor = new TalentRiskAssessor();
    return await assessor.assessTeam(employees);
  },

  // Individual employee assessment
  assessEmployee(employee, team = []) {
    const assessor = new TalentRiskAssessor();
    return assessor.assessEmployee(employee, team);
  }
};

// If running directly, provide a simple CLI interface
if (require.main === module) {
  console.log('Talent Risk Assessment System');
  console.log('Usage: const { TalentRiskAssessor } = require("./index");');
  console.log('Example usage available in tests/integration.test.js');
}