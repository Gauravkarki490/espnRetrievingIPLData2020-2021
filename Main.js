const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const AllMatchObj = require("./AllMatchCricket");

const path = require("path");

const iplPath = path.join(__dirname, "IPL");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
direCreator(iplPath);

request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractLink(html);
  }
}

function extractLink(html) {
  let $ = cheerio.load(html);
  const anchorElem = $("a[data-hover='View All Results']");
  const link = anchorElem.attr("href");
  const fullLink = "https://www.espncricinfo.com" + link;
  // console.log(fullLink);
  //   getAllMatchesLink(fullLink);
  AllMatchObj.gAlmatches(fullLink);
}

function direCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}
