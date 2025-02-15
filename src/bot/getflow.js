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