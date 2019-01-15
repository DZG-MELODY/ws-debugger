const path = require('path');
const fs = require('fs');
const FILE_TYPE = require('./const');
const logger = require('../log');

class DB {
  constructor (options = {}) {
    this.root = options.root || path.resolve(__dirname);
    this.tables = {};
    this.init();
  }

  init () {
    this.createTable(FILE_TYPE.HISTORY);
  }

  createTable (name) {
    const tableFile = path.join(this.root, `./${name}.json`);
    if (!this.tables[name]) this.tables[name] = tableFile;
    if (!fs.existsSync(tableFile)) fs.writeFileSync(tableFile, JSON.stringify({name, data: []}), 'utf-8');
  }

  getHistory () {
    const content = fs.readFileSync(this.tables[FILE_TYPE.HISTORY]);
    let ret = null;
    try {
      ret = JSON.parse(content).data;
    } catch (err) {
      logger.error(err.stack);
    }
    return ret;
  }

  addHistory (message) {
    const filePath = this.tables[FILE_TYPE.HISTORY];
    const content = fs.readFileSync(filePath);
    let ret = false;
    try {
      const table = JSON.parse(content);
      if (table.data.length < 10) {
        table.data.unshift(message);
      } else {
        table.data.splice(9, 1, message);
      }
      fs.writeFileSync(filePath, JSON.stringify(table));
    } catch (err) {
      logger.error(err.stack);
    }
    return ret;
  }
}

module.exports = DB;
