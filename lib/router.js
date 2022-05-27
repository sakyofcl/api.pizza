const { getQuery } = require("./util");
class Router {
  constructor(api) {
    this.api = api;
  }

  init(req, res) {
    let api = this.api;
    let q = {};
    let findAction = (req, res, q) => {};
    for (let i = 0; i < api.length; i++) {
      //remove queries
      let url = req.url.split("?")[0];

      if (url === api[i].url && req.method === api[i].method) {
        let controller = require(`../controller/${api[i].controller}`);
        findAction = controller[`${api[i].action}`];
        console.log(controller[`${api[i].action}`]);
        q = getQuery(req.url);
        break;
      }
    }
    findAction(req, res, q);
  }
  getEndPoints() {
    return this.api;
  }
  getApi(url, controller, action) {
    this.api.push({
      url: url,
      controller: controller,
      action: action,
      method: "GET",
    });
  }
  postApi(url, controller, action) {
    this.api.push({
      url: url,
      controller: controller,
      action: action,
      method: "POST",
    });
  }
}

module.exports = {
  Router,
};
