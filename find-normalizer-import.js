import { readFileSync } from 'fs';
import { glob } from 'glob';

const files = [
  'src/index.js',
  'src/utils/logger.js',
  'src/analyzers/vulnerability-calculator.js',
  'src/analyzers/skills-analyzer.js',
  'src/analyzers/risk-analyzer.js',
  'src/data/loaders/data-loader.js',
  'src/data/loaders/csv-loader.js',
  'src/mapping/skill-mapper.js'
];

console.log('🔍 Searching for normalizer imports...\n');

for (const file of files) {
  try {
    const content = readFileSync(file, 'utf8');
    if (content.includes('normalizer') || content.includes('normalizeEmployee')) {
      console.log(`❌ Found normalizer reference in: ${file}`);
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('normalizer') || line.includes('normalizeEmployee')) {
          console.log(`   Line ${index + 1}: ${line.trim()}`);
        }
      });
      console.log('');
    } else {
      console.log(`✅ ${file} - clean`);
    }
  } catch (error) {
    console.log(`❌ Error reading ${file}: ${error.message}`);
  }
}