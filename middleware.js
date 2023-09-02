const jwt = require('jsonwebtoken')
const utli = require('util')
const asyncverify = utli.promisify(jwt.verify)
const dotenv=require("dotenv")
dotenv.config({path:"config.env"})
const SECRETKEY=process.env.SECRETKEY
const customError = require('./customError')

const authorized = async (req, res, next) => {
    try{
    const { authorization: token } = req.headers
    const decoded = await asyncverify(token, SECRETKEY)
    if (decoded.id !== req.params.id){
       throw new customError.UnauthorizedError('unauthorized user');
    }
    next()
    }catch(e){
        next(e);
    }

}
const authorizeToken= async (req, res, next) => {
    const { authorization: token } = req.headers
    try {
    if (!token) {
        throw new customError.UnauthorizedError('unauthorized user');
    }
  
    
        const decoded = await asyncverify(token, SECRETKEY)
         req.id=decoded.id;
      
      
      next();
    } catch (error) {
        next(error)
    }
  }
  



const authorizedoradmin = async (req, res, next) => {
    try{
    const { authorization: token } = req.headers
    const decoded = await asyncverify(token, SECRETKEY)
    if (decoded.id !== req.params.id&&!decoded.isAdmin){
       throw new customError.UnauthorizedError('unauthorized user');
    }
    next()
    }catch(e){
        next(e);
    }

}







const adminauthorized =  async (req, res, next) => {
    try{
    const { authorization: token } = req.headers
    const decoded = await asyncverify(token, SECRETKEY)
    console.log(req.params.id)
    if (!decoded.isAdmin) {
       throw new customError.UnauthorizedError('unauthorized admin');
    }
    next()
    }catch(e){
        next(e);
    }
}

module.exports = {authorized , adminauthorized,authorizedoradmin,authorizeToken}


