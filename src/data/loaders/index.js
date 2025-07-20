import CSVLoader from './csv-loader.js';;
import WorkdayLoader from './workday-loader.js';;
import {  validate  } from '../validator.js';;

class DataLoader {
  constructor(workdayConfig) {
    this.loaders = {
      csv: new CSVLoader(),
      workday: new WorkdayLoader(workdayConfig)
    };
  }

  async load(source) {
    if (source.type === 'file') {
      return this.loadFromFile(source.path);
    }
    if (source.type === 'workday') {
      return this.loaders.workday.fetchEmployees(source.params);
    }
    throw new Error(`Unsupported source type: ${source.type}`);
  }

  async loadFromFile(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    const loader = this.loaders[ext];
    
    if (!loader) {
      throw new Error(`No loader for .${ext} files`);
    }

    const result = await loader.load(filePath);
    result.errors = validate(result.data);
    return result;
  }
}

export default DataLoader;