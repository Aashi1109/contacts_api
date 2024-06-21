import { model, Schema } from "mongoose";
import { IUser } from "@src/types";

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String },
  address: { type: String },
  image: { type: String },
});

const User = model("User", userSchema);

export default User;
