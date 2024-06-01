const mongoose = require('mongoose')


const connectDB = async (url) => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
    .then(() => console.log("connected to mongoDB"))
    .catch(() => console.log("error connecting to Database"))
}
module.exports = connectDB
