const { readFileSync } = require("fs");
var path = require("path");
const { paginator } = require("../lib/paginator");
const { json } = require("../lib/util");

var dataPath = path.join(__dirname, "..", "data", "pizza_data.json");

function getPizza(req, res, q) {
  let data = JSON.parse(readFileSync(dataPath));
  let finalData = {};
  //filter ingredients
  if (q["ingredients"] != undefined) {
    let ingredientsQuery = q["ingredients"].split(",");

    data = data.filter((v) => {
      let state = {};

      ingredientsQuery.map((inc) => {
        if (v.ingredients.includes(inc)) {
          state[inc] = true;
        } else {
          state[inc] = false;
        }
      });

      let key = Object.keys(state);
      for (let i = 0; i < key.length; i++) {
        if (state[key[i]] == false) {
          state = false;
          break;
        }
      }

      if (state != false) {
        return v;
      }
    });
  }
  //filter size and price_range
  else if (q["size"] != undefined && q["price_range"] != undefined) {
    let size = q["size"].toUpperCase();
    data = data.filter((v) => {
      let price_range = q["price_range"].split("-");
      if (v.prices[size] != undefined) {
        let price = v.prices[size];
        if (price > parseInt(price_range[0]) && parseInt(price_range[1]) > price) {
          return v;
        }
      }
    });
  }

  //find specific data by id
  if (q["id"] != undefined) {
    finalData = data.find((v) => v.id == q["id"]);
  } else {
    finalData = paginator(data, q["page"] != undefined ? q["page"] : 1);
  }

  return json(res, finalData);
}

module.exports = {
  getPizza,
};
