function normalizeEmployee(raw) {
  // Handle different source formats
  const employee = {
    id: String(raw.ID || raw.id || raw.EmployeeID).trim(),
    name: String(raw.Name || raw.name).trim(),
    department: String(raw.Department || raw.department).trim(),
    skills: normalizeSkills(raw.Skills || raw.skills || ''),
    hireDate: raw.HireDate || null,
    position: raw.Position || null
  };

  if (!employee.id || !employee.name || !employee.department) {
    throw new Error('Missing required fields');
  }

  return employee;
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.map(s => s.trim());
  if (typeof skills === 'string') return skills.split(',').map(s => s.trim());
  return [];
}

export default { normalizeEmployee };