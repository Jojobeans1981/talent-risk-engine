import assessor from '../../src/core/assessor.js';;
import mockDataLoader from '../../src/data/loaders.js';;

jest.mock('../../src/data/loaders', () => ({
  loadData: jest.fn().mockResolvedValue({
    employees: [{ id: 'E1', skills: ['js'] }],
    industry: 'Tech'
  })
}));

describe('Assessor', () => {
  test('generates assessment report', async () => {
    const result = await assessor.assessOrganization({});
    expect(result).toHaveProperty('summary');
  });
});