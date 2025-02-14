const FileHandler = require('../utils/FileHandler');

class Responses {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = FileHandler.read(this.filePath);
  }

  get(key) {
    return this.data[key] || this.data['default'];
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    FileHandler.write(this.filePath, this.data);
  }
}

module.exports = Responses;