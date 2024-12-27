/*
 * @Description: koaBody 配置
 */
let { uploadDir } = require('../../config');

const koaBodyConfig = {
  multipart: true,
  // parsedMethods默認是['POST', 'PUT', 'PATCH']
  parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  formidable: {
    uploadDir: uploadDir, // 設定檔案上傳目錄
    keepExtensions: true, // 保持文件的後綴
    maxFieldsSize: 2 * 1024 * 1024, // 文件上傳大小限制
    onFileBegin: (name, file) => { // 文件上傳前的設定
      // console.log(`name: ${name}`);
      // console.log(file);
    }
  }
}

module.exports = koaBodyConfig;