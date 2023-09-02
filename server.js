require('./dataBase')
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');//crosss origin resource sharing
const morgan=require("morgan")
const app = express();
const dotenv=require("dotenv")
dotenv.config({path:"config.env"})


app.use(cors());
app.use(express.json())
app.use(morgan("dev"));
app.use(bodyParser.json());


//routes
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productRoutes);



app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message });
});


const PORT=process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});














