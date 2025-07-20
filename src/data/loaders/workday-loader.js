import {  normalizeEmployee  } from '../../normalizers/employee-normalizer.js';;

class WorkdayLoader {
  constructor(apiClient) {
    this.api = apiClient;
  }

  async fetchEmployees(params = {}) {
    const rawData = await this.api.getWorkers(params);
    return {
      data: rawData.map(normalizeEmployee),
      meta: {
        source: 'workday',
        count: rawData.length,
        params
      }
    };
  }
}

export default WorkdayLoader;