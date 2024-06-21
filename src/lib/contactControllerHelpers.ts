import {ClientError, NotFoundError} from "@src/exceptions";
import {getUserById} from "@src/services/user";
import {addDefaultImageDataURIPrefix} from "@src/lib/helpers";
import {uploadFileToCloudinary} from "@src/lib/cloudinary";
import logger from "@src/logger";
import {Types} from "mongoose";
import {IContact, IContactData, IUserData} from "@src/types";
import {createContactInfo, filterContactInfos,} from "@src/services/contactInfo";

/**
 * Check if a user exists by ID.
 * @param {string} userId - The ID of the user to check.
 * @returns {Promise<any>} - The existing user data.
 * @throws {NotFoundError} - If the user does not exist.
 */
export const ensureUserExists = async (userId: string): Promise<any> => {
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    throw new NotFoundError(`User with id: ${userId} does not exist`);
  }
  return existingUser;
};

/**
 * Upload image to Cloudinary.
 * @param {string} image - The image to upload.
 * @returns {Promise<string | null>} - The Cloudinary URL of the uploaded image.
 */
export const uploadImage = async (image: string): Promise<string | null> => {
  if (image) {
    const modifiedBase64 = addDefaultImageDataURIPrefix(image);
    const uploadResult = await uploadFileToCloudinary(modifiedBase64);
    logger.info(`Image upload result: ${JSON.stringify(uploadResult)}`);
    return uploadResult?.secure_url || null;
  }
  return null;
};

/**
 * Validate a number.
 * @param {string} number - The number to validate.
 * @throws {ClientError} - If the number is not valid.
 */
export const validateNumber = (number: string): void => {
  if (isNaN(Number(number))) {
    throw new ClientError(`Number is not valid: ${number}`);
  }
};

/**
 * Checks if the contact numbers in the provided list are unique.
 * Throws a ClientError if a duplicate contact number is found.
 * @param {IContact[]} contacts - Array of contacts to check for uniqueness.
 * @returns {Promise<void>}
 * @throws {ClientError} If a contact number already exists in the database.
 */
export const checkUniqueNumbers = async (
  contacts: IContact[],
): Promise<void> => {
  const existingContacts = await filterContactInfos({}); // Fetch all existing contacts
  const contactNumbers = existingContacts.map((contact) => contact.number); // Extract existing contact numbers

  for (const contact of contacts) {
    if (contactNumbers.includes(contact.number)) {
      throw new ClientError(
        `Contact with number ${contact.number} already exists`,
      );
    }
  }
};

/**
 * Creates new contact information entries for a given user.
 * @param {IContact[]} contacts - Array of contacts to create for the user.
 * @param {Types.ObjectId} userId - ID of the user for whom contacts are being created.
 * @returns {Promise<any[]>} Array of newly created contact information objects.
 */
export const createNewContactsInfos = async (
  contacts: IContact[],
  userId: Types.ObjectId,
): Promise<any[]> => {
  const newContacts = contacts.map((contact) =>
    createContactInfo({
      ...contact,
      userId: userId,
    }),
  );
  return await Promise.all(newContacts);
};

/**
 * Groups contact information by userId.
 * @param {IContactData[]} contacts - Array of contact objects with userId.
 * @returns {Array<any>} Array of objects with userId and contacts grouped by userId.
 */
export const groupContactsByUserId = (contacts: IContactData[]): Array<any> => {
  const groupedContacts = {};

  contacts.forEach((contact) => {
    const {
      id: userId,
      firstname,
      lastname,
      image,
      address,
    } = contact.userId as IUserData;

    if (!groupedContacts[userId as string]) {
      groupedContacts[userId as string] = {
        _id: userId,
        firstname,
        lastname,
        image,
        address,
        contacts: [],
      };
    }

    groupedContacts[userId as string].contacts.push({
      _id: contact.id,
      number: contact.number,
      stdCode: contact.stdCode,
      label: contact.label,
    });
  });

  return Object.values(groupedContacts);
};
