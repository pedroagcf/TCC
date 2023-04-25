const fs = require('fs');

function saveJson(programmingLanguage, data) {
  const jsonString = JSON.stringify(data)
  fs.writeFile(`./src/${programmingLanguage}-repositories.json`, jsonString, err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote Json file')
    }
  })
}

function decodeBase64(data, encoding = "utf-8") {
  let buff = new Buffer(data, 'base64');
  let text = buff.toString(encoding);

  return text;
}

module.exports = {
  saveJson,
  decodeBase64
}
