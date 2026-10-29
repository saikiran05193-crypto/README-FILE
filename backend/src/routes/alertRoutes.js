const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getActiveAlerts,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert
} = require('../controllers/alertController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', getAlerts);
router.get('/active', getActiveAlerts);

// Emergency alert creation (Only ADMIN and OPERATOR can broadcast)
router.post('/', authenticateToken, requireRole(['ADMIN', 'OPERATOR']), createAlert);

// Alert state mutations (VIEWER can acknowledge alerts)
router.put('/:id/acknowledge', authenticateToken, requireRole(['ADMIN', 'OPERATOR', 'VIEWER']), acknowledgeAlert);
router.put('/:id/resolve', authenticateToken, requireRole(['ADMIN', 'OPERATOR']), resolveAlert);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteAlert);

module.exports = router;
