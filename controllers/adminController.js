const User = require('../models/User');
const CustomError = require('../customError');

const adminController = {
  alluser: async (req, res, next) => {
    try {
      const find = await User.find({}, '-password');

      if (!find) {
        throw new CustomError.NotFoundError(' not found Users');
      }
      res.status(200).send(find);

    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
        const userId  = req.params.userId;
        const find = await User.findById(userId,'-password');
        if (!find) {
          throw new CustomError.NotFoundError(' not found User');
        }
           res.status(200).send(find);
    } catch (error) {
      next(error);
    }
  },


  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new CustomError.NotFoundError(' not found User');
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
