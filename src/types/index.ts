import { Types } from "mongoose";

export interface IUser {
  firstname: string;
  lastname?: string;
  image?: string;
  address?: string;
}

export interface IUserData extends IUser {
  id: string;
  contacts?: IContact[];
}

export interface IContact {
  stdCode: number;
  number: string;
  label: EContactLabels;
  userId?: Types.ObjectId | IUser;
}

export interface IContactData extends IContact {
  id: string;
  userId: Types.ObjectId | IUserData;
}

export interface IContactCreate extends IUser {
  contacts: IContact[];
}

export interface ICloudinaryImageUploadOptions {
  user_filename?: boolean;
  unique_filename?: boolean;
  overwrite?: boolean;
  resource_type?: string | any;
  folder?: string;
}

export enum EContactLabels {
  HOME = "HOME",
  WORK = "WORK",
  MOBILE = "MOBILE",
  OTHER = "OTHER",
}

export interface IErrorResponse {
  success: boolean;
  errors: {
    message: any;
    [key: string]: any;
  };
}
