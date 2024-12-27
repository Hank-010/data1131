/*
 * @Description: 資料庫創建 SQL 語句
 */

-- 刪除並重新創建資料庫 storeDB
DROP DATABASE IF EXISTS storeDB;
CREATE DATABASE storeDB;
USE storeDB;

-- 創建 users 表
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT, -- 使用者 ID
  userName VARCHAR(40) NOT NULL UNIQUE,      -- 使用者名稱（唯一）
  password VARCHAR(40) NOT NULL,             -- 密碼
  userLevel INT NOT NULL,                 -- 使用者等級（0-3）
  CHECK (userLevel BETWEEN 0 AND 3)       -- 等級範圍檢查
);

-- 創建 carousel 表
DROP TABLE IF EXISTS carousel;
CREATE TABLE carousel (
  carousel_id INT PRIMARY KEY AUTO_INCREMENT, -- 輪播圖 ID
  imgPath VARCHAR(50) NOT NULL,                  -- 圖片路徑
  describes VARCHAR(50) NOT NULL                 -- 描述
);

-- 創建 category 表
DROP TABLE IF EXISTS category;
CREATE TABLE category (
  category_id INT PRIMARY KEY AUTO_INCREMENT, -- 分類 ID
  category_name VARCHAR(20) NOT NULL             -- 分類名稱
);

-- 創建 product 表
DROP TABLE IF EXISTS product;
CREATE TABLE product (
  product_id INT PRIMARY KEY AUTO_INCREMENT,  -- 商品 ID，自增主鍵
  product_name VARCHAR(100) NOT NULL,         -- 商品名稱
  category_id INT NOT NULL,                   -- 分類 ID
  product_title VARCHAR(30) NOT NULL,         -- 商品標題
  product_intro TEXT NOT NULL,                -- 商品介紹
  seller_id INT NOT NULL,                     -- 賣家 ID
  product_price DECIMAL(10, 2) NOT NULL CHECK (product_price > 0), -- 商品價格
  product_selling_price DECIMAL(10, 2) NOT NULL CHECK (product_selling_price > 0), -- 商品銷售價格
  product_num INT NOT NULL CHECK (product_num >= 0), -- 庫存數量
  product_sales INT NOT NULL CHECK (product_sales >= 0), -- 銷量
  CONSTRAINT FK_product_category 
    FOREIGN KEY (category_id) REFERENCES category (category_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT FK_product_seller
    FOREIGN KEY (seller_id) REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);


-- 創建 product_picture 表
DROP TABLE IF EXISTS product_picture;
CREATE TABLE product_picture (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 圖片 ID
  product_id INT NOT NULL,                   -- 商品 ID
  product_picture VARCHAR(200) DEFAULT NULL,    -- 商品圖片
  intro TEXT,                                -- 圖片描述
  KEY FK_product_id (product_id),
  CONSTRAINT FK_product_id 
    FOREIGN KEY (product_id) REFERENCES product (product_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;

-- 創建 shoppingCart 表
DROP TABLE IF EXISTS shoppingCart;
CREATE TABLE shoppingCart (
  id INT PRIMARY KEY AUTO_INCREMENT,        -- 購物車 ID
  user_id INT NOT NULL,                     -- 使用者 ID
  product_id INT NOT NULL,                  -- 商品 ID
  num INT NOT NULL,                         -- 購買數量
  CONSTRAINT FK_user_id 
    FOREIGN KEY (user_id) REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT FK_shoppingCart_id 
    FOREIGN KEY (product_id) REFERENCES product (product_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

-- 創建 orders 表
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,        -- 訂單表 ID
  order_id BIGINT NOT NULL,                 -- 訂單編號
  user_id INT NOT NULL,                     -- 使用者 ID
  product_id INT NOT NULL,                  -- 商品 ID
  product_num INT NOT NULL,                 -- 購買數量
  product_price DOUBLE NOT NULL,            -- 商品價格
  order_time BIGINT NOT NULL,               -- 訂單時間
  total_price DOUBLE NOT NULL,              -- 訂單總價
  CONSTRAINT FK_order_user_id 
    FOREIGN KEY (user_id) REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT FK_order_id 
    FOREIGN KEY (product_id) REFERENCES product (product_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

-- 創建 collect 表
DROP TABLE IF EXISTS collect;
CREATE TABLE collect (
  id INT PRIMARY KEY AUTO_INCREMENT,        -- 收藏表 ID
  user_id INT NOT NULL,                     -- 使用者 ID
  product_id INT NOT NULL,                  -- 商品 ID
  collect_time BIGINT NOT NULL,             -- 收藏時間
  CONSTRAINT FK_collect_user_id 
    FOREIGN KEY (user_id) REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT FK_collect_id 
    FOREIGN KEY (product_id) REFERENCES product (product_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

-- 顯示所有表
SHOW TABLES;
