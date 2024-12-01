const express = require('express');
const apiController = require('../controllers/api');
const verifyToken = require('../middlewares/verify-token');

const router = express.Router();


router.get('/user-basic', verifyToken, apiController.user_basic);
router.get('/messages/:channel_id/:mess_id?', verifyToken, apiController.get_messages);
router.post('/get-channels', verifyToken, apiController.get_channels);
router.post('/update-channel/:channel_id', verifyToken, apiController.update_channel);


router.post('/add-member/:channel_id/:member_id', verifyToken, apiController.add_member);
router.post('/update-member/:channel_id/:member_id', verifyToken, apiController.update_member);
router.post('/remove-member/:channel_id/:member_id', verifyToken, apiController.remove_member);



module.exports = router;