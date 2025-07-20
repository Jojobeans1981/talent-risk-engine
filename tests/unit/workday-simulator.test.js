import WorkdaySimulator from '../utils/workday-simulator.js';;

describe('Workday Simulator', () => {
  let simulator;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    simulator = new WorkdaySimulator();
  });

  test('connects successfully', async () => {
    const connectPromise = simulator.connect();
    jest.advanceTimersByTime(200);
    await connectPromise;
    expect(simulator.isConnected).toBe(true);
  });
});