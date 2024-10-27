// fabric/network.js

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

// Path to the connection profile
const ccpPath = path.resolve(__dirname, "./", "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
const cert = fs.readFileSync(
  path.resolve(__dirname, "./", "ecdsa-certificate.pem"),
  "utf8"
);
const pKey = fs.readFileSync(
  path.resolve(__dirname, "./", "ecdsa-private-key.pem"),
  "utf8"
);

// Path to the admin crypto material
const certPath = path.resolve(
  __dirname,
  "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
);
const keyPath = path.resolve(
  __dirname,
  "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/priv_sk"
);

// Read the certificate and private key
const admincert = fs.readFileSync(certPath, "utf8");
const adminPKey = fs.readFileSync(keyPath, "utf8");

// Function to get contract for a user
async function getContractForUser(userId) {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user identity exists in the wallet
    const identity = await wallet.get(userId);
    if (!identity) {
      throw new Error(
        `An identity for the user "${userId}" does not exist in the wallet. Register the user first.`
      );
    }

    // Create a new gateway for connecting to the peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network
    const contract = network.getContract("accesscontrol");

    return { contract, gateway };
  } catch (error) {
    console.error(`Failed to get contract for user "${userId}": ${error}`);
    throw error;
  }
}

// Function to get contract for a platform
async function getContractForPlatform(platformId) {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if platform identity exists in the wallet
    const identity = await wallet.get(platformId);
    if (!identity) {
      throw new Error(
        `An identity for the platform "${platformId}" does not exist in the wallet. Register the platform first.`
      );
    }

    // Create a new gateway for connecting to the peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: platformId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network
    const contract = network.getContract("accesscontrol");

    return { contract, gateway };
  } catch (error) {
    console.error(
      `Failed to get contract for platform "${platformId}": ${error}`
    );
    throw error;
  }
}

// Function to simulate adding an admin identity to the wallet
async function addAdminIdentity() {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already added the admin user.
    const identity = await wallet.get("admin");
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Simulate adding the admin identity
    const x509Identity = {
      credentials: {
        certificate: admincert,
        privateKey: adminPKey,
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("admin", x509Identity);
    console.log('Successfully added admin user "admin" to the wallet');
  } catch (error) {
    console.error(`Failed to add admin user "admin": ${error}`);
    throw error;
  }
}

// Function to simulate adding a user identity to the wallet
async function addUserIdentity(userId) {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already added the user.
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(
        `An identity for the user "${userId}" already exists in the wallet`
      );
      return;
    }

    // Simulate adding the user identity
    const x509Identity = {
      credentials: {
        certificate: admincert,
        privateKey: adminPKey,
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put(userId, x509Identity);
    console.log(`Successfully added user "${userId}" to the wallet`);

    const { contract, gateway } = await getContractForAdmin();

    // Register the user in the ledger
    await contract.submitTransaction("registerUser", userId);
    console.log(`User "${userId}" registered successfully`);
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to add user "${userId}": ${error}`);
    throw error;
  }
}

// Function to simulate adding a platform identity to the wallet
async function addPlatformIdentity(platformId) {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already added the platform.
    const platformIdentity = await wallet.get(platformId);
    if (platformIdentity) {
      console.log(
        `An identity for the platform "${platformId}" already exists in the wallet`
      );
      return;
    }

    // Simulate adding the platform identity
    const x509Identity = {
      credentials: {
        certificate: admincert,
        privateKey: adminPKey,
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put(platformId, x509Identity);
    console.log(`Successfully added platform "${platformId}" to the wallet`);

    const { contract, gateway } = await getContractForAdmin();

    // Register the platform in the ledger
    await contract.submitTransaction("registerPlatform", platformId);
    console.log(`Platform "${platformId}" registered successfully`);
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to add platform "${platformId}": ${error}`);
    throw error;
  }
}

async function getContractForAdmin() {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if admin identity exists in the wallet
    const identity = await wallet.get("admin");
    if (!identity) {
      throw new Error(
        `An identity for the admin does not exist in the wallet. Register the admin first.`
      );
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("accesscontrol");

    return { contract, gateway };
  } catch (error) {
    console.error(`Failed to get contract for admin: ${error}`);
    throw error;
  }
}

module.exports = {
  addUserIdentity,
  getContractForUser,
  getContractForPlatform,
  addPlatformIdentity,
  addAdminIdentity,
};
