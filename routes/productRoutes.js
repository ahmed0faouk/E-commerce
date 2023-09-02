const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authorized, adminauthorized,authorizedoradmin } = require('../middleware')



router.post('/create', adminauthorized, productController.createProduct);

router.patch('/:productId',  adminauthorized, productController.updateProduct);

router.delete('/:productId',  adminauthorized, productController.deleteProduct);

router.get('/list', productController.listProducts);

router.get('/:productId', productController.getProduct);


module.exports = router;
