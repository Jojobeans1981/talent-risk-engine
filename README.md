# 🎯 Prometheus Talent Risk Engine

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/prometheus-talent-risk)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

> **Advanced HR Analytics Platform** - AI-powered talent management and risk assessment engine with comprehensive skills analysis, flight risk prediction, and retention insights.

## 🚀 Overview

Prometheus Talent Risk Engine is a sophisticated HR analytics platform that leverages machine learning and data science to provide actionable insights into talent management. The system analyzes employee data across multiple dimensions to predict flight risk, identify skill gaps, and recommend retention strategies.

## ✨ Key Features

### 🎯 **Flight Risk Prediction**
- **Multi-factor Analysis**: 6-dimensional risk assessment including tenure, performance, salary, engagement, promotion timeline, and manager relationships
- **Real-time Scoring**: Dynamic risk scores with automatic level classification (Low/Medium/High)
- **Predictive Recommendations**: AI-generated actionable recommendations for retention strategies

### 🔧 **Skills Intelligence**
- **Comprehensive Skills Mapping**: Automated skill extraction and categorization
- **Gap Analysis**: Identifies critical skill shortages and training opportunities  
- **Emerging Skills Tracking**: Monitors industry trends and future skill demands
- **Team Skill Distribution**: Visual insights into team capabilities and coverage

### ⚠️ **Vulnerability Assessment**
- **Employee Vulnerability Scoring**: Assesses individual risk factors for turnover
- **Critical Role Analysis**: Identifies high-impact positions at risk
- **Succession Planning**: Supports strategic workforce planning initiatives

### 📊 **Advanced Analytics**
- **Team-level Insights**: Aggregate analytics across departments and roles
- **Trend Analysis**: Historical patterns and predictive modeling
- **Executive Dashboards**: Summary views for leadership decision-making
- **Export Capabilities**: Multiple output formats for reporting and integration

## 🛠️ Technical Architecture

### **Core Components**
- **Risk Analyzer**: Multi-dimensional flight risk calculation engine
- **Skills Analyzer**: NLP-powered skill extraction and analysis
- **Vulnerability Calculator**: Employee retention risk assessment
- **Data Pipeline**: Robust CSV and API data ingestion
- **Reporting Engine**: Professional output formatting and visualization

### **Technology Stack**
- **Runtime**: Node.js 16+
- **Architecture**: Modular ES6+ with async/await patterns
- **Data Processing**: CSV parsing, JSON manipulation, statistical analysis
- **Logging**: Structured logging with multiple output levels
- **Testing**: Comprehensive demo scenarios and validation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prometheus-talent-risk.git
cd prometheus-talent-risk

# Install dependencies
npm install

# Initialize data directory
mkdir -p data

# Run the demo
node formatted-demo.js
```

## 🚀 Quick Start

### **Basic Usage**

```javascript
import { TalentRiskEngine } from './src/index.js';

// Initialize the engine
const engine = new TalentRiskEngine();
await engine.initialize();

// Load employee data
const employees = [
  {
    id: 'EMP001',
    name: 'John Smith',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    salary: 95000,
    performanceRating: 4.2,
    engagementScore: 3.8,
    managerRating: 4.1,
    skills: 'JavaScript,React,Node.js,AWS,Docker'
  }
];

// Set data and run analysis
engine.employees = employees;
const results = await engine.analyzeRisk({
  includeSkillAnalysis: true,
  includeFlightRisk: true,
  includeVulnerability: true
});

console.log('Flight Risk:', results.analyses.flightRisk);
console.log('Skills Analysis:', results.analyses.skills);
```

### **CSV Data Loading**

```javascript
// The engine automatically loads from these CSV files:
// - data/employees.csv (employee master data)
// - data/skills.csv (skills taxonomy)
// - data/performance.csv (performance history)
// - data/engagement.csv (engagement survey data)
// - data/compensation.csv (salary and benefits)
// - data/training.csv (learning and development)

const results = await engine.run({
  outputFormat: 'console'
});
```

## 📊 Sample Output

```
🎯 Prometheus Talent Risk Assessment
════════════════════════════════════════════════════════════

👥 INDIVIDUAL EMPLOYEE ANALYSIS
────────────────────────────────────────────────────────────

🔍 John Smith (Senior Software Engineer)
   Department: Engineering
   📊 Flight Risk: MEDIUM (40.5%)
   ⚠️  Vulnerability: MEDIUM (50.0%)
   💡 Recommendations:
      • Investigate engagement issues
      • Consider role adjustment or team change
      • Discuss promotion timeline and requirements
   🎯 Key Risk Factors:
      🟢 tenure: 30% risk
      🟡 performance: 40% risk
      🟢 salary: 20% risk
      🔴 engagement: 70% risk

📈 TEAM SUMMARY
════════════════════════════════════════════════════════════
📊 Total Employees Analyzed: 2
🚨 Average Flight Risk: 46.5%
⚠️  Average Vulnerability: 50.0%

🎯 RISK DISTRIBUTION:
   🔴 High Risk: 0 employees
   🟡 Medium Risk: 2 employees
   🟢 Low Risk: 0 employees
```

## 🔧 Configuration

### **Risk Thresholds**
```javascript
const config = {
  riskThresholds: {
    flightRisk: { low: 0.3, medium: 0.6, high: 0.8 },
    skillVulnerability: { low: 0.25, medium: 0.5, high: 0.75 }
  },
  weights: {
    performance: 0.3,
    engagement: 0.25,
    tenure: 0.2,
    salary: 0.15,
    manager: 0.1
  }
};
```

## 📁 Data Schema

### **Employee Data Format**
```csv
id,name,email,department,role,startDate,salary,performanceRating,engagementScore,managerRating,skills
EMP001,John Smith,john.smith@company.com,Engineering,Senior Software Engineer,2021-03-15,95000,4.2,3.8,4.1,"JavaScript,React,Node.js,AWS"
```

### **Skills Data Format**
```csv
skill,category,level,demand,rarity
JavaScript,Programming,Intermediate,High,Low
Python,Programming,Advanced,Very High,Low
```

## 🎯 Use Cases

- **HR Analytics**: Comprehensive workforce analytics and reporting
- **Retention Strategy**: Proactive identification of flight risk employees
- **Skills Planning**: Strategic workforce development and training programs
- **Succession Planning**: Critical role coverage and backup planning
- **Compensation Analysis**: Market-based salary and equity recommendations
- **Team Optimization**: Department-level insights and recommendations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern JavaScript and Node.js
- Inspired by industry-leading HR analytics platforms
- Designed for enterprise-scale talent management

## 📞 Support

- 📧 Email: support@prometheus-talent.com
- 📖 Documentation: [docs.prometheus-talent.com](https://docs.prometheus-talent.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/prometheus-talent-risk/issues)

---

**Made with ❤️ for better talent management**
