const Contact = require('../models/contactsModel');

/**
 * Get contacts list
 */
const listContacts = async (req, res) => {
  try {
    const {
      sort, order, page, limit, search,
    } = req.query;

    const findOptions = search
      ? { $or: [{ title: { $regex: search, $options: 'i' } }, { desc: { $regex: search, $options: 'i' } }] }
      : {};
    const contactsQuery = Contact.find(findOptions);

    // const todos = await Todo.find().sort(`${order === 'DESC' ? '-' : ''}${sort}`);
    contactsQuery.sort(`${order === 'DESC' ? '-' : ''}${sort}`);

    const paginationPage = +page || 1;
    const paginationLimit = +limit || 20;
    const skip = (paginationPage - 1) * paginationLimit;

    contactsQuery.skip(skip).limit(paginationLimit);

    const contactCount = await Contact.count(findOptions);
    const contacts = await contactsQuery.populate('owner');

    res.status(200).json({
      total: contactCount,
      contacts,
    });
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
