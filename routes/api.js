const express = require('express');
const apiController = require('../controllers/api');
const verifyToken = require('../middlewares/verify-token');

const router = express.Router();


router.get('/user-basic', verifyToken, apiController.user_basic);
router.post('/get-channels', verifyToken, apiController.get_channels);


module.exports = router;