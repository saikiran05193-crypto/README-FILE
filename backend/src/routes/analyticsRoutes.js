const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTrends,
  getHazardDistribution,
  getNodeStatus
} = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/hazard-distribution', getHazardDistribution);
router.get('/node-status', getNodeStatus);

module.exports = router;
