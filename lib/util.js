const url = require('url');
function getQuery(q=""){
   const query = url.parse(q, true).query;
   return query
}
function json(res,data={},status=200){
   res.writeHead(status, {"Content-Type": "application/json"});
   res.end(JSON.stringify(data));
}
module.exports={
   getQuery,
   json
}