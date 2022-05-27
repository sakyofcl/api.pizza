const { Router } = require("../lib/router");
const router = new Router([]);

/*
- All end points are register in this file
- controller name and file must be same
- all endpoin are map their controller and it's run specific action
- Eg: router.getApi(url="/",controller="test",action="xyz")
      in this example it will execute xyz method from the test controllers.
- if want send mutiple query param use like this => ?a=10&b=10
*/

/*========== [ Pizza ] =========*/
router.getApi("/pizza", "pizza", "getPizza");
/*========== [ Delivery ] =========*/
router.postApi("/delivery", "delivery", "createDelivery");
router.getApi("/delivery", "delivery", "readDelivery");
router.getApi("/delivery/done", "delivery", "deliveryDone");
let endPoint = router.getEndPoints();

module.exports = {
  endPoint,
};
