// This file is the entry point for the chaincode. It defines the chaincode class and the methods that can be invoked by the client.

"use strict"; // Enforce use of strict verion of JavaScript

const { Contract } = require("fabric-contract-api"); // Import the contract class from fabric-contract-api module

class AccessControlContract extends Contract {
  // Define the constructor for the class to initialize the chaincode ledger
  async initLedger(ctx) {
    console.info("Access Control Ledger Initialized");
  }

  // Register a new user in the ledger
  async registerUser(ctx, userId) {
    const exists = await ctx.stub.getState(userId); // Check if the user already exists
    if (exists && exists.length > 0) {
      // If the user already exists
      throw new Error(`User ${userId} already exists`); // Throw an error indicating that the user already exists
    }

    // Create a new user object
    const user = {
      userId,
    };

    // Store the user object in the ledger
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
    return `User ${userId} registered successfully`; // Return a success message
  }

  // Register a new platform in the ledger
  async registerPlatform(ctx, platformId) {
    const exists = await ctx.stub.getState(platformId); // Check if the platform already exists
    if (exists && exists.length > 0) {
      // If the platform already exists
      throw new Error(`Platform ${platformId} already exists`); // Throw an error indicating that the platform already exists
    }

    // Create a new platform object
    const platform = {
      platformId,
    };

    // Store the platform object in the ledger
    await ctx.stub.putState(platformId, Buffer.from(JSON.stringify(platform)));
    return `Platform ${platformId} registered successfully`; // Return a success message
  }

  // Grant access to a platform for accessing a user's data
  async grantAccess(ctx, userId, platformId, timestamp) {
    const accessKey = `ACCESS_${userId}_${platformId}`; // Generate the access key
    const exists = await ctx.stub.getState(accessKey); // Check if the access key already exists
    if (exists && exists.length > 0) {
      // If the access key already exists
      throw new Error(`Access for ${userId} and ${platformId} already exists`); // Throw an error indicating that the access already exists
    }

    // Create a new access object
    const access = {
      userId,
      platformId,
      grantedAt: timestamp,
    };

    // Store the access object in the ledger
    await ctx.stub.putState(accessKey, Buffer.from(JSON.stringify(access)));
    return `Access granted to ${userId} for platform ${platformId}`; // Return a success message
  }

  // Revoke access to a platform for accessing a user's data
  async revokeAccess(ctx, userId, platformId) {
    const accessKey = `ACCESS_${userId}_${platformId}`; // Generate the access key
    const exists = await ctx.stub.getState(accessKey); // Check if the access key already exists
    if (!exists || exists.length === 0) {
      // If the access key does not exist
      throw new Error(`Access for ${userId} and ${platformId} does not exist`); // Throw an error indicating that the access does not exist
    }

    // Delete the access object from the ledger
    await ctx.stub.deleteState(accessKey);
    return `Access revoked for ${userId} for platform ${platformId}`; // Return a success message
  }

  // Check if access is granted to a platform for accessing a user's data
  async isAccessGranted(ctx, userId, platformId) {
    const accessKey = `ACCESS_${userId}_${platformId}`; // Generate the access key
    const access = await ctx.stub.getState(accessKey); // Retrieve the access object from the ledger
    return !!access && access.length > 0; // Return true if access exists, false otherwise
  }

  // Log access ateempt to a user's data
  async logAccess(ctx, userId, platformId, success, timestamp) {
    const logId = `LOG_${timestamp}`; // Generate the log ID
    const logEntry = {
      logId,
      userId,
      platformId,
      timestamp: timestamp,
      success,
    };

    // Store the log entry in the ledger
    await ctx.stub.putState(logId, Buffer.from(JSON.stringify(logEntry)));
  }

  // Get all access logs for a user
  async getAccessLogs(ctx, userId) {
    const iterator = await ctx.stub.getStateByRange("LOG_", "LOG_~"); // Get all logs from the ledger
    const logs = [];
    while (true) {
      const res = await iterator.next(); // Get the next log entry
      if (res.value && res.value.value.toString()) {
        const log = JSON.parse(res.value.value.toString()); // Parse the log entry
        if (log.userId === userId) {
          logs.push(log); // Add the log entry to the logs array if it is for the specified user
        }
      }
      if (res.done) {
        await iterator.close(); // Close the iterator if all logs have been retrieved
        return logs; // Return the logs array
      }
    }
    return JSON.stringify(logs); // Return the logs array as a JSON string
  }
}

module.exports = AccessControlContract; // Export the AccessControlContract class
