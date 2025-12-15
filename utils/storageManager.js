const Application = require("../models/Application");

const MAX_DOCS = 200000;      // Safe limit for MongoDB Free Tier
const DELETE_BATCH = 50;

async function enforceStorageLimit() {
  const count = await Application.countDocuments();

  if (count > MAX_DOCS) {
    const oldDocs = await Application.find({})
      .sort({ submittedAt: 1 }) // oldest first
      .limit(DELETE_BATCH)
      .select("_id");

    if (oldDocs.length) {
      const ids = oldDocs.map(d => d._id);
      await Application.deleteMany({ _id: { $in: ids } });
    }

    return {
      cleaned: true,
      deleted: oldDocs.length
    };
  }

  return {
    cleaned: false,
    deleted: 0
  };
}

async function getStorageStatus() {
  const count = await Application.countDocuments();

  const percentage = Math.round((count / MAX_DOCS) * 100);

  let status = "healthy";
  if (percentage >= 90) status = "critical";
  else if (percentage >= 75) status = "warning";

  return {
    usedDocuments: count,
    maxDocuments: MAX_DOCS,
    percentage,
    status,
    autoCleanupEnabled: true
  };
}

module.exports = {
  enforceStorageLimit,
  getStorageStatus
};
