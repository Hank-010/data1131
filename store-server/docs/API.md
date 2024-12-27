# 介面文檔

## 使用者模組

### 1. 登入

**請求URL：**

```
/users/login
```

**請求方式：**

```
Post
```

**參數說明：**

| 參數 | 是否必選 | 類型 | 說明 |
| :-: | :-: | :-: | :-: |
| userName | 是 | string | 使用者名稱 |
|  password  | 是 | string | 密碼 |

**返回示例：**

```javascript
{
  "code": "001",
    "user": {
    "user_id": 1,
    "userName": "admin"
  },
  "msg": "登入成功"
}
```



### 2. 查找使用者名稱是否存在

**請求URL：**

```
/users/findUserName
```

**請求方式：**

```
Post
```

**參數說明：**

| 參數 | 是否必選 | 類型 | 說明 |
| :------: | :------: | :----: | :----: |
| userName |    是    | string | 使用者名稱 |

**返回示例：**

```javascript
{
  "code": "001",
  "msg": "用户名不存在，可以注册"
}
```



### 3. 註冊

**請求URL：**

```
/users/register
```

**請求方式：**

```
Post
```

**参數说明：**

|   参數   | 是否必選 |  類型  |  說明  |
| :------: | :------: | :----: | :----: |
| userName |    是    | string | 使用者名稱 |
| password |    是    | string |  密碼  |

**返回示例：**

```javascript
{
  code: '001',
  msg: '註冊成功'
}
```



未完...