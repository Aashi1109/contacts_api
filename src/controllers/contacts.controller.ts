import {Request, Response} from "express";
import logger from "@src/logger";
import {IContactCreate, IContactData} from "@src/types";
import {ClientError, NotFoundError} from "@src/exceptions";
import {createUser, deleteUser, filterUsers, updateUser,} from "@src/services/user";
import {deleteContactInfo, filterContactInfos, getContactInfoById, updateContactInfo,} from "@src/services/contactInfo";
import {
    checkUniqueNumbers,
    createNewContactsInfos,
    ensureUserExists,
    groupContactsByUserId,
    uploadImage,
    validateNumber,
} from "@src/lib/contactControllerHelpers";

/**
 * Create a new contact.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the created contact.
 */
export const createContact = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  logger.info("Request received: " + req.path);
  const { image, firstname, lastname, contacts, address } =
    req.body as IContactCreate;

  const cloudinaryUrl = await uploadImage(image);

  if (!contacts || !contacts.length) {
    throw new ClientError("Contacts are required");
  }

  const newUser = await createUser({
    firstname,
    lastname,
    address,
    image: cloudinaryUrl,
  });

  await checkUniqueNumbers(contacts);

  const newCreatedInfos = await createNewContactsInfos(contacts, newUser?._id);

  return res.status(201).json({
    success: true,
    message: "Contact created successfully",
    data: { ...newUser, contacts: newCreatedInfos },
  });
};

/**
 * Delete a contact.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the deleted contact.
 */
export const deleteContact = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const deletedUser = await deleteUser(id);
  if (!deletedUser) {
    throw new NotFoundError(`Contact ${id} does not exist`);
  }
  const deleteContacts = await deleteContactInfo("", { userId: id });

  return res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
    data: { ...deletedUser, contacts: deleteContacts },
  });
};

/**
 * Update a contact.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the updated contact.
 */
export const updateContact = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { image, firstname, lastname, contacts, address } =
    req.body as IContactCreate;

  if (contacts) await checkUniqueNumbers(contacts);

  const existingUser = await ensureUserExists(id);
  const cloudinaryUrl = await uploadImage(image);

  const updatedUser = await updateUser(id, {
    image: cloudinaryUrl || existingUser.image,
    address: address || existingUser.address,
    firstname: firstname || existingUser.firstname,
    lastname: lastname || existingUser.lastname,
  });

  const returnData: any = { ...updatedUser };
  if (contacts) {
    returnData.newContacts = await createNewContactsInfos(contacts, id as any);
  }

  return res.status(200).json({
    success: true,
    message: "Contacts updated successfully",
    data: returnData,
  });
};

/**
 * Update contact info of a specific contact.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the updated contact info.
 */
export const updateContactsContactInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id, infoId } = req.params;
  const { number, label, stdCode } = req.body;

  await ensureUserExists(id);
  const existingContactInfo = await getContactInfoById(infoId);
  if (!existingContactInfo) {
    throw new NotFoundError(`Contact with id: ${infoId} does not exist`);
  }

  const updatedContactInfo = await updateContactInfo(infoId, {
    number: number || existingContactInfo.number,
    label: label || existingContactInfo.label,
    stdCode: stdCode || existingContactInfo.stdCode,
  });

  return res.status(200).json({
    success: true,
    message: "Contact info updated successfully",
    data: updatedContactInfo,
  });
};

/**
 * Delete contact info of a specific contact.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the deleted contact info.
 */
export const deleteContactsContactInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id, infoId } = req.params;

  const existingContactInfo = await filterContactInfos({
    id: [infoId],
    userId: [id],
  });
  if (!existingContactInfo?.length) {
    throw new NotFoundError(`Contact info with id: ${infoId} does not exist`);
  }

  const deletedContactInfo = await deleteContactInfo(infoId);

  return res.status(200).json({
    success: true,
    message: "Contact info deleted successfully",
    data: deletedContactInfo,
  });
};

/**
 * Get contacts by query parameters.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the filtered contacts.
 */
export const getContactsByQuery = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, userId, infoId, number } = req.query;
  const query: { userId?: any[]; id?: any[]; number?: string } = {};
  let filteredIds: string[] = [];

  if (number) validateNumber(number as string);

  if (userId) {
    const existingUser = await ensureUserExists(userId as string);
    const contacts = await filterContactInfos({ userId: [userId as string] });
    return res
      .status(200)
      .json({ success: true, data: [{ ...existingUser, contacts }] });
  }

  if (name) {
    const filteredUsers = await filterUsers({ searchText: name as string });
    const userIds = filteredUsers.map((user) => user._id.toString());
    filteredIds.push(...userIds);
  }

  if (infoId) query.id = [infoId as string];
  if (number) query.number = String(number);
  if (filteredIds.length) query.userId = filteredIds;

  logger.debug(`Query created to filter contacts: ${JSON.stringify(query)}`);

  const contacts = await filterContactInfos(query, true);
  const formattedContactsData = groupContactsByUserId(
    contacts as IContactData[],
  );

  logger.debug(
    `Response data to send: ${JSON.stringify(formattedContactsData)}`,
  );
  return res.status(200).json({ success: true, data: formattedContactsData });
};
