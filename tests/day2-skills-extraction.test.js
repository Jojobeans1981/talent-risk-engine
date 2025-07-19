const { extractSkills } = require('../src/phases/day2-skills-extraction');
const { mockAPI } = require('../src/utils/workday-simulator');

jest.mock('../src/utils/workday-simulator');

describe('Skills Extraction', () => {
  beforeEach(() => mockAPI.mockClear());

  test('handles empty response', async () => {
    mockAPI.mockResolvedValue(null);
    await expect(extractSkills()).rejects.toThrow('No API response');
  });

  test('handles empty employee array', async () => {
    mockAPI.mockResolvedValue({ employees: [] });
    await expect(extractSkills()).rejects.toThrow('Empty employee data');
  });

  test('processes valid data', async () => {
    mockAPI.mockResolvedValue({
      employees: [{ id: "EMP1001", skills: ["JavaScript", "Python"] }]
    });
    const result = await extractSkills();
    expect(result).toEqual([{
      employeeId: 'anon_1001',
      skills: ['JavaScript', 'Python'],
      lastUpdated: expect.any(String)
    }]);
  })
});
