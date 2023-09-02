const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authorized, adminauthorized,authorizedoradmin } = require('../middleware')


router.get('/:id', adminauthorized, adminController.getUser);
router.delete('/:id', authorizedoradmin, adminController.deleteUser);
router.get('/user/all', adminauthorized, adminController.alluser);

module.exports = router;