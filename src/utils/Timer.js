class Timer {
    static isExpired(lastInteraction) {
      const now = new Date();
      const last = new Date(lastInteraction);
      const diffInMinutes = (now - last) / (1000 * 60); // Diferença em minutos
      return diffInMinutes > 5;
    }
  }
  
  module.exports = Timer;