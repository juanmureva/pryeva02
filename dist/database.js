"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _mongodb = _interopRequireDefault(require("mongodb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function connect() {
  try {
    const client = await _mongodb.default.connect('mongodb+srv://user:user@mvico-hbci6.azure.mongodb.net/test?retryWrites=true&w=majority', {
      useUnifiedTopology: true
    });
    const db = client.db('Proyecto');
    console.log('DB is connected');
    return db;
  } catch (e) {
    console.log(e);
  }
}