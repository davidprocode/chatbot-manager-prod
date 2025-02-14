const Responses = require('./Responses');
const Conversation = require('./Conversation');
const Timer = require('../utils/Timer');

class Bot {
  constructor(responsesPath, conversationsPath) {
    this.responses = new Responses(responsesPath);
    this.conversation = new Conversation(conversationsPath);
  }

  handleMessage(userId, userInput) {
    const userState = this.conversation.getState(userId);

    if (Timer.isExpired(userState.lastInteraction)) {
      this.conversation.deleteState(userId);
      return 'Sua sessão expirou. Por favor, inicie uma nova conversa.';
    }

    let response = '';
    let newState = {};

    switch (userState.context) {
      case 'default':
        response = this.handleDefaultContext(userInput, userId);
        break;
      case 'marcar_reposicao':
        response = this.handleMarcarReposicao(userInput, userState);
        break;
      default:
        response = this.responses.get('default');
    }

    this.conversation.updateState(userId, newState);
    return response;
  }

  handleDefaultContext(userInput, userId) {
    if (userInput === 'oi' || userInput === 'olá') {
      return this.responses.get('welcome') + '\n\n' + this.responses.get('menu');
    }
    // Outras opções aqui...
  }

  handleMarcarReposicao(userInput, userState) {
    // Lógica para marcar reposição...
  }
}

module.exports = Bot;