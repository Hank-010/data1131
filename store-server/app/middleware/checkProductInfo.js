/*
 * @Description: 校驗商品資訊是否符合規則
 */
module.exports = {
  /**
   * 校驗商品資訊是否符合規則
   * @param {Object} ctx
   * @param {string} product_name 商品名稱
   * @param {string} product_title 商品標題
   * @param {string} product_intro 商品介紹
   * @param {string} product_price 商品價格
   * @param {string} product_selling_price 銷售價格
   * @param {string} product_num 商品庫存
   * @return: 
   */
  checkProductInfo: (ctx, product_name = '', product_title = '', 
                  product_intro = '',product_price = '', 
                  product_selling_price = '', product_num = '') => {
    // 檢查所有參數是否為空
    // if (!product_name || !product_title || !product_intro || 
    //     !product_price || !product_selling_price || !product_num) {
    if (product_name.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_name不能為空'
        };
        return false;
    }
    
    if (product_title.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_title不能為空'
        };
        return false;
    }
    
    if (product_intro.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_intro不能為空'
        };
        return false;
    }
    
    if (product_price.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_price不能為空'
        };
        return false;
    }
    
    if (product_selling_price.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_selling_price不能為空'
        };
        return false;
    }
    
    if (product_num.length === 0) {
        ctx.body = {
            code: '002',
            msg: 'product_num不能為空'
        };
        return false;
    }
    


    if ( product_name.length === 0 ||
        product_title.length === 0 ||
        product_intro.length === 0 ||
        product_price.length === 0 ||
        product_selling_price.length === 0 ||
        product_num.length === 0 ) {
      ctx.body = {
        code: '002',
        msg: '所有欄位均不能為空'
      };
      return false;
    }

    // 檢查商品價格與銷售價格是否為正數
    const price = parseFloat(product_price);
    const sellingPrice = parseFloat(product_selling_price);
    if (isNaN(price) || price <= 0 || isNaN(sellingPrice) || sellingPrice <= 0) {
      ctx.body = {
        code: '003',
        msg: '商品價格或銷售價格不合法(應為大於 0 的數字)'
      };
      return false;
    }

    // 檢查商品庫存是否為非負整數
    const num = parseInt(product_num, 10);
    if (isNaN(num) || num < 0) {
      ctx.body = {
        code: '003',
        msg: '商品庫存不合法(應為非負整數)'
      };
      return false;
    }

    return true;
  }
}