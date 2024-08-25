const express = require('express');
const bugController = require('../controllers/bugController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/bugs', authenticate, bugController.createBug);
router.get('/bugs', authenticate, bugController.getAllBugs);
router.get('/bugs/:id', authenticate, bugController.getBugById);
router.put('/bugs/:id', authenticate, bugController.updateBug);
router.delete('/bugs/:id', authenticate, bugController.deleteBug);

module.exports = router;
