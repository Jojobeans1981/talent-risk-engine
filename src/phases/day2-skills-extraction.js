// src/phases/day2-skills-extraction.js
import api from '@api';;

async function extractSkills() {
  try {
    const response = await api.get('/hr-data');
    if (!response?.data) throw new Error('No employee data received');
    return response.data;
  } catch (error) {
    throw new Error(`Extraction failed: ${error.message}`);
  }
}

export default { extractSkills };