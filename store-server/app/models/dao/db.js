/*
 * @Description: 資料庫連線
 */
var mysql = require('mysql');
const { dbConfig } = require('../../../config');
var pool = mysql.createPool(dbConfig);

var db = {};

db.query = function (sql, params) {

  return new Promise((resolve, reject) => {
    // 取出連結
    pool.getConnection(function (err, connection) {

      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, params, function (error, results, fields) {
        console.log(`${ sql }=>${ params }`);
        // 釋放連接
        connection.release();
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });

    });
  });
}
// 導出對象
module.exports = db;
