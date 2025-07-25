import { TalentRiskEngine } from './src/index.js';

console.log('🎯 Prometheus Talent Risk Assessment');
console.log('═'.repeat(60));

async function runFormattedDemo() {
  try {
    const engine = new TalentRiskEngine();
    await engine.initialize();

    const employees = [
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

    // Set employee data and run analysis
    engine.employees = employees;
    engine.employeeData = employees;
    
    const results = await engine.analyzeRisk({
      includeSkillAnalysis: true,
      includeFlightRisk: true,
      includeVulnerability: true
    });

    // Display formatted results
    console.log('\n👥 INDIVIDUAL EMPLOYEE ANALYSIS');
    console.log('─'.repeat(60));

    results.analyses.flightRisk.forEach((risk, index) => {
      const employee = employees.find(emp => emp.id === risk.employeeId);
      const vulnerability = results.analyses.vulnerability.find(vuln => vuln.employeeId === risk.employeeId);
      
      console.log(`\n🔍 ${employee.name} (${employee.role})`);
      console.log(`   Department: ${employee.department}`);
      console.log(`   📊 Flight Risk: ${risk.level.toUpperCase()} (${(risk.score * 100).toFixed(1)}%)`);
      console.log(`   ⚠️  Vulnerability: ${vulnerability.level.toUpperCase()} (${(vulnerability.score * 100).toFixed(1)}%)`);
      
      if (risk.recommendations.length > 0) {
        console.log('   💡 Recommendations:');
        risk.recommendations.forEach(rec => console.log(`      • ${rec}`));
      }
      
      console.log('   🎯 Key Risk Factors:');
      Object.entries(risk.factors).forEach(([factor, data]) => {
        const riskLevel = data.risk > 0.6 ? '🔴' : data.risk > 0.4 ? '🟡' : '🟢';
        console.log(`      ${riskLevel} ${factor}: ${(data.risk * 100).toFixed(0)}% risk`);
      });
    });

    console.log('\n\n📈 TEAM SUMMARY');
    console.log('═'.repeat(60));
    console.log(`📊 Total Employees Analyzed: ${results.totalEmployees}`);
    console.log(`🚨 Average Flight Risk: ${(results.summary.flightRisk.averageScore * 100).toFixed(1)}%`);
    console.log(`⚠️  Average Vulnerability: ${(results.summary.vulnerability.averageScore * 100).toFixed(1)}%`);

    console.log('\n🎯 RISK DISTRIBUTION:');
    console.log(`   🔴 High Risk: ${results.summary.flightRisk.high} employees`);
    console.log(`   🟡 Medium Risk: ${results.summary.flightRisk.medium} employees`);
    console.log(`   🟢 Low Risk: ${results.summary.flightRisk.low} employees`);

    console.log('\n🔧 SKILLS ANALYSIS:');
    console.log(`   📚 Total Unique Skills: ${results.analyses.skills.totalUniqueSkills}`);
    console.log(`   ⚠️  Critical Skill Gaps: ${results.summary.skills.criticalGaps}`);
    console.log(`   🚀 Emerging Skills Identified: ${results.summary.skills.emergingSkills}`);

    console.log('\n🔥 TOP SKILLS IN TEAM:');
    results.analyses.skills.skillDistribution.slice(0, 5).forEach(skill => {
      console.log(`   • ${skill.skill}: ${skill.percentage}% of team`);
    });

    console.log('\n📊 SKILL GAPS TO ADDRESS:');
    results.analyses.skills.skillGaps.slice(0, 3).forEach(gap => {
      console.log(`   ⚠️  ${gap.skill}: ${(gap.gap * 100).toFixed(0)}% gap (Priority: ${(gap.priority * 100).toFixed(0)}%)`);
    });

    console.log('\n🚀 EMERGING SKILLS TO WATCH:');
    results.analyses.skills.emergingSkills.forEach(skill => {
      console.log(`   📈 ${skill.skill}: ${(skill.growth * 100).toFixed(0)}% growth, ${(skill.demand * 100).toFixed(0)}% demand`);
    });

    console.log('\n✅ Analysis Complete!');
    console.log(`📅 Generated: ${new Date(results.timestamp).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runFormattedDemo();