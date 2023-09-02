const User = require('../models/User');
const Product = require('../models/Product');
const CustomError = require('../customError');
const bcrypt = require('bcrypt')
const { body, validationResult } = require("express-validator");




const userController = {
  register: async (req, res, next) => {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError.BadRequestError('validation error ');
      }
      const { email, firstName, lastName, userName, password, phoneNumber, address,isAdmin } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new CustomError.BadRequestError('User with this email already exists');
      }

      const newUser = new User({ email, firstName, lastName, userName, password, phoneNumber, address,isAdmin });
      await newUser.save();

      res.status(201).send(newUser);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError.NotFoundError('User not found');
      }

      const copmarpass = await bcrypt.compare(password, user.password)
      if (!copmarpass) {
        throw new CustomError.UnauthorizedError('Invalid password');
      }
      
        const token = await user.generateToken()
        res.status(200).send(token)
      

    } catch (error) {
      next(error);
    }
  },
  profile: async (req, res, next) => {
    try {
        const { id } = req.params;
        const fineuser = await User.findById(id, '-password');
       if(!fineuser){
        throw new CustomError.NotFoundError('User not found');

       }
       res.status(200).send(fineuser)
    } catch (error) {
      next(error);
    }
  },

  addToCart : async (req, res ,next) => {
    try {
        const uid = req.id; 
        const productId = req.params.productId; 
        const quantity = req.params.quantity; 

        const user = await User.findById(uid);
        const product = await Product.findById(productId);

        if (!user) {
          throw new CustomError.NotFoundError('User not found');
        }

        if (!product) {
          throw new CustomError.NotFoundError('product  not found');
        }
        if(user.orderStatus==="verified"){
        user.cart.pop()
    }
        user.orderStatus="pending"

        const existingCartItem = user.cart.find(i => i.product.toString() === productId);
        
        if (existingCartItem) {
            existingCartItem.quantity+=Number(quantity);
        } else {
            user.cart.push({ product: productId, quantity: quantity,productName:product.name });
        }

        await user.save();

        res.send('Product added to cart' );
      
    }
      catch (error) {
         next(error)
      }
},
  listCartProducts: async (req, res, next) => {
    try {
      const uid = req.id; 
      const user = await User.findById(uid).populate('cart');

      if (!user) {
        throw new CustomError.NotFoundError('User not found');
      }

      res.json(user.cart);
    } catch (error) {
      next(error);
    }
  },

  removeFromCart: async (req, res, next) => {
    try {
      const uid = req.id; 
        const productId = req.params.productId; 
  
      const user = await User.findById(uid).populate('cart.product');
      if (!user) {
        throw new CustomError.NotFoundError('User not found');
            }
  
      const cartIndex = user.cart.findIndex(item => item.product.equals(productId));
      if (cartIndex === -1) {
        throw new CustomError.NotFoundError('Product not found in cart');
      }
  
      user.cart.splice(cartIndex, 1);
      await user.save();
  
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (err) {
      next(err);
    }
  },


    
  
    verifyOrder: async (req, res, next) => {
      try {
        const uid = req.id; 
        const user = await User.findById(uid);
        if (!user) {
          throw new CustomError.NotFoundError('User not found');
        }

      user.orderStatus="verified"  ;
        await user.save();
    
        res.status(200).json({ message: 'Order verified successfully', user });
      } catch (err) {
        next(err);
      }
    },
      
        cancelOrder: async (req, res, next) => {
          try {
            const uid = req.id;
            const user = await User.findById(uid);
            if (!user) {
              throw new CustomError.NotFoundError('User not found');
            }
        user.cart.pop()
          user.orderStatus="canceled"
            await user.save();
        
            res.status(200).json({ message: 'Order canceled successfully' });
          } catch (err) {
            next(err);
          }
        },
      
        
};

module.exports = userController;
