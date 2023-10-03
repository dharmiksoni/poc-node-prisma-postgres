const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
// const db = require("./prisma");
const prisma = new PrismaClient();

// db.on("error", console.error.bind(console, "Mongodb connection error"));

// db.on;
app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route files
var apiRouter = require("./platform/routes");
// Mounting routes
app.use('/status', (req, res) => {
    res.status(200).send({ status: `API is running on /api ${process.env.PORT}` })
})
app.use("/", apiRouter);
global.prisma = prisma;
// process.on("unhandledRejection", (err) => {
// 	console.log("Error : ", err);
// 	throw err;
// 	// app.close(() => process.exit(1));
// });
app.listen(process.env.PORT || 5000, () => console.log("Server Started..."));
