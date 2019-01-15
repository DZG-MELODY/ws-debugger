const http = require('http');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');

const DB = require('../lib/db/db.js');
const logger = require('../lib/log.js');

const config = require('../config.js');
const wss = require('./wss.js');

const db = new DB(); // 数据库
db.init();

const app = new Koa(); // 服务

// init router
const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

app.use(views(path.join(__dirname, '../templates'), {
  extension: 'ejs'
}));

app.use(async ctx => {
  const history = db.getHistory();
  await ctx.render('index', {history});
});

app.on('error', err => {
  logger.error('server error', err);
});

logger.success('server is start...');

app.listen(config.port, config.host);

logger.success('ws server is start...');
// wss
wss(http.Server(app.callback()), db);
