import appRequest from "../server.test";
import connectDB from "@src/database/connectDB";
import mongoose from "mongoose";
import { generateDummyData } from "@src/seed";

import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";

describe("Contacts routes", () => {
  beforeEach(async () => {
    await connectDB();
    await generateDummyData(4, 3);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  test("Create contacts", async () => {
    const res = await appRequest.post("/api/contacts/create").send({
      firstname: "John",
      lastname: "Doe",
      contacts: [
        {
          number: "123456789",
          label: "mobile",
        },
        {
          number: "987654321",
          label: "mobile",
        },
      ],
    });

    expect(res.status).toEqual(201);
    const { success, data } = res.body;

    expect(success).toEqual(true);
    expect(data).toHaveProperty("_id");
    expect(data).toHaveProperty("firstname");
    expect(data).toHaveProperty("lastname");
    expect(data).toHaveProperty("contacts");
    expect(data).toHaveProperty("address");
    expect(data).toHaveProperty("image");
    expect(data.firstname).toEqual("John");
    expect(data.lastname).toEqual("Doe");
  });

  test("Update a single contact", async () => {
    // get a random contact and update its value
    const contacts = await appRequest.get("/api/contacts/query");
    const { data: contactsData } = contacts.body;
    const contact = contactsData[0];
    const res = await appRequest.patch(`/api/contacts/${contact._id}`).send({
      lastname: "changed",
    });

    const { success, data } = res.body;
    expect(success).toEqual(true);
    expect(data).toHaveProperty("lastname", "changed");
  });

  test("Delete a contact", async () => {
    // get a random contact and update its value
    const contacts = await appRequest.get("/api/contacts/query");
    const { data: contactsData } = contacts.body;
    const contact = contactsData[0];
    const res = await appRequest.delete(`/api/contacts/${contact._id}`);

    const { success, data } = res.body;

    expect(success).toEqual(true);
    expect(data).toHaveProperty("_id");
    expect(data).toHaveProperty("firstname");
    expect(data).toHaveProperty("lastname");
    expect(data).toHaveProperty("address");
    expect(data).toHaveProperty("image");
    expect(data).toHaveProperty("contacts");
    expect(data.contacts).toBe("object");
    expect(data.contacts).toHaveProperty("acknowledged", "true");
  });

  test("Update a contact's contact info", async () => {
    // get a random contact and update its value
    const contacts = await appRequest.get("/api/contacts/query");
    const { data: contactsData } = contacts.body;
    const contact = contactsData[0];
    const infoId = contact?.contacts[0];
    const res = await appRequest
      .patch(`/api/contacts/${contact._id}/${infoId}`)
      .send({
        label: "HOME",
      });

    const { data, success } = res.body;
    expect(success).toEqual(true);
    expect(data).toHaveProperty("label", "HOME");
  });

  test("Delete a contact's contact info", async () => {
    // get a random contact and update its value
    const contacts = await appRequest.get("/api/contacts/query");
    const { data: contactsData } = contacts.body;
    const contact = contactsData[0];
    const infoId = contact?.contacts[0];
    const res = await appRequest.delete(
      `/api/contacts/${contact._id}/${infoId}`,
    );

    const { data, success } = res.body;
    expect(success).toEqual(true);
    expect(data).toHaveProperty("acknowledged", "true");
    expect(data).toHaveProperty("deletedCount", "1");
  });

  test("Get all contacts", async () => {
    const res = await appRequest.get("/api/contacts/query");

    expect(res.status).toEqual(200);
    const { success, data } = res.body;

    expect(success).toEqual(true);
    expect(data).toBe("array");
    expect(data).toHaveLength(4);
  });
});
