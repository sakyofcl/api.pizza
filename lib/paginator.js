function paginator(data, page, per_page) {
  page = page != undefined ? page : 1;
  per_page = per_page != undefined ? per_page : 10;
  let start = (page - 1) * per_page;
  //the slice(start,end) method return new array between the starting and ending index
  //eg : [10,20,30,40].slice(2) => [30,40]
  let finalData = data.slice(start).slice(0, per_page);
  total_pages = Math.ceil(data.length / per_page);
  return {
    page: page,
    per_page: per_page,
    //in javascript 0 is false
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total_pages: total_pages,
    data: finalData,
  };
}

module.exports = {
  paginator,
};
