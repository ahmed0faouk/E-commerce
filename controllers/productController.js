const Product = require('../models/Product');
const CustomError = require('../customError');

const productController = {
  createProduct: async (req, res, next) => {
    try {
      const { name, price, description,numInTheStock } = req.body;
      const newProduct = new Product({ name, price, description,numInTheStock });
      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const { name, price, description,numInTheStock } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(productId,
        {
            name,
            price,
            description,
            numInTheStock
            
            
          });

          if (!updatedProduct) {
            throw new CustomError.NotFoundError('product not found');
          }

      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        throw new CustomError.NotFoundError('product not found');
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  listProducts: async (req, res, next) => {
    try {
      const products = await Product.find({});
      if(!products){
        throw new CustomError.NotFoundError('products not found');


      }
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);

      if (!product) {
        throw new CustomError.NotFoundError('product not found');
      }

     res.json(product);
    } catch (error) {
      next(error);
    }
  },

};

module.exports = productController;
