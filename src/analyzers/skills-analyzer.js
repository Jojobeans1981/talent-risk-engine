class SkillsAnalyzer {
  constructor(marketData = {}) {
    // Ensure marketData is properly formatted
    this.marketData = {};
    Object.entries(marketData).forEach(([skill, value]) => {
      this.marketData[skill.toLowerCase()] = typeof value === 'number' ? value : 0.5;
    });
  }

  normalizeSkillName(skill) {
    if (typeof skill !== 'string') return '';
    return skill.trim().toLowerCase();
  }

  // Helper method to ensure we always work with arrays
  ensureSkillArray(skills) {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.map(s => this.normalizeSkillName(s));
    if (typeof skills === 'string') return skills.split(',').map(s => this.normalizeSkillName(s));
    return [];
  }

   calculateMarketDemand(skills) {
    const validSkills = this.ensureSkillArray(skills);
    if (!validSkills.length) return 0.5; // Default value when no skills
    
    let totalDemand = 0;
    let count = 0;
    
    validSkills.forEach(skill => {
      // Lookup demand in normalized skill name format
      const normalizedSkill = this.normalizeSkillName(skill);
      const demand = this.marketData[normalizedSkill] ?? 0.5;
      totalDemand += demand;
      count++;
    });

    return count > 0 ? totalDemand / count : 0.5;
  }

 analyzeIndividualSkills(employee, context) {
    const { skills } = employee;
    const { marketData } = context;
    
    if (!skills || !marketData?.skillDemand) {
      return { avgMarketDemand: 0 };
    }

    const validSkills = skills.filter(skill => skill in marketData.skillDemand);
    const total = validSkills.reduce((sum, skill) => sum + marketData.skillDemand[skill], 0);
    const avgMarketDemand = validSkills.length > 0 ? total / validSkills.length : 0;

    return {
      avgMarketDemand,
      criticalSkills: validSkills.filter(skill => marketData.skillDemand[skill] > 0.8)
    };
  }

  analyzeSkillDiversity(skillArrays) {
  const defaultResult = {
    avgSkillsPerEmployee: 0,
    totalUniqueSkills: 0,
    avgSkillOverlap: 0,
    diversityScore: 0
  };

  if (!Array.isArray(skillArrays)) {
    return defaultResult;
  }

  // Normalize and deduplicate skills within each employee first
  const validatedArrays = skillArrays
    .map(arr => [...new Set(this.ensureSkillArray(arr))]) // Dedupe per employee
    .filter(arr => arr.length > 0);

  if (validatedArrays.length === 0) {
    return defaultResult;
  }

  const allSkills = validatedArrays.flat();
  const uniqueSkills = new Set(allSkills);
  const n = validatedArrays.length;

  // Calculate skill overlap
  let totalOverlap = 0, pairCount = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const setI = new Set(validatedArrays[i]);
      const setJ = new Set(validatedArrays[j]);
      const intersection = [...setI].filter(skill => setJ.has(skill));
      totalOverlap += intersection.length;
      pairCount++;
    }
  }

  // Calculate diversity score
  const skillCounts = {};
  allSkills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });

  let diversityScore = 0;
  const totalSkills = allSkills.length;
  Object.values(skillCounts).forEach(count => {
    const p = count / totalSkills;
    if (p > 0) diversityScore -= p * Math.log2(p);
  });

  return {
    avgSkillsPerEmployee: allSkills.length / n,
    totalUniqueSkills: uniqueSkills.size,
    avgSkillOverlap: pairCount > 0 ? totalOverlap / pairCount : 0,
    diversityScore: diversityScore
  };
}
  categorizeSkill(skill) {
    for (const [category, skills] of Object.entries(this.skillCategories)) {
      if (skills.includes(skill)) return category;
    }
    return 'Other';
  }

  categorizeSkills(skills) {
    const categorized = {};
    skills.forEach(skill => {
      const category = this.categorizeSkill(skill);
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push(skill);
    });
    return categorized;
  }

  analyzeSoftSkills(skills) {
    // Assuming soft skills are identified by type or name
    return skills
      .filter(skill => typeof skill === 'object' ? skill.type === 'soft' : false)
      .map(skill => ({
        name: skill.name,
        level: skill.proficiency,
        relevance: this.calculateSoftSkillRelevance(skill.name)
      }));
  }

  analyzeTeamSkills(employees) {
    const allSkills = this.extractAllSkills(employees);
    const uniqueSkills = [...new Set(allSkills)];
    const skillDistribution = this.calculateSkillDistribution(allSkills, employees.length);
    const skillGaps = this.identifySkillGaps(skillDistribution);
    const diversity = this.analyzeSkillDiversity(employees.map(e => this.ensureSkillArray(e.skills)));
    const marketAlignment = this.assessMarketAlignment(uniqueSkills);

    const recommendations = this.generateTeamRecommendations(skillGaps, diversity, marketAlignment);

    return {
      totalEmployees: employees.length,
      totalUniqueSkills: uniqueSkills.length,
      skillDistribution,
      skillGaps,
      diversity,
      marketAlignment,
      recommendations,
      avgSkillsPerEmployee: allSkills.length / Math.max(employees.length, 1)
    };
  }

  normalizeSkills(skills) {
    if (typeof skills === 'string') {
      return skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    const aliasMap = {
      'js': 'JavaScript',
      'reactjs': 'React',
      'nodejs': 'Node.js'
    };
    return (skills || []).map(s => aliasMap[s.trim().toLowerCase()] || s.trim()).filter(Boolean);
  }

  extractAllSkills(employees) {
    return employees.flatMap(emp => this.ensureSkillArray(emp.skills));
  }

  calculateSkillDistribution(allSkills, teamSize) {
    const freq = {};
    allSkills.forEach(skill => {
      freq[skill] = (freq[skill] || 0) + 1;
    });
    return Object.entries(freq).map(([skill, count]) => ({
      skill,
      count,
      percentage: Math.round((count / teamSize) * 10000) / 100
    }));
  }

  identifySkillGaps(skillDistribution) {
    return skillDistribution.filter(s => s.percentage < 20);
  }

  assessMarketAlignment(skills) {
    const demand = skills.map(skill => this.skillMarketDemand[skill] || 0.5);
    return demand.length ? (demand.reduce((a, b) => a + b, 0) / demand.length) : 0;
  }

  analyzeTechnicalSkills(skills) {
    return {
      avgYearsExperience: 5,
      avgSalary: 100000,
      avgYearsInRole: 3,
      avgYearsInCompany: 5,
      avgYearsInIndustry: 10
    };
  }

  generateTeamRecommendations(skillGaps, diversity, marketAlignment) {
    const recs = [];
    if (skillGaps.length > 0) recs.push(`Fill ${skillGaps.length} underrepresented skill(s)`);
    if (diversity && diversity.totalUniqueSkills < 10) recs.push('Encourage broader skill development');
    if (marketAlignment < 0.6) recs.push('Realign team skills with market demand');
    if (recs.length === 0) recs.push('Skill distribution appears balanced');
    return recs;
  }

  generateIndividualRecommendations(skills, avgMarketDemand) {
    const recommendations = [];
    const validSkills = this.ensureSkillArray(skills);

    if (avgMarketDemand < 0.65) {
      recommendations.push('Consider upskilling in high-demand technologies.');
    } else if (avgMarketDemand > 0.85) {
      recommendations.push('Retain and mentor junior staff in these high-demand areas.');
    }

    const lowDemandSkills = validSkills.filter(skill => (this.skillMarketDemand[skill] || 0.5) < 0.6);
    if (lowDemandSkills.length > 0) {
      recommendations.push(`Reevaluate low-demand skills: ${lowDemandSkills.join(', ')}`);
    }

    const highDemandMissing = Object.entries(this.skillMarketDemand)
      .filter(([skill, demand]) => demand > 0.8 && !validSkills.includes(skill))
      .map(([skill]) => skill)
      .slice(0, 3);

    if (highDemandMissing.length > 0) {
      recommendations.push(`Explore high-demand skills: ${highDemandMissing.join(', ')}`);
    }

    if (validSkills.length < 3) {
      recommendations.push('Expand skill set for greater versatility.');
    } else if (validSkills.length > 10) {
      recommendations.push('Focus on deepening expertise in critical skills.');
    }

    return recommendations;
  }

  calculateDiversityIndex(skills) {
    const validSkills = this.ensureSkillArray(skills);
    const skillCounts = {};
    validSkills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
    
    const total = validSkills.length;
    let diversity = 0;
    
    Object.values(skillCounts).forEach(count => {
      const proportion = count / total;
      if (proportion > 0) {
        diversity -= proportion * Math.log2(proportion);
      }
    });
    
    return diversity;
  }

  buildTeamSkillsMap(employees) {
    const skillsMap = {};
    
    employees.forEach(employee => {
      const skills = this.ensureSkillArray(employee.skills);
      
      skills.forEach(skill => {
        if (!skillsMap[skill]) {
          skillsMap[skill] = {
            count: 0,
            employees: [],
            categories: this.categorizeSkill(skill)
          };
        }
        
        skillsMap[skill].count++;
        skillsMap[skill].employees.push(employee.id);
      });
    });
    
    return skillsMap;
  }

  // Added missing method
  calculateSoftSkillRelevance(skillName) {
    // Implement your relevance calculation logic
    return 0.8; // Example value
  }
}

module.exports = SkillsAnalyzer;