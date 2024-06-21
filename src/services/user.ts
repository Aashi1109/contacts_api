import { User } from "@src/models";
import { IUser } from "@src/types";
import logger from "@src/logger";

export async function createUser(userData: IUser) {
  try {
    const user = new User(userData);
    const _doc = await user.save();
    return _doc?.toObject();
  } catch (error) {
    logger.error(`Failed to create user: ${error.message}`);
    throw error;
  }
}

// Get a user by ID
export async function getUserById(userId: string) {
  try {
    return (await User.findById(userId))?.toObject();
  } catch (error) {
    logger.error(`Failed to get user: ${error.message}`);
    throw error;
  }
}

// Get all users

// Update a user by ID
export async function updateUser(userId: string, updateData: Partial<IUser>) {
  try {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  } catch (error) {
    logger.error(`Failed to update user: ${error.message}`);
    throw error;
  }
}

// Delete a user by ID
export async function deleteUser(userId: string) {
  try {
    return (await User.findByIdAndDelete(userId))?.toObject();
  } catch (error) {
    logger.error(`Failed to delete user: ${error.message}`);
    throw error;
  }
}

/**
 * Filters users based on provided filters.
 * @param {Object} filters - Filters to apply for querying users.
 * @param {string} [filters.userId] - User ID to filter by.
 * @param {string} [filters.id] - Another ID to filter by.
 * @param {string} [filters.searchText] - Text to search in firstname or lastname.
 * @param {boolean} [doPopulate=false] - Whether to populate userId field.
 * @returns {Promise<IUser[]>} - A Promise that resolves to an array of filtered users.
 * @throws {Error} - Throws an error if there's an issue querying the database.
 */
export const filterUsers = async (
  filters: {
    userId?: string;
    id?: string;
    searchText?: string;
  },
  doPopulate: boolean = false,
): Promise<InstanceType<typeof User>[]> => {
  let query: any = {};

  // Filter by searchText in firstname or lastname
  if (filters.searchText) {
    const searchTextRegex = new RegExp(filters.searchText, "i"); // Case-insensitive regex
    query.$or = [
      { firstname: { $regex: searchTextRegex } },
      { lastname: { $regex: searchTextRegex } },
    ];
  }

  // Filter by userId
  if (filters.userId) {
    query._id = filters.userId; // Assuming userId is a valid ObjectId string
  }

  // Filter by id (assuming another id field)
  if (filters.id) {
    query.anotherId = filters.id; // Replace 'anotherId' with the actual field name
  }
  logger.info("Filtering users with filters: " + JSON.stringify(filters));

  const usersQuery = User.find(query);

  // Populate userId field if doPopulate is true
  if (doPopulate) {
    usersQuery.populate({
      path: "userId",
      options: { strictPopulate: false },
    });
  }

  return await usersQuery.exec();
};
