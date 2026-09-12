const mongoose = require("mongoose");

/**
 * Executes a set of database operations in a transaction.
 * If the MongoDB instance does not support transactions (e.g. local standalone server),
 * it falls back to running the operations without a transaction.
 * 
 * @param {Function} operations - A function of signature (session) => Promise<any>
 * @returns {Promise<any>} The result of the operations function
 */
async function executeTransaction(operations) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await operations(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    
    // Check if error is due to transactions not being supported (standalone MongoDB)
    const isNoReplicaSet = error.code === 20 || 
                           (error.message && error.message.includes("Transaction numbers are only allowed"));
    
    if (isNoReplicaSet) {
      console.warn("MongoDB transactions not supported (standalone instance). Falling back to transaction-less execution...");
      session.endSession();
      // Run the operations without passing a session
      return await operations(null);
    }
    
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { executeTransaction };
