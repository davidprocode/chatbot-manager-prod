const FileHandler = require('../utils/FileHandler');

class Conversation {
  constructor(filePath) {
    this.filePath = filePath;
    this.conversations = FileHandler.read(this.filePath);
  }

  getState(userId) {
    return this.conversations[userId] || { context: 'default', lastInteraction: new Date().toISOString() };
  }

  updateState(userId, newState) {
    this.conversations[userId] = { ...this.getState(userId), ...newState, lastInteraction: new Date().toISOString() };
    FileHandler.write(this.filePath, this.conversations);
  }

  deleteState(userId) {
    delete this.conversations[userId];
    FileHandler.write(this.filePath, this.conversations);
  }
}

module.exports = Conversation;