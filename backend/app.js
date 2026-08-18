const express = require('express');
require("dotenv").config()
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require("./config/mongoose-connection");
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const indexRouter = require('./routes/indexRouter');
const cartRouter = require('./routes/cartRouter');
const wishlistRouter = require('./routes/wishlistRouter');
const flash = require("connect-flash");
const expressSession = require("express-session");
const ejs = require("ejs");
const cors = require("cors");
const isLoggedin = require('./middleware/isLoggedin');

// Express App Initialization
const app = express();
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession(
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
  }
))
app.use(flash());
const allowedOrigins = [
  "http://localhost:5173",
  "https://luxora-flax-theta.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/", indexRouter);
app.use("/owners", ownersRouter)
app.use("/products", productsRouter)
app.use("/users", usersRouter)
app.use("/cart", isLoggedin, cartRouter)
app.use("/wishlist", wishlistRouter)


// Enable Simple Inline CORS for frontend connection
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     return res.status(200).json({});
//   }
//   next();
// });

// // Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api/v1/health', healthRouter);

// // Catch 404 (Not Found) Errors
// app.use((req, res, next) => {
//   const error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// });

// // Global Error Handling Middleware (returns REST JSON response)
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode).json({
//     status: 'error',
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
//   });
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});