import api from '../../src/api.js';;
import {  extractSkills  } from '../../src/phases/day2-skills-extraction.js';;

jest.mock('../../src/api', () => ({
  get: jest.fn()
}));

describe('Skills Extraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('extracts skills from API', async () => {
    api.get.mockResolvedValue({ data: [{ id: 'E1', skills: ['js'] }] });
    const result = await extractSkills();
    expect(result[0].skills).toEqual(['js']);
  });
});