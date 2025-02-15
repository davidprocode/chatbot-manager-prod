const fs = require("fs");

const Timer = require("../utils/Timer");
const FileHandler = require("../utils/FileHandler");
const conversationsPath = "../data/conversations.json"

class ConversationManager {
  getState(userId) {
    const currentState = FileHandler.read(conversationsPath);
    return currentState[userId];
  }

  updateState(userId, newState) {
    const currentState = this.getState(userId);
    this.conversations[userId] = {
      ...currentState,
      ...newState,
      lastInteraction: new Date().toISOString(),
    };
    FileHandler.write(conversationsPath, )
  }

  getNextMessage(userId, userInput) {
    const userState = this.getState(userId);

    if (userState) {
      console.log(userState);
    }

    // this.updateState(userId, { context: "default" });
    return "default";
  }
}

module.exports = ConversationManager;
