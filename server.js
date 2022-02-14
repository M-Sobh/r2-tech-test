const server = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use("/api", apiRouter);

module.exports = server;
