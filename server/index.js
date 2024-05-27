const express = require("express");
const app = express();
const { config } = require("./config/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(express.json());
app.use(
  cors({
    origin: ["http://" + config.client.server + ":" + config.client.port + ""],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: config.cookie.cookieName,
    secret: config.cookie.secretKey,
    secure: config.cookie.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

const userAccount = require("./routes/authRoute/userAccount");
app.use("/account", userAccount);

const userProfile = require("./routes/profileRoute/userProfile");
app.use("/profile", userProfile);

const expenses = require("./routes/expenses/expenses");
app.use("/expenses", expenses);

const categories = require("./routes/categories/categories");
app.use("/categories", categories);

const payments = require("./routes/payments/payments");
app.use("/payments", payments);

const shops = require("./routes/shops/shops");
app.use("/shops", shops);

const loans = require("./routes/loans/loans");
app.use("/loans", loans);

const savings = require("./routes/savings/savings");
app.use("/savings", savings);

const stats = require("./routes/stats/stats");
app.use("/stats", stats);

app.listen(config.api.port, () => {
  console.log(`Server is running on port: ${config.api.port}`);
});
