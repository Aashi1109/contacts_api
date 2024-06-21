// Create a new contact
import { ContactInfo } from "@src/models";
import { IContact } from "@src/types";
import { Types } from "mongoose";
import logger from "@src/logger";
import { jnstringify } from "@src/lib/utils";

export async function createContactInfo(contactData: IContact) {
  try {
    const contact = new ContactInfo(contactData);
    const _doc = await contact.save();
    return _doc.toObject();
  } catch (error) {
    logger.error(`Failed to create contact: ${error.message}`);
    throw error;
  }
}

// Get a contact by ID
export async function getContactInfoById(contactId: string) {
  try {
    return await ContactInfo.findById(contactId).populate("userId");
  } catch (error) {
    logger.error(`Failed to get contact: ${error.message}`);
    throw error;
  }
}

// Update a contact by ID
export async function updateContactInfo(
  contactId: string,
  updateData: Partial<IContact>,
) {
  try {
    return await ContactInfo.findByIdAndUpdate(contactId, updateData, {
      new: true,
    });
  } catch (error) {
    logger.error(`Failed to update contact: ${error.message}`);
    throw error;
  }
}

// Delete a contact by ID
export async function deleteContactInfo(contactId: string, filter?: any) {
  try {
    return await ContactInfo.deleteMany(filter ?? { _id: contactId });
  } catch (error) {
    logger.error(`Failed to delete contact: ${error.message}`);
    throw error;
  }
}

/**
 * Filters contacts based on the provided criteria.
 * @param {Object} filters - The filter criteria.
 * @param doPopulate - Whether to populate the foreign fields
 * @param {number} [filters.number] - The contact number to filter by.
 * @param {string} [filters.userId] - The user ID to filter by.
 * @param {string} [filters.id] - The ID of the contact to filter.
 * @returns {Promise<Array>} - The filtered contacts.
 */
export async function filterContactInfos(
  filters: {
    userId?: string[] | Types.ObjectId[];
    id?: string[] | Types.ObjectId[];
    number?: string;
  },
  doPopulate?: boolean,
): Promise<InstanceType<typeof ContactInfo>[]> {
  const query: { userId?: Object; _id?: Object; number?: any } = {};

  if (filters.number) {
    query.number = { $regex: new RegExp(filters.number, "i") }; // 'i' option for case-insensitive matching
  }

  if (filters.userId?.length) {
    query.userId = { $in: filters.userId };
  }

  if (filters.id?.length) {
    query._id = { $in: filters.id };
  }
  logger.debug(`Filtering contacts using filters: ${jnstringify(query)}`);
  const _query = ContactInfo.find({
    ...query,
  });
  if (doPopulate) _query.populate({ path: "userId", strictPopulate: false });
  return await _query.exec();
}
