const filesToCheck = [
  './src/utils/logger.js',
  './src/analyzers/vulnerability-calculator.js',
  './src/analyzers/skills-analyzer.js',
  './src/analyzers/risk-analyzer.js',
  './src/data/loaders/data-loader.js',
  './src/data/loaders/csv-loader.js',
  './src/mapping/skill-mapper.js',
  './src/index.js'
];

console.log('🔍 Diagnosing imports...\n');

for (const file of filesToCheck) {
  try {
    console.log(`Checking: ${file}`);
    await import(file);
    console.log(`✅ ${file} - OK\n`);
  } catch (error) {
    console.log(`❌ ${file} - ERROR: ${error.message}\n`);
    break; // Stop at first error
  }
}