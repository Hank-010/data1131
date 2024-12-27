/*
 * @Description: 商品模組路由
 */
const Router = require('koa-router');
const productController = require('../../controllers/productController')

let productRouter = new Router();

productRouter
  .post('/product/getAllProduct', productController.GetAllProduct)
  .post('/product/getPromoProduct', productController.GetPromoProduct)
  .post('/product/getHotProduct', productController.GetHotProduct)
  .post('/product/getProductByCategory', productController.GetProductByCategory)
  .post('/product/getCategory', productController.GetCategory)
  .post('/product/getProductBySearch', productController.GetProductBySearch)
  .post('/product/getDetails', productController.GetDetails)
  .post('/product/getProductManagement', productController.GetProductManagement)
  .post('/product/getDetailsPicture', productController.GetDetailsPicture)
  .post('/product/addNewProduct', productController.AddNewProduct)
  .post('/product/deleteProduct', productController.DeleteProduct)
  
module.exports = productRouter;