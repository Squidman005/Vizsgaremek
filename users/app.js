const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const api = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRoutes = require("./api/routes/userRoutes");
const authRoutes = require("./api/routes/authRoutes");
const scoreRoutes = require("./api/routes/scoreRoutes");
const errorHandler = require("./api/middlewares/errorHandler");

app.use("/api", api);

api.use("/users", userRoutes);
api.use("/auth", authRoutes);
api.use("/score", scoreRoutes);

app.get("/health", (req, res) => res.sendStatus(200));

app.use(errorHandler.showError);

module.exports = app;
