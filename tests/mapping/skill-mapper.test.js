
const { mapEmployee } = require('mapping/skill-mapper');
const mockEmployee = {
  id: 'E1',
  skills: ['javascript'],
  department: 'Engineering'
};

jest.mock('@data/skill-taxonomy', () => ({
  javascript: {
    futureSkills: ["AI Prompt Engineering"],
    demand: 90
  }
}));

describe('SkillMapper', () => {
  test('prioritizes high-demand skills', () => {
    const result = mapEmployee(mockEmployee);
    const aiSkill = result.futureSkillsMap[0];
    expect(aiSkill.marketDemand).toBe(90);
  });
});