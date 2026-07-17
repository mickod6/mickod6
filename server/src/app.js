const express = require("express");
const cors = require("cors");
const { uploadDir } = require("./middleware/upload");
const errorHandler = require("./middleware/errorHandler");
const analyzeRouter = require("./routes/analyze");
const logsRouter = require("./routes/logs");
const adviceRouter = require("./routes/advice");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/analyze", analyzeRouter);
app.use("/api/logs", logsRouter);
app.use("/api/advice", adviceRouter);

app.use(errorHandler);

module.exports = app;
