import SkillMapper from './skill-mapper.js';;
const instance = new SkillMapper();

export default {
  mapEmployee: employee => instance.mapEmployeeSkills(employee),
  mapAllEmployees: employees => instance.mapAllEmployees(employees),
  getRecommendations: employee => instance.getPersonalizedRecommendations(employee),
  analyzeDepartment: employees => instance.analyzeDepartmentGaps(employees)
};