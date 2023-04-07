const express = require('express');

const authController = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddlewares');

const userController = require('../../controllers/userController');

const router = express.Router();

router.post('/register', authMiddleware.checkRegisterData, authController.userRegister);
router.post('/login', authController.loginUser);

router.use(authMiddleware.checkLoginUser);

router.post('/logout', authController.logOutUser);

router.get('/current', userController.currentDataUser);
router.patch('/avatars', authMiddleware.uploadUserPhoto, userController.updateCurrentAvatar);

module.exports = router;
