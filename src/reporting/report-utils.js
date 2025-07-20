export default {
  generateExecutiveSummary: ({ vulnerability }) => ({
    summary: 'Talent Risk Assessment',
    riskLevel: vulnerability.level,
    score: vulnerability.score
  })
};