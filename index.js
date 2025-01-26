import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import loanRoutes from "./src/routes/loan.route.js";
import guaranterRoute from "./src/routes/guarantor.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["https://hackathon-frontend-liard.vercel.app"], // Remove the trailing slash
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", loanRoutes);
app.use("/api/v1", guaranterRoute);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
