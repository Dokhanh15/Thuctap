import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectMongoDB from "./config/dbconfig.js";
import router from "./routes/index.js";

config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbUrl = process.env.DB_URI || "mongodb://localhost:27017/mydatabase";
connectMongoDB(dbUrl);

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app as viteNodeApp };
