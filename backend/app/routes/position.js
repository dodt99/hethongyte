const express = require('express');

const { position: positionController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/positions', auth, positionController.addPosition);
router.get('/positions', auth, positionController.getAllPosition);
router.put('/positions/:positionId', auth, positionController.updatePosition);
router.delete('/positions/:positionId', auth, positionController.removePosition);

module.exports = router;
