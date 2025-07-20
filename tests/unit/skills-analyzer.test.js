import {  analyzeSkills  } from '../src/analyzers/skills-analyzer.js';;
import WorkdaySimulator from '../../src/utils/workday-simulator.js';;

describe('Skills Analyzer', () => {
  describe('Core Skills Analysis', () => {
    const testEmployees = [
      {
        id: 'E1',
        name: 'John Doe',
        skills: ['javascript', 'react'],
        department: 'Frontend'
      }
    ];
    
    const testRequirements = {
      'Frontend': ['javascript', 'react', 'typescript']
    };

    test('correctly identifies missing skills', () => {
      const results = analyzeSkills(testEmployees, testRequirements);
      expect(results[0].missingSkills).toEqual(['typescript']);
    });

    test('handles employees with no department', () => {
      const noDeptEmployees = [
        {...testEmployees[0], department: undefined}
      ];
      const results = analyzeSkills(noDeptEmployees, testRequirements);
      expect(results[0].riskScore).toBe(0);
    });
  });

  describe('Workday Integration', () => {
    let simulator;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      simulator = new WorkdaySimulator(); // Now properly defined
    });

    test('connects successfully', async () => {
      const connectPromise = simulator.connect();
      jest.advanceTimersByTime(100);
      await connectPromise;
      expect(simulator.isConnected).toBe(true);
    });

    test('adds and retrieves employee', async () => {
      await simulator.connect();
      const emp = { name: 'Test', skills: ['js'] };
      const added = await simulator.addEmployee(emp);
      const found = await simulator.getEmployee(added.id);
      expect(found.name).toBe('Test');
    });
  });
});