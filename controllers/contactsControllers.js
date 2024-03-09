import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
  updateFavoriteStatus,
} from "../services/contactsServices.js";

const getAllContacts = async (req, res) => {
  const contacts = await listContacts();

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const searchedContacts = await getContactById(id);
  if (!searchedContacts) {
    throw HttpError(404);
  }
  res.json(searchedContacts);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await removeContact(id);
  if (!deletedContact) {
    throw HttpError(404);
  }

  res.json(deletedContact);
};

const createContact = async (req, res) => {
  const newContact = await addContact(req.body);

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await updateContactById(id, req.body);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  const status = await updateFavoriteStatus(id, req.body);
  if (!status) {
    throw HttpError(404);
  }
  res.status(200).json(status);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
