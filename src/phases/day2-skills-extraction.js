const { mockAPI } = require('../utils/workday-simulator');

function anonymize(id) {
  const numericId = String(id).replace(/\D/g, '');
  return `anon_${numericId.padStart(4, '0').slice(-4)}`;
}

async function extractSkills() {
  const response = await mockAPI('/hr-data');
  
  if (!response) throw new Error('No API response');
  
  const employees = Array.isArray(response) ? response : response.employees || [];
  if (!employees.length) throw new Error('Empty employee data');

  return employees.map(employee => ({
    employeeId: anonymize(employee.id),
    skills: [...new Set((employee.skills || []).map(s => s.trim()))],
    lastUpdated: new Date().toISOString()
  }));
}

module.exports = { extractSkills };