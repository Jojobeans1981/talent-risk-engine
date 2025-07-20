#!/usr/bin/env node

import { TalentRiskEngine } from './src/index.js';

async function runTalentRiskAssessment() {
  console.log('🚀 Starting Talent Risk Assessment...\n');

  try {
    // Initialize the engine
    const engine = new TalentRiskEngine();
    await engine.initialize();
    console.log('✅ Engine initialized successfully\n');

    // Sample employee data
    const sampleEmployees = [
      {
        id: 'EMP001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'Engineering',
        role: 'Senior Software Engineer',
        startDate: '2021-03-15',
        salary: 95000,
        performanceRating: 4.2,
        engagementScore: 3.8,
        managerRating: 4.1,
        skills: 'JavaScript,React,Node.js,AWS,Docker'
      },
      {
        id: 'EMP002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Data Science',
        role: 'Data Scientist',
        startDate: '2020-08-10',
        salary: 85000,
        performanceRating: 4.5,
        engagementScore: 3.2,
        managerRating: 3.8,
        skills: 'Python,Machine Learning,SQL,Tableau,Statistics'
      },
      {
        id: 'EMP003',
        name: 'Mike Wilson',
        email: 'mike.wilson@company.com',
        department: 'Product',
        role: 'Product Manager',
        startDate: '2019-01-20',
        salary: 110000,
        performanceRating: 3.8,
        engagementScore: 4.2,
        managerRating: 4.0,
        skills: 'Product Strategy,Agile,Analytics,Leadership'
      }
    ];

    console.log('📊 Running talent risk analysis...\n');

    // Method 1: Use the run() method (seems to be the main entry point)
    console.log('🎯 Using engine.run() method:');
    const runResults = await engine.run({
      employees: sampleEmployees,
      outputFormat: 'console'
    });
    
    console.log('\n' + '═'.repeat(60));
    console.log('📈 ANALYSIS RESULTS');
    console.log('═'.repeat(60));

    // Method 2: Use analyzeRisk() method
    console.log('\n🔍 Using engine.analyzeRisk() method:');
    const analysisResults = await engine.analyzeRisk({
      employees: sampleEmployees,
      includeSkillAnalysis: true,
      includeFlightRisk: true,
      includeVulnerability: true
    });

    console.log('\nAnalysis completed! Results structure:');
    console.log('Keys:', Object.keys(analysisResults));
    
    // Method 3: Generate and display summary
    console.log('\n📊 Generating summary...');
    const summary = await engine.generateSummary(analysisResults);
    
    console.log('\n🖥️  Displaying summary...');
    await engine.displaySummary(summary);

    console.log('\n✅ Talent Risk Assessment Complete!');

  } catch (error) {
    console.error('❌ Error running talent risk assessment:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the assessment
runTalentRiskAssessment();