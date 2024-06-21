import { model, Schema } from "mongoose";
import { EContactLabels, IContact } from "@src/types";

const contactInfoSchema = new Schema<IContact>({
  number: { type: String, required: true, unique: true },
  stdCode: { type: Number, default: 91 },
  label: {
    type: String,
    enum: Object.values(EContactLabels),
    default: EContactLabels.OTHER,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const ContactInfo = model("ContactInfo", contactInfoSchema);

export default ContactInfo;
