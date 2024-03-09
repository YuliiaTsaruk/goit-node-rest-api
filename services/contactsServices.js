import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();
export const getContactById = (id) => Contact.findById(id);
export const addContact = (data) => Contact.create(data);
export const removeContact = (id) => Movie.findByIdAndDelete(id);
export const updateContactById = (id, data) =>
  Movie.findByIdAndUpdate(id, data);
// export const addContactToFavorite = () => {};
