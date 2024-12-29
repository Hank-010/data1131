# VUE Store（商城）

## 簡介

本專案採用前後端分離架構，前端部分基於 `Vue.js` 開發，實現商城的主要功能，包括商品展示、搜尋、購物車、訂單管理等。  

> 後端部分請參考 [store-server](../store-server/README.md)。

---

## 技術堆疊

- **框架：** `Vue` + `Vue-router` + `Vuex` + `Element-ui`
- **HTTP 請求：** `Axios`
- **CSS 預處理：** `SCSS`

---

## 專案結構

```csharp
vue-store/
├── node_modules/          # Node.js 安裝的依賴目錄。
├── public/                # 公共資源文件夾（不參與編譯，如 favicon、index.html）。
│   ├── favicon.ico        # 預設網站圖標。
│   └── index.html         # Vue 應用的入口 HTML 文件。
├── src/                   # 應用源碼目錄。
│   ├── assets/            # 靜態資源（如圖片、樣式）。
│   ├── components/        # 可重用的 Vue 組件。
│   ├── router/            # 路由配置。
│   ├── store/             # Vuex 狀態管理（如全局數據）。
│   ├── views/             # 主頁面組件（通常與路由匹配）。
│   ├── Global.js          # 定義全局配置
│   ├── App.vue            # 主應用組件。
│   └── main.js            # 應用入口文件。
├── .browserslistrc        # 瀏覽器支持配置，用於定義項目支持的瀏覽器範圍。
├── .eslintrc.js           # ESLint 配置文件，用於代碼風格和語法檢查。
├── babel.config.js        # Babel 配置文件，用於編譯現代 JavaScript。
├── package-lock.json      # Node.js 鎖定文件，確保依賴的版本一致性。
├── package.json           # Node.js 項目配置文件，定義依賴、腳本及項目基本信息。
├── README.md              # 專案說明文件。
└── vue.config.js          # Vue CLI 配置文件，用於自定義 Webpack 配置。

```

---

## 功能模塊

### 1. 登入與註冊
- 使用 `Element-ui` 的 `Dialog` 實現彈出式登入/註冊窗口。
- 提供資料校驗與錯誤提示功能。

### 2. 商品展示與搜尋
- 全部商品頁面展示所有商品。
- 支援分類篩選與關鍵字搜尋。

### 3. 商品詳情頁
- 顯示商品詳細資訊。
- 支援將商品加入購物車或收藏清單。

### 4. 購物車
- 使用 `Vuex` 實現購物車功能。
- 支援商品數量修改與移除操作。

### 5. 訂單管理
- 支援訂單結算與提交。
- 訂單詳情頁顯示歷史訂單。

### 6. 使用者管理
- 管理使用者資訊，包括新增、刪除功能。

### 7. 商品管理(未完成)
- 管理商品資訊，包括新增、刪除功能。

### 6. 錯誤頁面
- 後端錯誤提示頁。

---

## 環境需求

- **Node.js：** v14 或更高版本
- **Vue CLI：** v4.5 或更高版本

---

## 安裝與運行

### 1. 安裝依賴

```bash
cd vue-store
npm install
```

### 2. 啟動開發伺服器

```bash
npm run serve
```

開發伺服器默認運行於 `http://localhost:8080`。

### 3. 編譯生成靜態文件

```bash
npm run build
```

生成的靜態文件將存放於 `dist/` 資料夾。

---

## 與後端的整合

1. **確保後端伺服器已運行：**
   參考 [store-server](../store-server/README.md) 啟動後端伺服器。

2. **修改 API 地址：**
   如果後端伺服器運行於非默認位置，請更新 `src/Global.js` 和 `vue.config.js`。

---

## 測試與調試

1. 使用瀏覽器開發者工具檢查錯誤訊息。
2. 通過 `console.log` 調試數據流。
3. 使用 Postman 測試後端 API 功能。

---

## 頁面截圖

**首頁**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**全部商品**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**購物車**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**我的收藏**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**我的訂單訂單**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**登入**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**註冊**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**新增商品**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**管理使用者**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**訂單確認**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/collect.png)

**商品搜尋**
![](https://raw.githubusercontent.com/Hank-010/data1131/master/vue-store/public/screenshots/SearchPage.png)

---

## 作者

**廖翊宏**  
2024年12月29日  

---
