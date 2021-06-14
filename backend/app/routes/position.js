const express = require('express');

const { position: positionController } = require('../http/controllers');

const router = express.Router();

router.post('/positions', positionController.addPosition);
router.get('/positions', positionController.getAllPosition);
router.put('/positions/:positionId', positionController.updatePosition);
router.delete('/positions/:positionId', positionController.removePosition);

module.exports = router;
