import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const searchedContacts = await getContactById(id);
    if (!searchedContacts) {
      throw HttpError(404);
    }
    res.json(searchedContacts);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      throw HttpError(404);
    }

    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const updatedContact = await updateContactById(id, req.body);
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
