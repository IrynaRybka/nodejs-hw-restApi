const express = require('express');

const contactController = require('../../controllers/contactsController');
const contactMiddlewares = require('../../middlewares/contactsMiddlewares');
const authMiddlewares = require('../../middlewares/authMiddlewares');

const router = express.Router();

// Allow next routes only for logged in users
router.use(authMiddlewares.checkLoginUser);

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
