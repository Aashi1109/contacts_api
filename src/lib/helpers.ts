import { FlattenMaps, Model, Require_id } from "mongoose";

export const getByFilter =
  <T>(model: Model<T>): Function =>
  async (
    /**
     * @inner
     * @param {Object} filter - The filter object to query documents.
     * @param {Partial<Record<keyof T, any>>} filter - Optional dynamic fields to filter by.
     * @param {string[]} populateFields - Array of fields to populate.
     * @param {number} [limit] - Optional limit for the number of documents to return.
     * @param {keyof T} [sortBy] - Optional field to sort by.
     * @param {"asc"|"desc"} [sortOrder] - Optional order to sort (ascending or descending).
     * @param {boolean} [doPopulate=true] - Whether to populate the specified fields.
     * @param {number} [pageNumber=1] - Optional page number for pagination.
     * @param {string} [not] - Optional page number for pagination.
     * @returns {Promise<Require_id<FlattenMaps<T>>[]>} - A promise that resolves to an array of documents matching the query.
     */
    filter: Partial<Record<keyof T, any>>,
    populateFields: string[],
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    doPopulate = true,
    pageNumber?: number,
    not?: string,
  ): Promise<Require_id<FlattenMaps<T>>[]> => {
    try {
      pageNumber ??= 1;
      const skip = limit ? (pageNumber - 1) * limit : 0;

      let query = model.find(filter);

      if (not) {
        // @ts-ignore
        query = query.find({ _id: { $ne: not } });
      }

      if (sortBy && sortOrder) {
        query.sort({ [sortBy]: sortOrder });
      }

      if (limit) {
        query.limit(limit).skip(skip);
      }

      if (doPopulate && populateFields.length > 0) {
        populateFields.forEach((field) => {
          query.populate(field);
        });
      }

      return await query.lean().exec();
    } catch (error) {
      console.error(`Error fetching ${model.modelName}:`, error);
      throw error;
    }
  };

export const addDefaultImageDataURIPrefix = (image: string) => {
  const defaultPrefix = "data:image/jpeg;base64,";
  if (image.startsWith("data:image/")) {
    return image; // Already has a data URI prefix, return as-is
  } else {
    return defaultPrefix + image; // Add default prefix
  }
};
