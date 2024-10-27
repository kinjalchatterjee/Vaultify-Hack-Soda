// scripts/registerPlatform.js

const { addUserIdentity } = require("../fabric/network");

async function main() {
  try {
    const userId = "user1"; // Replace with your user's ID
    await addUserIdentity(userId);
    console.log(`user "${userId}" registered successfully.`);
  } catch (error) {
    console.error(`Error registering user: ${error}`);
  }
}

main();
