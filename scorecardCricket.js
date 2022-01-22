const request = require("request");
const cheerio = require("cheerio");
// const { text } = require("figlet");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

// const url =
//   "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

function processScoreCard(url) {
  request(url, cb);
}
// request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractMatchDetails(html);
  }
}

function extractMatchDetails(html) {
  let $ = cheerio.load(html);

  const DescElem = $(".description");
  let result = $(".event .status-text");
  const stringvalue = $(DescElem[0]).text().split(",");
  const venu = stringvalue[1].trim();
  const date = stringvalue[2].trim();
  result = result.text();
  let innigsArr = $(".card.content-block.match-scorecard-table>.Collapsible");
  //   let htmlString = "";
  for (let i = 0; i < innigsArr.length; i++) {
    // htmlString += $(innigsArr[i]).html();
    let teamName = $(innigsArr[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentTeamName = $(innigsArr[opponentIndex]).find("h5").text();
    opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
    console.log(`${venu}-----${date}----${teamName}---${opponentTeamName}`);
    let currentInning = $(innigsArr[i]);
    let allRos = currentInning.find(".table.batsman tbody tr");
    for (let j = 0; j < allRos.length; j++) {
      let allCols = $(allRos[j]).find("td");
      let itHas = $(allCols[0]).hasClass("batsman-cell");
      if (itHas) {
        // console.log(allCols.text());
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);

        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          sr,
          opponentTeamName,
          venu,
          date,
          result
        );
      }
    }
  }
}

module.exports = {
  ps: processScoreCard,
};

function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  sr,
  opponentTeamName,
  venu,
  date,
  result
) {
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentTeamName,
    venu,
    date,
    result,
  };
  content.push(playerObj);
  excleWriter(filePath, content, playerName);
}

function dirCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}

function excleWriter(filePath, json, sheetName) {
  let newWB = xlsx.utils.book_new();
  //json data-> excel format convert
  let newWS = xlsx.utils.json_to_sheet(json);
  //> newwb,ws,sheet name
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  // filePath
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) === false) {
    return [];
  }
  //workbook get
  let wb = xlsx.readFile(filePath);
  // sheet
  let excelData = wb.Sheets[sheetName];
  //sheet data
  let ans = xlsx.utils.sheet_to_json(excelData);
  // console.log(ans);
  return ans;
}