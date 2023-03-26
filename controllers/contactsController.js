// const fs = require('fs').promises;
// const { v4: uuidv4 } = require('uuid');

const Contacts = require('../models/contactsModel');

/**
 * Get contacts list
 */
const listContacts = async (req, res) => {
  try {
    const contacts = await Contacts.find();

    res.status(200).json({
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
    const contact = await Contacts.findById(id);

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

    await Contacts.findByIdAndDelete(id);

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
    const {
      name,
      email,
      phone,
      favorite,
    } = req.body;
    const newContact = await Contacts.create({
      name,
      email,
      phone,
      favorite,
    });

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
      favorite,
    } = req.body;

    const contact = await Contacts.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      favorite
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

    const contactUpdate = await Contacts.findByIdAndUpdate(id, favorite, {
      new: true,
    });

    res.status(200).json({ contactUpdate });
  } catch (err) {
    res.status(404).json({ message: 'Not found' });
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
