function validate(employees) {
  const errors = [];
  const ids = new Set();

  employees.forEach((emp, index) => {
    if (ids.has(emp.id)) {
      errors.push({
        type: 'duplicate_id',
        employee: emp.id,
        index
      });
    }
    ids.add(emp.id);

    if (emp.skills.length === 0) {
      errors.push({
        type: 'empty_skills',
        employee: emp.id,
        index  
      });
    }
  });

  return errors;
}

export default { validate };