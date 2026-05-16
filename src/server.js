const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const equipmentRoutes = require("./routes/equipmentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Connect to MongoDB
connectDB();

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rental_bookings'

app.use(cors({
    origin: 'https://swiftgearrentals.netlify.app',
    credentials: true
}))

app.use(express.json());

// Serve static images from 'uploads' folder
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/equipments", equipmentRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
