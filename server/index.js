const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "../api/db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("/api", router);

server.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

server.listen(3002, () => {
  console.log("running at 3002");
});
