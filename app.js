const WhatsAppClient = require("./src/bot/WhatsAppClient");
const ConversationManager = require("./src/bot/ConversationManager");

const conversationManager = new ConversationManager();

const client = new WhatsAppClient();

client.initialize();

client.onMessage(async (userId, userInput) => {
  const response = await conversationManager.getNextMessage(userId, userInput);
  console.log(
    `userId:${userId} - userInput:${userInput} - response:${response}`
  );
  client.sendMessage(userId, response);
});
