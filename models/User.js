const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const utli = require('util')
const asyncsign = utli.promisify(jwt.sign)
const dotenv=require("dotenv")
dotenv.config({path:"config.env"})

const SECRETKEY=process.env.SECRETKEY



const userSchema = new mongoose.Schema({
  email: {
    
     type: String,
     required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

  },
  firstName: { 
    type:String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
     
 
    },
  lastName: { 
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
     },
  userName:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 20,
     
       },
  password: {
    type: String,
    required: true,
    minlength: 6,
   // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, 

    },
  phoneNumber: { 
    type: String,
    match: /^01[0125][0-9]{8}$/,
   },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
   },
  isAdmin: {
       type: Boolean,
        default: false
       },
   cart: [
    {
      
      product: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productName:{
        type: String,

      }
    },
  ],
  orderStatus: { type: String, enum: ['pending', 'verified', 'canceled'], default: 'pending' },

});




userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const saltRound = 12
    const hashedpassword = await bcrypt.hash(this.password, saltRound)
    this.password = hashedpassword
  }
})


userSchema.methods.generateToken = function () {
  const token = asyncsign({
    id: this.id,
    email: this.email,
    isAdmin: this.isAdmin
  }, SECRETKEY)
  return token
}


userSchema.path('userName').validate(function (value) {
  return value === this.firstName +" "+ this.lastName;
}, 'Username must be equal to the concatenation of firstName and lastName.');







const User = mongoose.model('User', userSchema);

module.exports = User;