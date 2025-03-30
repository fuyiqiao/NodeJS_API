const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const commonStudentsController = require('../controllers/commonStudentsController');
const suspendController = require('../controllers/suspendController');
const notificationController = require('../controllers/notificationController');

router.post('/register', registerController.register);
router.get('/commonstudents', commonStudentsController.getCommonStudents);
router.post('/suspend', suspendController.suspend);
router.post('/retrievefornotifications', notificationController.retrieveForNotifications);

module.exports = router;