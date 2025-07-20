export default {
  determineRiskLevel: (score) => {
    if (score >= 80) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 20) return 'Medium';
    return 'Low';
  }
};