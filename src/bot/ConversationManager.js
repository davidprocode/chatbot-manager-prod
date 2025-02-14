const Logger = require("../utils/Logger");
const Timer = require("../utils/Timer");

class ConversationManager {
  constructor(conversationsPath, responses) {
    this.conversationsPath = conversationsPath;
    this.responses = responses;
    this.conversations = this.loadConversations();
  }

  loadConversations() {
    try {
      const data = require(this.conversationsPath);
      return data || {};
    } catch (error) {
      Logger.error(`Erro ao carregar conversas: ${error.message}`);
      return {}; // Retorna um objeto vazio se o arquivo não for encontrado ou estiver inválido
    }
  }

  saveConversations() {
    try {
      const path = require("path");
      const dir = path.dirname(this.conversationsPath);

      // Verifica se o diretório existe; se não, cria-o
      if (!require("fs").existsSync(dir)) {
        require("fs").mkdirSync(dir, { recursive: true });
      }

      // Salva o arquivo JSON
      require("fs").writeFileSync(
        this.conversationsPath,
        JSON.stringify(this.conversations, null, 2),
        "utf8"
      );
    } catch (error) {
      Logger.error(`Erro ao salvar conversas: ${error.message}`);
    }
  }

  getState(userId) {
    return (
      this.conversations[userId] || {
        context: "default",
        lastInteraction: new Date().toISOString(),
      }
    );
  }

  updateState(userId, newState) {
    const currentState = this.getState(userId);
    this.conversations[userId] = {
      ...currentState,
      ...newState,
      lastInteraction: new Date().toISOString(),
    };
    this.saveConversations();
  }

  deleteState(userId) {
    delete this.conversations[userId];
    this.saveConversations();
  }

  getNextMessage(userId, userInput) {
    const userState = this.getState(userId);

    if (Timer.isExpired(userState.lastInteraction)) {
      this.deleteState(userId);
      return this.responses.get("session_expired");
    }

    const flow = this.getFlow(userState.context);
    const nextStep = flow[userInput] || flow["default"];

    if (nextStep.action) {
      nextStep.action(userId, userInput);
    }

    this.updateState(userId, { context: nextStep.nextContext });
    return nextStep.message;
  }

  getFlow(context) {
    const flows = {
      default: {
        oi: {
          message:
            this.responses.get("welcome") + "\n\n" + this.responses.get("menu"),
          nextContext: "menu",
        },
        olá: {
          message:
            this.responses.get("welcome") + "\n\n" + this.responses.get("menu"),
          nextContext: "menu",
        },
        default: {
          message: this.responses.get("default"),
          nextContext: "default",
        },
      },
      menu: {
        1: {
          message: this.responses.get("informacoes_cursos"),
          nextContext: "default",
        },
        2: {
          message: this.responses.get("marcar_reposicao_inicio"),
          nextContext: "marcar_reposicao_dia",
        },
        3: {
          message: this.responses.get("fazer_pagamentos"),
          nextContext: "default",
        },
        4: { message: this.responses.get("sair"), nextContext: "default" },
        default: {
          message: this.responses.get("default"),
          nextContext: "menu",
        },
      },
      marcar_reposicao_dia: {
        default: {
          message: this.responses.get("marcar_reposicao_hora"),
          action: (userId, userInput) =>
            this.updateState(userId, { data: { dia: userInput } }),
          nextContext: "marcar_reposicao_hora",
        },
      },
      marcar_reposicao_hora: {
        default: {
          message: (userId) => {
            const { dia } = this.getState(userId).data;
            const hora = this.getState(userId).data.hora;
            return this.responses
              .get("marcar_reposicao_confirmacao")
              .replace("{dia}", dia)
              .replace("{hora}", hora);
          },
          action: (userId, userInput) =>
            this.updateState(userId, { data: { hora: userInput } }),
          nextContext: "default",
        },
      },
    };

    return flows[context] || flows["default"];
  }
}

module.exports = ConversationManager;
