const { getContractForUser } = require("../fabric/network");

async function main() {
  try {
    const { contract, gateway } = await getContractForUser("user1");
    const timestamp = new Date().toISOString();
    await contract.submitTransaction(
      "grantAccess",
      "user1",
      "famazon",
      timestamp
    );

    await gateway.disconnect();

    console.log("Access granted to famazon");
  } catch (error) {
    console.log("Grant access error:", error);
  }
}

main();
