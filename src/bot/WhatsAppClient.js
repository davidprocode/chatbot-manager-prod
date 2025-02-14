const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

class WhatsAppClient {
  constructor(sessionPath) {
    this.sessionPath = sessionPath;
    this.client = new Client({
      session: this.loadSession(),
    });
  }

  // Carrega a sessão salva do arquivo JSON
  loadSession() {
    try {
      if (fs.existsSync(this.sessionPath)) {
        const sessionData = JSON.parse(
          fs.readFileSync(this.sessionPath, "utf8")
        );
        return sessionData;
      }
    } catch (error) {
      console.error(`Erro ao carregar sessão: ${error.message}`);
    }
    return null; // Retorna null se não houver sessão salva
  }

  // Salva a sessão no arquivo JSON
  saveSession(session) {
    try {
      fs.writeFileSync(
        this.sessionPath,
        JSON.stringify(session, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error(`Erro ao salvar sessão: ${error.message}`);
    }
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

    this.client.on("authenticated", async (session) => {
      console.log("Dados da sessão:", await session); // Log para verificar o conteúdo da sessão
      if (!session) {
        console.error("Erro: Sessão inválida ou indefinida.");
        return;
      }
      this.saveSession(await session);
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
