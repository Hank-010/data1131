你的 GitHub Repository URL 是這個：**https://github.com/Hank-010/-_-**。

若這個 Repository 是你剛創建的並希望推送本地資料夾內容到該儲存庫，請確認以下操作：

---

### 使用的範例指令：
假設你的儲存庫名稱是 **`-_`**，請按照以下步驟操作：

1. **確認本地資料夾**  
   開啟終端，導航到你要推送的資料夾：
   ```bash
   cd /path/to/your-folder
   ```

2. **初始化 Git**  
   初始化資料夾作為 Git 儲存庫：
   ```bash
   git init
   ```

3. **連接遠端儲存庫**  
   使用你的 Repository URL 連接遠端儲存庫：
   ```bash
   git remote add origin https://github.com/Hank-010/-_- 
   ```

4. **將所有檔案添加到暫存區**  
   把資料夾內的所有檔案添加到 Git 暫存區：
   ```bash
   git add .
   ```

5. **提交檔案到本地 Git 儲存庫**  
   提交一個初始提交訊息：
   ```bash
   git commit -m "Initial commit"
   ```

6. **推送檔案到 GitHub**  
   將檔案推送到 GitHub：
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

### 檢查推送結果：
推送完成後，進入你的 GitHub 頁面 [https://github.com/Hank-010/-_-](https://github.com/Hank-010/-_-)，應該能看到檔案已成功上傳。
