const fs = require('fs');
const path = require('path');

const checkpointFile = path.join(__dirname, 'checkpoint.json');

function readCheckpoint() {
  try {
    const data = fs.readFileSync(checkpointFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { lastProcessedId: null };
    }
    throw error;
  }
}

function writeCheckpoint(lastProcessedId) {
  const data = JSON.stringify({ lastProcessedId }, null, 2);
  fs.writeFileSync(checkpointFile, data, 'utf8');
}

module.exports = { readCheckpoint, writeCheckpoint };
