const WhatsAppClient = require("./src/bot/WhatsAppClient");
const ConversationManager = require("./src/bot/ConversationManager");
const Responses = require("./src/bot/Responses");

const responsesPath = "./data/responses.json";
const conversationsPath = "../../data/conversations.json";
const sessionPath = "./data/session.json";

const responses = new Responses(responsesPath);
const conversationManager = new ConversationManager(
  conversationsPath,
  responses
);
const client = new WhatsAppClient(sessionPath);

client.initialize();
client.onMessage((userId, userInput) => {
  const response = conversationManager.getNextMessage(userId, userInput);
  client.sendMessage(userId, response);
});
