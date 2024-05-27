const sql = require("mssql");
const { config } = require("./config/config");

const connection = new sql.ConnectionPool(config.database);
connection
  .connect()
  .then((result) => {
    if (result.connected) {
      console.log(`Connected to Database`);
    }
  })
  .catch((err) => {
    console.log("Error when connecting to Database");
    console.log(err);
  });

module.exports = connection;
