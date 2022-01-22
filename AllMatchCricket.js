const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecardCricket");

function getAllMatchesLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      // console.log(html);
      getAllLink(html);
    }
  });
}
function getAllLink(html) {
  let $ = cheerio.load(html);
  let scorecardElm = $("a[data-hover='Scorecard']");
  for (let i = 0; i < scorecardElm.length; i++) {
    let link = $(scorecardElm[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    scorecardObj.ps(fullLink);
  }
}

module.exports = {
  gAlmatches: getAllMatchesLink,
};
