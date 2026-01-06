const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const autoTradingController = require('../controllers/autoTradingController');

// Public routes
router.get('/models', autoTradingController.getAvailableModels);

// Protected routes
router.get('/my-model', protect, autoTradingController.getUserModel);
router.get('/stats', protect, autoTradingController.getModelStats);
router.get('/positions', protect, autoTradingController.getCurrentPositions);

router.post('/activate', protect, autoTradingController.activateModel);
router.post('/deactivate', protect, autoTradingController.deactivateModel);
router.post('/close-all', protect, autoTradingController.closeAllPositions);

router.put('/settings', protect, autoTradingController.updateSettings);

module.exports = router;
