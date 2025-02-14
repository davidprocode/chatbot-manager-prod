const fs = require('fs-extra');

class FileHandler {
  static async read(filePath) {
    try {
      const data = await fs.readJson(filePath);
      return data || {};
    } catch (error) {
      Logger.error(`Erro ao ler o arquivo ${filePath}: ${error.message}`);
      return {};
    }
  }

  static async write(filePath, data) {
    try {
      await fs.writeJson(filePath, data, { spaces: 2 });
    } catch (error) {
      Logger.error(`Erro ao escrever no arquivo ${filePath}: ${error.message}`);
    }
  }
}

module.exports = FileHandler;