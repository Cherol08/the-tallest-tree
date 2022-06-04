const express = require('express');
const router = express();
const userController = require('../controllers/userController')

router.get('/', userController.getUsers)
router.post('/createUser', userController.createUser)

module.exports = router; 