# store-server

## 簡介

本專案採用前後端分離的架構設計，後端部分基於 `Node.js` 和 `Koa 框架`，主要負責資料的處理與管理，並提供 API 介面供前端存取。

> 前端請參考 [vue-store](../vue-store/README.md)

---

## 技術堆疊

- **後端框架：** `Node.js` + `Koa`
- **資料庫：** `MySQL`
- **模組管理：** `npm`

---

## 專案結構

```
store-server/
├── app/                   # 主應用目錄，包含後端功能模組。
│   ├── controllers/       # 控制器，用於處理請求和業務邏輯。
│   ├── models/dao/        # 數據模型，對應數據庫結構。
│   ├── routes/            # 路由文件，定義 API 路徑及對應處理。
│   └── services/          # 服務層邏輯，例如處理數據操作或第三方集成。
├── docs/                  # 文檔資料夾，包含 API 說明。
├── node_modules/          # Node.js 依賴安裝目錄（由 npm 自動生成）。
├── public/                # 靜態資源目錄（如圖片、前端說明）。
├── analogDataSql.sql      # SQL 文件，用於存儲模擬的數據腳本。
├── app.js                 # 應用入口點，負責啟動後端服務。
├── config.js              # 配置文件，管理環境變數和全局配置。
├── package.json           # Node.js 項目配置文件，包含依賴及腳本。
├── package-lock.json      # Node.js 鎖定文件，用於確保一致的依賴版本。
├── README.md              # 專案說明文件，記錄專案介紹、用法及注意事項。
└── storeDB.sql            # 數據庫結構定義或初始化腳本。
```

---

## 功能模塊

### 1. 使用者模組
- **登入 / 註冊**
- **檢查使用者名稱是否存在**
- **刪除使用者**

### 3. 商品模組
- **查詢商品列表**
- **獲取商品詳細資訊**

### 2. 購物車模組
- **查詢購物車內商品**
- **更新購物車**
- **確認訂單**

### 2. 訂單模組
- **建立訂單**
- **查詢使用者訂單**

### 4. 系統管理模組
- **錯誤日誌記錄**
- **權限管理**

---

## 環境需求

- **Node.js：** v14 或更高版本
- **MySQL：** v8.0 或更高版本

---

## 安裝與運行

### 1. 專案設置

安裝專案依賴：
```bash
cd store-server
npm install
```

### 2. 資料庫設置

初始化資料庫：
```bash
mysql -u root -p < storeDB.sql
mysql -u root -p < analogDataSql.sql
```

資料庫設定請修改 `config/config.js`，範例：
```javascript
module.exports = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'storeDB'
};
```

### 3. 運行專案

啟動後端服務：
```bash
node app.js
```

伺服器預設埠為 `3000`，可透過 `http://localhost:3000` 訪問。

---

## 測試方式

可使用 Postman 或其他 API 測試工具進行測試，詳見 [介面文檔](docs/API.md)。

---

**作者：** 廖翊宏  
2024年12月21日

---
