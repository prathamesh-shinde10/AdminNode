const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/authroute");
const dotenv = require("dotenv");
const categoryRoutes = require("./routes/Category");
const bodyParser = require("body-parser");
const subcategoryRoutes = require("./routes/Subcategory");
const productRoutes = require("./routes/Product");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/products", productRoutes);


app.get("/", (req, res) => {
    res.send("API is working 🚀");
  });

  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
