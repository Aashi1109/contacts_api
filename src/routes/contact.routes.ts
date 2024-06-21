import { Router } from "express";
import { asyncHandler } from "@src/middlewares";
import {
  createContact,
  deleteContact,
  deleteContactsContactInfo,
  getContactsByQuery,
  updateContact,
  updateContactsContactInfo,
} from "@src/controllers/contacts.controller";
import {
  validateContactCreate,
  validateContactInfoUpdate,
  validateContactUpdate,
} from "@src/validators";

const router = Router();

router.post("/create", [validateContactCreate], asyncHandler(createContact));
router.get("/query", asyncHandler(getContactsByQuery));
router
  .route("/:id")
  .patch(validateContactUpdate, asyncHandler(updateContact))
  .delete(asyncHandler(deleteContact));
//
router
  .route("/:id/:infoId")
  .patch(validateContactInfoUpdate, asyncHandler(updateContactsContactInfo))
  .delete(asyncHandler(deleteContactsContactInfo));

export default router;
