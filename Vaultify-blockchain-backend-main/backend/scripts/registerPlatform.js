// scripts/registerPlatform.js

const { addPlatformIdentity } = require("../fabric/network");

async function main() {
  try {
    const platformId = "famazon"; // Replace with your platform's ID
    await addPlatformIdentity(platformId);
    console.log(`Platform "${platformId}" registered successfully.`);
  } catch (error) {
    console.error(`Error registering platform: ${error}`);
  }
}

main();
