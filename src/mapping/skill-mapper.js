// src/mapping/skill-mapper.js

/**
 * Skill Mapping and Taxonomy Engine
 * Maps skills to standardized taxonomy and categories
 */

export class SkillMapper {
  constructor() {
    this.skillTaxonomy = new Map();
    this.skillAliases = new Map();
    this.skillCategories = new Map();
  }

  async initialize() {
    this.buildSkillTaxonomy();
    this.buildSkillAliases();
    this.buildSkillCategories();
  }

  buildSkillTaxonomy() {
    // Technical Skills
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'mongodb',
      'aws', 'docker', 'kubernetes', 'git', 'machine-learning', 'data-science',
      'cybersecurity', 'devops', 'cloud-computing', 'artificial-intelligence'
    ];

    // Soft Skills
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem-solving',
      'critical-thinking', 'adaptability', 'creativity', 'time-management',
      'emotional-intelligence', 'conflict-resolution'
    ];

    // Domain Skills
    const domainSkills = [
      'project-management', 'agile', 'scrum', 'marketing', 'sales',
      'finance', 'accounting', 'hr', 'operations', 'strategy',
      'business-analysis', 'product-management'
    ];

    technicalSkills.forEach(skill => {
      this.skillTaxonomy.set(skill, {
        canonical: skill,
        category: 'technical',
        level: 'standard'
      });
    });

    softSkills.forEach(skill => {
      this.skillTaxonomy.set(skill, {
        canonical: skill,
        category: 'soft',
        level: 'standard'
      });
    });

    domainSkills.forEach(skill => {
      this.skillTaxonomy.set(skill, {
        canonical: skill,
        category: 'domain',
        level: 'standard'
      });
    });
  }

  buildSkillAliases() {
    // Map common aliases to canonical skill names
    const aliases = {
      'js': 'javascript',
      'nodejs': 'node.js',
      'reactjs': 'react',
      'ml': 'machine-learning',
      'ai': 'artificial-intelligence',
      'aws-cloud': 'aws',
      'amazon-web-services': 'aws',
      'project-mgmt': 'project-management',
      'pm': 'project-management',
      'business-dev': 'business-development',
      'biz-dev': 'business-development'
    };

    Object.entries(aliases).forEach(([alias, canonical]) => {
      this.skillAliases.set(alias.toLowerCase(), canonical);
    });
  }

  buildSkillCategories() {
    this.skillCategories.set('technical', {
      name: 'Technical Skills',
      description: 'Programming languages, tools, and technical competencies',
      priority: 'high'
    });

    this.skillCategories.set('soft', {
      name: 'Soft Skills',
      description: 'Interpersonal and behavioral competencies',
      priority: 'high'
    });

    this.skillCategories.set('domain', {
      name: 'Domain Skills',
      description: 'Business and industry-specific knowledge',
      priority: 'medium'
    });
  }

  mapSkill(rawSkill) {
    if (!rawSkill || typeof rawSkill !== 'string') {
      return null;
    }

    const normalized = rawSkill.toLowerCase().trim();
    
    // Check for direct match in taxonomy
    if (this.skillTaxonomy.has(normalized)) {
      return this.skillTaxonomy.get(normalized);
    }

    // Check for alias match
    if (this.skillAliases.has(normalized)) {
      const canonical = this.skillAliases.get(normalized);
      return this.skillTaxonomy.get(canonical);
    }

    // Fuzzy matching for partial matches
    const fuzzyMatch = this.findFuzzyMatch(normalized);
    if (fuzzyMatch) {
      return fuzzyMatch;
    }

    // Return unmapped skill
    return {
      canonical: normalized,
      category: 'unknown',
      level: 'unmapped',
      original: rawSkill
    };
  }

  findFuzzyMatch(skill) {
    const threshold = 0.8;
    
    for (const [canonical, taxonomy] of this.skillTaxonomy.entries()) {
      const similarity = this.calculateSimilarity(skill, canonical);
      if (similarity >= threshold) {
        return {
          ...taxonomy,
          similarity,
          fuzzyMatch: true
        };
      }
    }

    return null;
  }

  calculateSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  mapSkillList(skills) {
    if (!Array.isArray(skills)) {
      return [];
    }

    return skills
      .map(skill => this.mapSkill(skill))
      .filter(mapped => mapped !== null);
  }

  getSkillsByCategory(category) {
    const skills = [];
    
    for (const [skill, taxonomy] of this.skillTaxonomy.entries()) {
      if (taxonomy.category === category) {
        skills.push({
          skill,
          ...taxonomy
        });
      }
    }
    
    return skills;
  }

  getAllCategories() {
    return Array.from(this.skillCategories.entries()).map(([key, category]) => ({
      key,
      ...category
    }));
  }
}

export default SkillMapper;