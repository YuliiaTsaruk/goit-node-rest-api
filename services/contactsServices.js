import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();
export const getContactById = (id) => Contact.findById(id);
export const addContact = (data) => Contact.create(data);
export const removeContact = (id) => Contact.findByIdAndDelete(id);
export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
export const updateFavoriteStatus = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
