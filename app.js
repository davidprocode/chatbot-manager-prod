// Importando os módulos necessários
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Função para carregar as respostas do arquivo JSON
function loadResponses() {
  try {
    const data = fs.readFileSync('responses.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar o arquivo JSON:', error.message);
    process.exit(1);
  }
}

// Carregando as respostas
const responses = loadResponses();

// Inicializando o cliente WhatsApp
const client = new Client();

// Gerar QR Code para autenticação
client.on('qr', (qr) => {
  console.log('Escaneie o QR Code abaixo para iniciar a sessão:');
  qrcode.generate(qr, { small: true });
});

// Evento disparado quando o cliente estiver pronto
client.on('ready', () => {
  console.log('Cliente WhatsApp conectado!');
});

// Evento disparado quando uma mensagem é recebida
client.on('message', async (msg) => {
  const userId = msg.from; // ID do usuário (número de telefone)
  const userInput = msg.body.toLowerCase().trim(); // Mensagem do usuário

  // Primeira interação: envia a mensagem de boas-vindas e o menu
  if (!userInput || userInput === 'oi' || userInput === 'olá') {
    await msg.reply(responses['welcome']);
    await msg.reply(responses['menu']);
    return;
  }

  // Processa a entrada do usuário e retorna a resposta
  let botResponse = '';

  switch (userInput) {
    case '1':
    case 'informações sobre cursos':
      botResponse = responses['informacoes_cursos'];
      break;
    case '2':
    case 'marcar reposição':
      botResponse = responses['marcar_reposicao'];
      break;
    case '3':
    case 'fazer pagamentos':
      botResponse = responses['fazer_pagamentos'];
      break;
    case '4':
    case 'sair':
      botResponse = responses['sair'];
      break;
    default:
      botResponse = responses['default'];
      break;
  }

  // Envia a resposta ao usuário
  await msg.reply(botResponse);

  // Exibe o menu novamente após a resposta, exceto se o usuário sair
  if (userInput !== '4' && userInput !== 'sair') {
    await msg.reply(responses['menu']);
  }
});

// Inicializa o cliente WhatsApp
client.initialize();