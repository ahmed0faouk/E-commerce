const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

}

