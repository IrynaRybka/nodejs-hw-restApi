const express = require('express');

const contactController = require('../../controllers/contactsController');
const contactMiddlewares = require('../../middlewares/contactsMiddlewares');
const authMiddlewares = require('../../middlewares/authMiddlewares');

const { USER_SUBSCRIPTION_ENUM } = require('../../enums');

const router = express.Router();

// Allow next routes only for logged in users
router.use(authMiddlewares.checkLoginUser);

// Allow next routes only for users with specified subscription 'business'
router.use(authMiddlewares.allowFor(USER_SUBSCRIPTION_ENUM.BUSINESS));

router
  .route('/')
  .post(contactMiddlewares.checkContactData, contactController.addContact)
  .get(contactController.listContacts);

router
  .route('/:id')
  .get(contactController.getContactById)
  .put(contactMiddlewares.checkContactId, contactController.updateContact)
  .delete(contactController.removeContact);

router
  .route('/:id/favorite')
  .patch(contactMiddlewares.checkFavoriteContact, contactController.favoriteContacts);

module.exports = router;
