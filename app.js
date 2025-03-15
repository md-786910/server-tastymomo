const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Import error handler
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");
const categoriesRouter = require("./routes/admin/categories");
const connectDB = require("./config/dbConnection");
const discountRouter = require("./routes/admin/discounts");
const couponRouter = require("./routes/admin/coupons");

// Initialize express
const app = express();

// @create router
const router = express.Router();
const clientRouter = express.Router();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
  })
);

app.set("trust proxy", true); // Can't be mask by hacker

// Body parser
router.use(express.json({ limit: "10mb" }));
router.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
router.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes",
});
// app.use("/api", limiter);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price", "rating", "category", "name"],
  })
);

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// @user route
// router.use("/api/auth", authRoutes);

// @Admin(Managed)
router.use("/categories", categoriesRouter);
router.use("/dicount", discountRouter);
router.use("/coupon", couponRouter);
// router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);

// @Order manager

// @client Route

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
router.use(errorHandler);
clientRouter.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use("/api/v1", router);
app.use("/api/v1/client", clientRouter);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
