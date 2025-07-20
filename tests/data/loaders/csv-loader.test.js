const CSVLoader = require('data/loaders/csv-loader');
import fs from 'fs';;

describe('CSVLoader', () => {
  const testFile = 'test-employees.csv';
  
  beforeAll(() => {
    fs.writeFileSync(testFile, `id,name,department,skills\n1,John Doe,Engineering,"Python,JavaScript"`);
  });

  afterAll(() => {
    fs.unlinkSync(testFile); 
  });

  test('loads and normalizes CSV data', async () => {
    const loader = new CSVLoader();
    const result = await loader.load(testFile);
    
  expect(result.data[0]).toEqual(expect.objectContaining({
  id: '1',
  name: 'John Doe',
  department: 'Engineering',
  skills: expect.stringContaining('Python')
}));

  });
 
});