// index.js
import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"], // receive requests from this origin only
};
app.use(cors(corsOptions)); // add this line before defining routes
dotenv.config(); // Load environment variables

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "banana", "cherry"] });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

// // Middleware: parse JSON bodies and handle CORS
// app.use(express.json());
// app.use(cors());

// // server.js (add after middleware setup)
// import itemsRouter from "./routes/items.js";
// app.use("/api/items", itemsRouter);

// // Connect to MongoDB using Mongoose
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");

//     // Start the server only after successful DB connection
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => console.error("Error connecting to MongoDB:", error));

// // Example route
// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });
