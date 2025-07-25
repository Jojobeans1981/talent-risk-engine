global.createEmployee = (overrides) => ({
  id: 'EMP001',
  name: 'Test Employee',
  skills: [],
  performanceRating: 3.0,
  ...overrides
});