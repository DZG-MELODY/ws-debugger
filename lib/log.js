const chalk = require('chalk').default;

const log = message => console.log(chalk.white(message));
const success = message => console.log(chalk.greenBright(message));
const warn = message => console.log(chalk.yellow(message));
const error = message => console.log(chalk.red(message));

module.exports = {
  log,
  success,
  warn,
  error
};
