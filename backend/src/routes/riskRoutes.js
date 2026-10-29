const express = require('express');
const router = express.Router();
const {
  createRiskAssessment,
  getCurrentRisks,
  getRiskHistory,
  getRisksByNode
} = require('../controllers/riskController');

// Edge AI risk assessment ingestion endpoint
router.post('/', createRiskAssessment);

router.get('/current', getCurrentRisks);
router.get('/history', getRiskHistory);
router.get('/:nodeId', getRisksByNode);

module.exports = router;
