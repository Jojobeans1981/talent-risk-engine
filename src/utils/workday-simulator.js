/**
 * Workday API Simulator for Development and Testing
 */

const mockEmployeeData = [
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
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Python']
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
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics', 'R']
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
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership', 'SQL']
  },
  {
    id: 'EMP004',
    name: 'Emily Chen',
    email: 'emily.chen@company.com',
    department: 'Engineering',
    role: 'Frontend Developer',
    startDate: '2022-06-01',
    salary: 78000,
    performanceRating: 4.0,
    engagementScore: 4.1,
    managerRating: 3.9,
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Vue.js']
  },
  {
    id: 'EMP005',
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    department: 'Engineering',
    role: 'DevOps Engineer',
    startDate: '2020-11-15',
    salary: 92000,
    performanceRating: 4.3,
    engagementScore: 3.5,
    managerRating: 4.2,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Linux']
  }
];

const mockAPI = async (endpoint, options = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  switch (endpoint) {
    case '/hr-data':
      return mockEmployeeData;
    
    case '/skills-data':
      return mockEmployeeData.map(emp => ({
        employeeId: emp.id,
        skills: emp.skills,
        lastUpdated: new Date().toISOString()
      }));
    
    case '/performance-data':
      return mockEmployeeData.map(emp => ({
        employeeId: emp.id,
        performanceRating: emp.performanceRating,
        engagementScore: emp.engagementScore,
        managerRating: emp.managerRating
      }));
    
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

module.exports = { mockAPI, mockEmployeeData };