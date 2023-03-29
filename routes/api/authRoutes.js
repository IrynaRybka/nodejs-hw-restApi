const express = require('express');

const authController = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', authMiddleware.checkRegisterData, authController.userRegister);
router.post('/login', authController.loginUser);

module.exports = router;
