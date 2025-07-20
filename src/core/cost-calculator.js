function calculateBaseScore(skills, requiredSkills) {
  const missing = requiredSkills.filter(req => !skills.includes(req));
  const score = (missing.length / requiredSkills.length) * 100;
  return Math.round(score);
}

function calculateCostImpact(riskScore, headcount, config) {
  const atRisk = Math.ceil(headcount * (riskScore / 100) * 0.6);
  return {
    recruitment: atRisk * config.costs.perHire,
    training: atRisk * config.costs.training,
    productivityLoss: atRisk * config.salary.avg * 0.15,
    total() {
      return this.recruitment + this.training + this.productivityLoss;
    }
  };
}

export default {
    calculateBaseScore,     
    calculateCostImpact

};
