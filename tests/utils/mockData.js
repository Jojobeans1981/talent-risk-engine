// test/utils/mockData.js
module.exports = {
  createEmployee: (overrides = {}) => ({
    id: 'EMP001',
    skills: ['JavaScript', 'React'],
    performanceRating: 4.0,
    engagementScore: 3.8,
    ...overrides
  })
};