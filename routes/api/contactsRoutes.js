const express = require('express');

const contactController = require('../../controllers/contactsController');
const contactMiddlewares = require('../../middlewares/contactsMiddlewares');

const router = express.Router();

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
