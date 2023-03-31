const express = require('express');

const authController = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddlewares');

const { USER_SUBSCRIPTION_ENUM } = require('../../enums');

const router = express.Router();

// Allow next routes only for logged in users
router.use(authMiddleware.checkLoginUser);

// Allow next routes only for users with specified subscription 'business'
router.use(authMiddleware.allowFor(USER_SUBSCRIPTION_ENUM.BUSINESS));

router.post('/register', authMiddleware.checkRegisterData, authController.userRegister);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logOutUser);
router.get('/current', authController.currentDataUser);

module.exports = router;
