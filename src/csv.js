const fs = require("fs");

const getCSV = function (data, fileName) {

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header]
      return `"${val}"`;
    });

    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');

  fs.writeFile(`./src/spreadsheet/${fileName}-repositories.csv`, csvString, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("Data saved");
  });
};

module.exports = {
  getCSV
}