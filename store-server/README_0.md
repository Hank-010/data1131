# store-server

## 簡介

本專案採用前後端分離的架構設計，後端部分基於 Node.js 和 Koa 框架，主要負責資料的處理與管理，並提供 API 介面供前端存取。

> 前端請參考[vue-store](../vue-store/README.md)。

## 介面文檔

> [介面文檔](docs/API.md)

## 運行專案



#### 1. Project Setup
```bash
cd store-server
npm install
```
#### 2. Database Setup
```bash
cd store-server

npm install

mysql -u root -p < storeDB.sql
mysql -u root -p < analogDataSql.sql

```
#### 3. Database Config
> [app.js](app.js)

> [config.js](config.js)

#### 4. Run Project
```bash
node app.js
```