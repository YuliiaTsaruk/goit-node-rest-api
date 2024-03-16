import { query } from "express";
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
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await listContacts({ owner }, { skip, limit });

  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const searchedContacts = await getContactById({ _id: id, owner });
  if (!searchedContacts) {
    throw HttpError(404);
  }
  res.json(searchedContacts);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await removeContact({ _id: id, owner });
  if (!deletedContact) {
    throw HttpError(404);
  }

  res.json(deletedContact);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await addContact({ ...req.body, owner });

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await updateContactById({ _id: id, owner }, req.body);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const status = await updateFavoriteStatus({ _id: id, owner }, req.body);
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
