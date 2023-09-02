const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    },
  price: { 
    type: Number,
    required: true,
    min: 0,
     },
  description: { 
    type: String 
  },
  numInTheStock:{ 
     type:Number,
      required: true
    }
});





const Product = mongoose.model('Product', productSchema);

module.exports = Product;