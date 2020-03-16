module.exports = connectDb = async () => {
  const mongoose = require("mongoose");
  const { MONGO_DB_URL } = require("./constants");
  return await mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
