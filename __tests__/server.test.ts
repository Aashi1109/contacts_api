import { agent as request } from "supertest";
import app from "@src/app";

const appRequest = request(app);

export default appRequest;
