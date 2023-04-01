const Contact = require('../models/contactsModel');

/**
 * Get contacts list
 */
const listContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite = false } = req.query;
  const skip = (page - 1) * limit;
  const filters = favorite ? { favorite } : {};
  try {
    // eslint-disable-next-line radix
    const contacts = await Contact.find({ ...filters }).skip(skip).limit(parseInt(limit));

    const total = await Contact.countDocuments({ ...filters });

    res.status(200).json({ contacts, total });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * Get contact by id
 */
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    res.status(200).json({
      contact,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * Delete contact by id.
 */
const removeContact = async (req, res) => {
  try {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * Create contact
 */
const addContact = async (req, res) => {
  try {
    const contactData = {
      name: req.body,
      email: req.body,
      phone: req.body,
      favorite: req.body,
      owner: req.user,
    };
    const newContact = await Contact.create(contactData);

    res.status(201).json({
      contact: newContact,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * Update contact by id.
 */
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      favorite = false,
      owner,
    } = req.body;

    const contact = await Contact.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      favorite,
      owner,
    }, { new: true });

    res.status(200).json({
      contact,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * Choise favorite contacts
 */
const favoriteContacts = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const contactUpdate = await Contact.findByIdAndUpdate(id, favorite, {
      new: true,
    });

    res.status(200).json({ contactUpdate });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  favoriteContacts,
};
