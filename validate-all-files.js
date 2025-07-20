import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';

async function checkSyntax(filePath) {
  return new Promise((resolve) => {
    const child = spawn('node', ['--check', filePath], { stdio: 'pipe' });
    let stderr = '';
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ 
        file: filePath, 
        valid: code === 0, 
        error: stderr.trim() 
      });
    });
  });
}

async function validateDirectory(dir, results = []) {
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory() && !['node_modules', '.git', 'coverage'].includes(entry)) {
      await validateDirectory(fullPath, results);
    } else if (stats.isFile() && entry.endsWith('.js')) {
      const result = await checkSyntax(fullPath);
      results.push(result);
    }
  }
  
  return results;
}

console.log('🔍 Validating all JavaScript files...\n');

try {
  const results = await validateDirectory('./src');
  
  const valid = results.filter(r => r.valid);
  const invalid = results.filter(r => !r.valid);
  
  console.log(`✅ Valid files: ${valid.length}`);
  console.log(`❌ Invalid files: ${invalid.length}`);
  
  if (invalid.length > 0) {
    console.log('\n🚨 Files with syntax errors:');
    invalid.forEach(result => {
      console.log(`\n📁 ${result.file}`);
      console.log(`   ${result.error}`);
    });
  } else {
    console.log('\n🎉 All files have valid syntax!');
  }
  
  // Test some key imports
  console.log('\n🧪 Testing key imports...');
  
  const keyFiles = [
    './src/analyzers/vulnerability-calculator.js',
    './src/data/loaders/data-loader.js',
    './src/mapping/skill-mapper.js'
  ];
  
  for (const file of keyFiles) {
    try {
      await import(file);
      console.log(`✅ ${file} imports successfully`);
    } catch (error) {
      console.log(`❌ ${file} import failed: ${error.message}`);
    }
  }
  
} catch (error) {
  console.error('Validation failed:', error.message);
}