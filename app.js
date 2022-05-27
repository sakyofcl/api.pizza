const http = require("http");
const { Router } = require("./lib/router");
const { endPoint } = require("./route/api");

const APP_PORT = 8000;

//initiate server instance
const app = http.createServer(async (req, res) => {
  //initiate server routing
  let appRouter = new Router(endPoint);
  appRouter.init(req, res);
});

//set port
app.listen(APP_PORT, () => {
  console.log(`app started on port: ${APP_PORT}`);
});
