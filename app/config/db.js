const mongoose = require("mongoose");

function connectDB() {
  // DB Conn.
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log("Connection failed");
    });
  return connection;
}

module.exports = { connectDB };
