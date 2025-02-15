const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class WhatsAppClient {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth("Chatbot", "./.wwebjs_auth/"),
    });
  }

  // Inicializa o cliente WhatsApp
  initialize() {
    this.client.on("qr", (qr) => {
      console.log("Escaneie o QR Code abaixo para iniciar a sessão:");
      qrcode.generate(qr, { small: true });
    });

    this.client.on("ready", () => {
      console.log("Cliente WhatsApp conectado!");
    });

    this.client.on("auth_failure", () => {
      console.error("Falha na autenticação. Por favor, reinicie o programa.");
    });

    this.client.initialize();
  }

  // Escuta mensagens recebidas
  onMessage(callback) {
    this.client.on("message", async (msg) => {
      callback(msg.from, msg.body.toLowerCase().trim());
    });
  }

  // Envia mensagens
  sendMessage(userId, message) {
    this.client.sendMessage(userId, message);
  }
}

module.exports = WhatsAppClient;
