/*
 * @Description: 商品模組控制器
 */
const productDao = require('../models/dao/productDao');
const { checkProductInfo } = require('../middleware/checkProductInfo');
module.exports = {
  /**
   * 取得商品分類
   * @param {Object} ctx
   */
  GetCategory: async ctx => {
    const category = await productDao.GetCategory();

    ctx.body = {
      code: '001',
      category
    }
  },
  /**
   * 根據商品分類名稱獲取首頁展示的商品信息
   * @param {Object} ctx
   */
  GetPromoProduct: async ctx => {
    let { categoryName } = ctx.request.body;
    // 根據商品分類名稱取得分類id
    const categoryID = await productDao.GetCategoryId(categoryName);
    // 根據商品分類id取得首頁展示的商品訊息
    const Product = await productDao.GetPromoProduct(categoryID);

    ctx.body = {
      code: '001',
      Product
    }
  },
  /**
   * 根據商品分類名稱獲取熱門商品信息
   * @param {Object} ctx
   */
  GetHotProduct: async ctx => {
    let { categoryName } = ctx.request.body;
    const categoryID = [];

    for (let i = 0; i < categoryName.length; i++) {
      // 根據商品分類名稱取得分類id
      const category_id = await productDao.GetCategoryId(categoryName[i]);
      categoryID.push(category_id);
    }
    // 根據商品分類id取得商品資訊
    const Product = await productDao.GetProductByCategory(categoryID, 0, 7);

    ctx.body = {
      code: '001',
      Product
    }
  },
  /**
   * 分頁獲取所有的商品信息
   * @param {Object} ctx
   */
  GetAllProduct: async ctx => {
    let { currentPage, pageSize } = ctx.request.body;
    // 計算開始索引
    const offset = (currentPage - 1) * pageSize;
    const Product = await productDao.GetAllProduct(offset, pageSize);
    // 取得所有的商品數量,用於前端分頁計算
    const total = (await productDao.GetAllProduct()).length;
    ctx.body = {
      code: '001',
      Product,
      total
    }
  },
  /**
   * 根據分類id,分頁獲取商品信息
   * @param {Object} ctx
   */
  GetProductByCategory: async ctx => {
    let { categoryID, currentPage, pageSize } = ctx.request.body;
    // 計算開始索引
    const offset = (currentPage - 1) * pageSize;
    // 分頁獲取該分類的商品信息
    const Product = await productDao.GetProductByCategory(categoryID, offset, pageSize);
    // 取得該分類所有的商品數量,用於前端分頁計算
    const total = (await productDao.GetProductByCategory(categoryID)).length;

    ctx.body = {
      code: '001',
      Product,
      total
    }
  },
  /**
   * 根據搜尋條件,分頁取得商品信息
   * @param {Object} ctx
   */
  GetProductBySearch: async ctx => {
    let { search, currentPage, pageSize } = ctx.request.body;
    // 計算開始索引
    const offset = (currentPage - 1) * pageSize;
    // 取得分類列表
    const category = await productDao.GetCategory();

    let Product;
    let total;

    for (let i = 0; i < category.length; i++) {
      // 如果搜尋條件為某個分類名稱,直接傳回該分類的商品訊息
      if (search == category[i].category_name) {
        // 取得該分類的商品資訊
        Product = await productDao.GetProductByCategory(category[i].category_id, offset, pageSize);
        // 取得該分類所有的商品數量,用於前端分頁計算
        total = (await productDao.GetProductByCategory(category[i].category_id)).length;

        ctx.body = {
          code: '001',
          Product,
          total
        }
        return;
      }
    }
    // 否則傳回根據查詢條件模糊查詢的商品分頁結果
    Product = await productDao.GetProductBySearch(search, offset, pageSize);
    // 取得模糊查詢的商品結果總數
    total = (await productDao.GetProductBySearch(search)).length;

    ctx.body = {
      code: '001',
      Product,
      total
    }
  },
  /**
   * 根據商品id,取得商品詳細信息
   * @param {Object} ctx
   */
  GetDetails: async ctx => {
    let { productID } = ctx.request.body;

    const Product = await productDao.GetProductById(productID);

    ctx.body = {
      code: '001',
      Product,
    }
  },
  /**
   * 根據賣家id,取得商品詳細信息
   * @param {Object} ctx
   */
  GetProductManagement: async ctx => {
    let { user_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    const productList = await productDao.GetProductBySellerId(user_id);

    if (productList.length == 0) {
      ctx.body = {
        code: '002',
        msg: '沒有符合條件的商品'
      }
      return;
    }

    let productManagementList = [];
    // 產生收藏商品的詳細資料列表
    for (let i = 0; i < productList.length; i++) {
      const temp = productList[i];
      // 獲取每個商品詳細信息
      const product = await productDao.GetProductById(temp.product_id);
      productManagementList.push(product[0]);
    }

    ctx.body = {
      code: '001',
      productManagementList: productManagementList,
    }
  },
  /**
   * 根據商品id,取得商品圖片,用於商品詳情的頁面展示
   * @param {Object} ctx
   */
  GetDetailsPicture: async ctx => {
    let { productID } = ctx.request.body;

    const ProductPicture = await productDao.GetDetailsPicture(productID);

    ctx.body = {
      code: '001',
      ProductPicture,
    }
  },
  AddNewProduct: async ctx => {
    let { product_name, product_title, product_intro, product_price, product_selling_price, product_num } = ctx.request.body;

    // 校驗使用者資訊是否符合規則
    if (!checkProductInfo(ctx, product_name, product_title, product_intro, product_price, product_selling_price, product_num)) {
      return;
    }

    try {
      // 連接資料庫插入使用者資訊
      let registerResult = await productDao.AddProduct(product_name, product_title, product_intro, product_price, product_selling_price, product_num);
      // 操作所影響的記錄行數為1,則代表註冊成功
      if (registerResult.affectedRows === 1) {
        ctx.body = {
          code: '001',
          msg: '註冊商品成功'
        }
        return;
      }
      // 否則失敗
      ctx.body = {
        code: '500',
        msg: '未知錯誤，註冊失敗'
      }
    } catch (error) {
      // reject(error);
      ctx.body = {
        code: '500',
        msg: `資料庫操作失敗: ${error.message}`
      };
    }
  },
    /**
     * 刪除使用者的商品
     * @param {Object} ctx
     */
    DeleteProduct: async ctx => {
      let { user_id, product_id } = ctx.request.body;
      // 校驗使用者是否登入
      // if (!checkLogin(ctx, user_id)) {
      //   return;
      // }
  
      // 判斷該使用者是否存在
      let tempProduct = await productDao.GetProductById(product_id);
  
      if (tempProduct.length > 0 && tempProduct.seller_id === user_id) {
        // 如果存在則刪除
        try {
          const result = await productDao.DeleteProductByUserId(user_id, product_id);
          // 判斷是否刪除成功
          if (result.affectedRows === 1) {
            ctx.body = {
              code: '001',
              msg: '刪除商品成功'
            }
            return;
          }
        } catch (error) {
          // reject(error);
          ctx.body = {
            code: '500',
            msg: `資料庫操作失敗: ${error.message}`
          };
        }
      } else {
        // 不存在則回傳訊息
        ctx.body = {
          code: '002',
          msg: '該商品不存在'
        }
      }
    }
}