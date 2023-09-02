const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorized, adminauthorized,authorizedoradmin,authorizeToken } = require('../middleware')
const { body, validationResult } = require("express-validator");



router.post('/register'
,[body("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/)
.withMessage("password should match this regular expression"),body("firstName").isString().withMessage("first name should be string"),
body("lastName").isString().withMessage("last name should be string"),body("userName").isString().withMessage("user name should be string")]
, userController.register);

router.post('/login', userController.login);

router.post('/cart/add/:productId/:quantity',authorizeToken,  userController.addToCart);

router.get('/cart/list', authorizeToken, userController.listCartProducts);

router.delete('/cart/remove/:productId', authorizeToken, userController.removeFromCart);

router.put('/verify-order', authorizeToken, userController.verifyOrder);

router.delete('/cancel-order', authorizeToken, userController.cancelOrder);

router.get('/profile/:id', authorizedoradmin, userController.profile);



module.exports = router;
