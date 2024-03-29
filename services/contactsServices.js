import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);
export const getContactById = (filter) => Contact.findOne(filter);
export const addContact = (data) => Contact.create(data);
export const removeContact = (filter) => Contact.findOneAndDelete(filter);
export const updateContactById = (filter, data) =>
  Contact.findOneAndUpdate(filter, data, { new: true });
export const updateFavoriteStatus = (filter, data) =>
  Contact.findOneAndUpdate(filter, data, { new: true });
