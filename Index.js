require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const db = require("./models");
db.sequelize
   .sync({ alter: false })
  .then(() => {
    console.log("Database Connected");
  })
  .catch(console.error);

const authRoutes = require("./routes/auth.routes");
const zohoRoutes = require("./routes/zoho.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const generate_chalan = require("./routes/generate_chalan.routes");
const scanRoutes = require("./routes/scan.routes");
const userRoutes = require("./routes/user.routes");

const customer = require("./routes/customer.routes");

app.use("/customers", customer);

app.use("/auth", authRoutes);

app.use("/zoho", zohoRoutes);
app.use("/", dashboardRoutes);
app.use("/", generate_chalan);
app.use("/", scanRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});