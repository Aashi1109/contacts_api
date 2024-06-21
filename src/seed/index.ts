import mongoose from "mongoose";
import { ContactInfo, User } from "@src/models";
import { faker } from "@faker-js/faker";
import { EContactLabels } from "@src/types";
import connectDB from "@src/database/connectDB";

export const generateDummyData = async (
  usersCount: number,
  contactsPerUserCount: number,
  clearDb = true,
) => {
  // Drop data in tables
  if (clearDb) {
    await User.deleteMany({});
    await ContactInfo.deleteMany({});
  }
  // Number of dummy entries to create
  for (let i = 0; i < usersCount; i++) {
    const user = new User({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      address: faker.location.streetAddress(),
      image: faker.image.avatar(),
    });

    await user.save();
    console.log(`User created: ${user.firstname} ${user.lastname}`);

    for (let j = 0; j < contactsPerUserCount; j++) {
      const contactInfo = new ContactInfo({
        number: faker.helpers.fromRegExp("[1-9]{6,10}"), // Ensures a 10 digit number
        stdCode: faker.number.int({ min: 0, max: 150 }),
        label: faker.helpers.arrayElement(Object.values(EContactLabels)),
        userId: user._id,
      });

      await contactInfo.save();
      console.log(
        `Contact created for user ${user._id}: ${contactInfo.number}`,
      );
    }
  }
};

// Main Function
const main = async () => {
  try {
    await connectDB();
    await generateDummyData(20, 3);
    console.log("Dummy data generation complete");
  } catch (error) {
    console.error("Error generating dummy data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

main();
