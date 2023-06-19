const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

//bring our db object
const config = require("./config/db");

//Mongo DB config
// mongoose.set("useCreateIndex", true);

//Connect to your database
// mongoose
//   .connect(config.db, { useNewUrlParser: true })
//   .then(() => {
//     console.log("Database connected successfully " + config.db);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Initialising our application
const app = express();

//Defining our PORT
const PORT = process.env.PORT || 5000;

//Defining our Middlewares
app.use(cors());
//set static folder
app.use(express.static(path.join(__dirname, "public")));

//bodyParser Middleware
app.use(bodyParser.json());

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//creating a simple route
app.get("/", (req, res) => {
  return res.json({
    message: "This is our test for node.js authentication system",
  });
});
// ------

//create custom middleware function
// const checkUserType = function (req, res, next) {
//   const userType = req.originalUrl.split("/")[2];
//   //bring passport authentication strategy
//   require("./config/passport")(userType, passport);
//   next();
// };
// app.use(checkUserType);

//Bringing the user routes
const users = require("./routes/users");
//specify API user
app.use("/api/users", users);

//Bringing the user routes
// const admin = require("./routes/admin");
// //specify API Admin
// app.use("/api/admin", admin);

//To run our server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
