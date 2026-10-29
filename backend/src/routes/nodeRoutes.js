const express = require('express');
const router = express.Router();
const {
  getNodes,
  getNodeById,
  createNode,
  updateNode,
  deleteNode,
  getNodeReadings,
  getNodeRisks,
  getNodeAlerts
} = require('../controllers/nodeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public or authenticated view routes
router.get('/', getNodes);
router.get('/:id', getNodeById);
router.get('/:id/readings', getNodeReadings);
router.get('/:id/risks', getNodeRisks);
router.get('/:id/alerts', getNodeAlerts);

// Protected ADMIN / OPERATOR mutation routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createNode);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'OPERATOR']), updateNode);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteNode);

module.exports = router;
