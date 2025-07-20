export default {
  getIndustryFactor: (industry) => {
    const factors = {
      'Technology': 1.2,
      'Finance': 1.1,
      'Healthcare': 1.3,
      default: 1.0
    };
    return factors[industry] || factors.default;
  }
};