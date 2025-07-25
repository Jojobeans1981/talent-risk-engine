const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { TalentRiskAssessor } = require('./core/assessor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize assessor
const assessor = new TalentRiskAssessor();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/assess-team', async (req, res) => {
  try {
    const { employees } = req.body;
    
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid employee data provided' 
      });
    }

    const assessment = await assessor.assessTeam(employees);
    res.json(assessment);
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ 
      error: 'Internal server error during assessment',
      message: error.message 
    });
  }
});

app.post('/api/assess-employee', async (req, res) => {
  try {
    const employee = req.body;
    
    if (!employee || !employee.id) {
      return res.status(400).json({ 
        error: 'Invalid employee data provided' 
      });
    }

    const assessment = await assessor.assessTeam([employee]);
    res.json(assessment.employeeAssessments[0]);
  } catch (error) {
    console.error('Employee assessment error:', error);
    res.status(500).json({ 
      error: 'Internal server error during assessment',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Talent Risk Assessment API running on port ${PORT}`);
  });
}

module.exports = app;
