// scripts/enrollAdmin.js

const { addAdminIdentity } = require("../fabric/network");

async function main() {
  try {
    await addAdminIdentity();
  } catch (error) {
    console.error(`Error enrolling admin: ${error}`);
  }
}

main();
