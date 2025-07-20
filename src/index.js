#!/usr/bin/env node

/**
 * Prometheus Talent Risk Engine
 * Main entry point for the HR talent management and risk assessment system
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import core modules
import { VulnerabilityCalculator } from './analyzers/vulnerability-calculator.js';
import { SkillsAnalyzer } from './analyzers/skills-analyzer.js';
import { RiskAnalyzer } from './analyzers/risk-analyzer.js';
import { DataLoader } from './data/loaders/data-loader.js';
import { CSVLoader } from './data/loaders/csv-loader.js';
import { SkillMapper } from './mapping/skill-mapper.js';
import { Logger } from './utils/logger.js';

class TalentRiskEngine {
  constructor(config = {}) {
    this.config = {
      dataPath: config.dataPath || './data',
      outputPath: config.outputPath || './output',
      logLevel: config.logLevel || 'info',
      ...config
    };
    
    this.logger = new Logger(this.config.logLevel);
    this.vulnerabilityCalculator = new VulnerabilityCalculator();
    this.skillsAnalyzer = new SkillsAnalyzer();
    this.riskAnalyzer = new RiskAnalyzer();
    this.dataLoader = new DataLoader();
    this.csvLoader = new CSVLoader();
    this.skillMapper = new SkillMapper();
    
    this.employees = [];
    this.analysisResults = {};
  }

  /**
   * Initialize the engine and load configuration
   */
  async initialize() {
    this.logger.info('🚀 Initializing Prometheus Talent Risk Engine...');
    
    try {
      // Load package info
      const packagePath = join(__dirname, '../package.json');
      const packageInfo = JSON.parse(readFileSync(packagePath, 'utf8'));
      
      this.logger.info(`📦 ${packageInfo.name} v${packageInfo.version}`);
      this.logger.info(`📝 ${packageInfo.description}`);
      
      // Initialize components
      await this.initializeComponents();
      
      this.logger.info('✅ Engine initialized successfully');
      return true;
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize engine:', error.message);
      throw error;
    }
  }

  /**
   * Initialize all engine components
   */
  async initializeComponents() {
    this.logger.info('🔧 Initializing components...');
    
    // Initialize skill mapper with taxonomy
    await this.skillMapper.initialize();
    
    // Initialize analyzers
    await this.skillsAnalyzer.initialize();
    await this.riskAnalyzer.initialize();
    
    this.logger.info('✅ All components initialized');
  }

  /**
   * Load employee data from various sources
   */
  async loadData(sources = []) {
    this.logger.info('📊 Loading employee data...');
    
    try {
      if (sources.length === 0) {
        // Default data sources
        sources = [
          { type: 'csv', path: join(this.config.dataPath, 'employees.csv') },
          { type: 'csv', path: join(this.config.dataPath, 'skills.csv') },
          { type: 'csv', path: join(this.config.dataPath, 'performance.csv') }
        ];
      }

      for (const source of sources) {
        this.logger.info(`📁 Loading from ${source.path}...`);
        
        let data;
        switch (source.type) {
          case 'csv':
            data = await this.csvLoader.load(source.path);
            break;
          case 'json':
            data = await this.dataLoader.loadJSON(source.path);
            break;
          default:
            this.logger.warn(`⚠️  Unknown data source type: ${source.type}`);
            continue;
        }
        
        // Merge data based on employee ID
        this.mergeEmployeeData(data, source.type);
      }
      
      this.logger.info(`✅ Loaded data for ${this.employees.length} employees`);
      return this.employees;
      
    } catch (error) {
      this.logger.error('❌ Failed to load data:', error.message);
      throw error;
    }
  }

  /**
   * Merge employee data from different sources
   */
  mergeEmployeeData(data, sourceType) {
    if (!Array.isArray(data)) return;
    
    data.forEach(record => {
      const employeeId = record.id || record.employee_id || record.employeeId;
      if (!employeeId) return;
      
      let employee = this.employees.find(emp => emp.id === employeeId);
      if (!employee) {
        employee = { id: employeeId };
        this.employees.push(employee);
      }
      
      // Merge record data into employee
      Object.assign(employee, record);
    });
  }

  /**
   * Run comprehensive talent risk analysis
   */
  async analyzeRisk(options = {}) {
    this.logger.info('🔍 Starting comprehensive risk analysis...');
    
    if (this.employees.length === 0) {
      throw new Error('No employee data loaded. Please load data first.');
    }

    const results = {
      timestamp: new Date().toISOString(),
      totalEmployees: this.employees.length,
      analyses: {
        vulnerability: [],
        skills: [],
        flightRisk: []
      },
      summary: {}
    };

    try {
      // 1. Vulnerability Analysis
      this.logger.info('📊 Running vulnerability analysis...');
      for (const employee of this.employees) {
        const vulnerability = await this.vulnerabilityCalculator.calculateVulnerability(employee);
        results.analyses.vulnerability.push({
          employeeId: employee.id,
          ...vulnerability
        });
      }

      // 2. Skills Analysis
      this.logger.info('🎯 Running skills analysis...');
      const skillsAnalysis = await this.skillsAnalyzer.analyzeWorkforce(this.employees);
      results.analyses.skills = skillsAnalysis;

      // 3. Flight Risk Analysis
      this.logger.info('✈️  Running flight risk analysis...');
      for (const employee of this.employees) {
        const flightRisk = await this.riskAnalyzer.calculateFlightRisk(employee);
        results.analyses.flightRisk.push({
          employeeId: employee.id,
          ...flightRisk
        });
      }

      // 4. Generate Summary
      results.summary = this.generateSummary(results);
      
      this.analysisResults = results;
      this.logger.info('✅ Risk analysis completed successfully');
      
      return results;
      
    } catch (error) {
      this.logger.error('❌ Risk analysis failed:', error.message);
      throw error;
    }
  }

  /**
   * Generate analysis summary
   */
  generateSummary(results) {
    const vulnerability = results.analyses.vulnerability;
    const flightRisk = results.analyses.flightRisk;
    
    return {
      vulnerability: {
        high: vulnerability.filter(v => v.level === 'high').length,
        medium: vulnerability.filter(v => v.level === 'medium').length,
        low: vulnerability.filter(v => v.level === 'low').length,
        averageScore: vulnerability.reduce((sum, v) => sum + v.score, 0) / vulnerability.length
      },
      flightRisk: {
        high: flightRisk.filter(r => r.level === 'high').length,
        medium: flightRisk.filter(r => r.level === 'medium').length,
        low: flightRisk.filter(r => r.level === 'low').length,
        averageScore: flightRisk.reduce((sum, r) => sum + r.score, 0) / flightRisk.length
      },
      skills: {
        totalSkills: results.analyses.skills.totalUniqueSkills || 0,
        criticalGaps: results.analyses.skills.criticalGaps?.length || 0,
        emergingSkills: results.analyses.skills.emergingSkills?.length || 0
      }
    };
  }

  /**
   * Export analysis results
   */
  async exportResults(format = 'json', outputPath = null) {
    if (!this.analysisResults || Object.keys(this.analysisResults).length === 0) {
      throw new Error('No analysis results to export. Run analysis first.');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `talent-risk-analysis-${timestamp}`;
    const fullPath = outputPath || join(this.config.outputPath, `${filename}.${format}`);

    this.logger.info(`📤 Exporting results to ${fullPath}...`);

    try {
      switch (format.toLowerCase()) {
        case 'json':
          await this.dataLoader.saveJSON(fullPath, this.analysisResults);
          break;
        case 'csv':
          await this.csvLoader.save(fullPath, this.analysisResults);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      this.logger.info('✅ Results exported successfully');
      return fullPath;
      
    } catch (error) {
      this.logger.error('❌ Failed to export results:', error.message);
      throw error;
    }
  }

  /**
   * Run the complete talent risk assessment pipeline
   */
  async run(options = {}) {
    try {
      // Initialize
      await this.initialize();
      
      // Load data
      await this.loadData(options.dataSources);
      
      // Run analysis
      const results = await this.analyzeRisk(options.analysisOptions);
      
      // Export results
      if (options.export !== false) {
        await this.exportResults(options.exportFormat || 'json', options.outputPath);
      }
      
      // Display summary
      this.displaySummary(results.summary);
      
      return results;
      
    } catch (error) {
      this.logger.error('❌ Pipeline execution failed:', error.message);
      throw error;
    }
  }

  /**
   * Display analysis summary to console
   */
  displaySummary(summary) {
    console.log('\n📊 TALENT RISK ANALYSIS SUMMARY');
    console.log('================================');
    
    console.log('\n🚨 Vulnerability Distribution:');
    console.log(`   High Risk: ${summary.vulnerability.high} employees`);
    console.log(`   Medium Risk: ${summary.vulnerability.medium} employees`);
    console.log(`   Low Risk: ${summary.vulnerability.low} employees`);
    console.log(`   Average Score: ${summary.vulnerability.averageScore.toFixed(2)}`);
    
    console.log('\n✈️  Flight Risk Distribution:');
    console.log(`   High Risk: ${summary.flightRisk.high} employees`);
    console.log(`   Medium Risk: ${summary.flightRisk.medium} employees`);
    console.log(`   Low Risk: ${summary.flightRisk.low} employees`);
    console.log(`   Average Score: ${summary.flightRisk.averageScore.toFixed(2)}`);
    
    console.log('\n🎯 Skills Analysis:');
    console.log(`   Total Skills: ${summary.skills.totalSkills}`);
    console.log(`   Critical Gaps: ${summary.skills.criticalGaps}`);
    console.log(`   Emerging Skills: ${summary.skills.emergingSkills}`);
    
    console.log('\n================================\n');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  const engine = new TalentRiskEngine({
    logLevel: process.env.LOG_LEVEL || 'info'
  });

  try {
    switch (command) {
      case 'run':
        await engine.run();
        break;
        
      case 'analyze':
        await engine.initialize();
        await engine.loadData();
        const results = await engine.analyzeRisk();
        console.log(JSON.stringify(results, null, 2));
        break;
        
      case 'load':
        await engine.initialize();
        const employees = await engine.loadData();
        console.log(`Loaded ${employees.length} employees`);
        break;
        
      case 'help':
        console.log(`
Prometheus Talent Risk Engine

Usage: node src/index.js [command]

Commands:
  run      - Run complete analysis pipeline (default)
  analyze  - Run analysis and output results to console
  load     - Load and validate data only
  help     - Show this help message

Environment Variables:
  LOG_LEVEL - Set logging level (debug, info, warn, error)
  DATA_PATH - Path to data directory
  OUTPUT_PATH - Path for output files
        `);
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use "node src/index.js help" for usage information');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export { TalentRiskEngine };
export default TalentRiskEngine;

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}