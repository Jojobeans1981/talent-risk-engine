/**
 * Simple logging utility for the Talent Risk Engine
 */

export class Logger {
  constructor(level = 'info') {
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    this.currentLevel = this.levels[level] || this.levels.info;
  }
  
  debug(message, ...args) {
    if (this.currentLevel <= this.levels.debug) {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  }
  
  info(message, ...args) {
    if (this.currentLevel <= this.levels.info) {
      console.log(`ℹ️  [INFO] ${message}`, ...args);
    }
  }
  
  warn(message, ...args) {
    if (this.currentLevel <= this.levels.warn) {
      console.warn(`⚠️  [WARN] ${message}`, ...args);
    }
  }
  
  error(message, ...args) {
    if (this.currentLevel <= this.levels.error) {
      console.error(`❌ [ERROR] ${message}`, ...args);
    }
  }
  
  setLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.currentLevel = this.levels[level];
    }
  }
}

export default Logger;