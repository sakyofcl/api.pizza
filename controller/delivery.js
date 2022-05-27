const { writeFileSync, readFileSync } = require("fs");
var path = require("path");
const { json } = require("../lib/util");
const { paginator } = require("../lib/paginator");

var delivery_data = path.join(__dirname, "..", "data", "delivery_data.json");
var pizza_data = path.join(__dirname, "..", "data", "pizza_data.json");

function createDelivery(req, res, q) {
  let data = "";
  req.on("data", (chunk) => {
    // append data
    data += chunk.toString();
  });
  // listen all the data
  req.on("end", () => {
    data = JSON.parse(data);

    let deliveryData = JSON.parse(readFileSync(delivery_data));
    let pizzaData = JSON.parse(readFileSync(pizza_data));
    let finalData = {};
    // writeFileSync(dataPath, JSON.stringify({ name: "sakeen" }, null, 2), "utf8");
    if (data["pizza_id"] != undefined) {
      let item = pizzaData.find((v) => v.id == data["pizza_id"]);
      let pizzaSize = data["pizza_size"] != undefined ? data["pizza_size"].toUpperCase() : "S";
      let pizzaCount = data["pizza_count"] != undefined ? parseInt(data["pizza_count"]) : 1;
      let userId = false;
      let orderNo = Date.now().toString(36);

      //check user
      if (data["user_id"] != undefined) {
        if (data["user_id"] == "123user") {
          userId = "123user";
        } else {
          return json(res, { message: "wrong user id!" }, 404);
        }
      } else {
        return json(res, { message: "user id is required!" }, 400);
      }

      if (item["id"] != undefined) {
        console.log();
        finalData = {
          id: orderNo,
          user_id: userId,
          pizza_id: item["id"],
          time: new Date().toLocaleString(),
          pizza_size: pizzaSize,
          amount: item.prices[pizzaSize] * pizzaCount,
          pizza_count: pizzaCount,
          status: "PROCESSING",
        };
        //create delevery
        deliveryData.push(finalData);
        writeFileSync(delivery_data, JSON.stringify(deliveryData, null, 2), "utf8");
        return json(res, { message: "successfully place order", orderNo: orderNo }, 200);
      } else {
        return json(res, { message: "pizza id not exists!" }, 400);
      }
    }
  });
}
function deliveryDone(req, res, q) {
  let deliveryData = JSON.parse(readFileSync(delivery_data));
  if (q["delivery_id"] != undefined) {
    deliveryData.map((v) => {
      if (v.id == q["delivery_id"]) {
        v.status = "DONE";
      }
    });

    setTimeout(function () {
      writeFileSync(delivery_data, JSON.stringify(deliveryData, null, 2), "utf8");
      console.log("updated.!");
    }, 1500000);
    return json(res, { message: "successfully delivery done." }, 200);
  } else {
    return json(res, { message: " delivery id is required." }, 400);
  }
}
function readDelivery(req, res, q) {
  let deliveryData = JSON.parse(readFileSync(delivery_data));
  let finalData = {};
  //filter state
  if (q["state"] != undefined) {
    let state = q["state"] == "d" ? "DONE" : "PROCESSING";
    deliveryData = deliveryData.filter((v) => {
      if (v.status == state) {
        return v;
      }
    });
  }
  //find specific data by id
  if (q["id"] != undefined) {
    finalData = deliveryData.find((v) => v.id == q["id"]);
  } else {
    finalData = paginator(deliveryData, q["page"] != undefined ? q["page"] : 1);
  }

  return json(res, finalData);
}
module.exports = {
  createDelivery,
  readDelivery,
  deliveryDone,
};
