const fs = require('fs');
const { getCSV } = require('./src/csv');
const { getRepositories } = require('./src/api');

let programmingLanguage = process.argv[process.argv.indexOf('-l') + 1];
let size = process.argv[process.argv.indexOf('-s') + 1];

// RequestError [HttpError]: Only the first 1000 search results are available
Promise.allSettled(Array.from(Array(10)).map((_, i) => getRepositories(programmingLanguage, size, i + 1))).then((data) => {
  const res = data.flatMap(({ value }) => value.items)
  const jsonString = JSON.stringify(res[0])

  fs.writeFile(`./src/${programmingLanguage}-repositories.json`, jsonString, err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote Json file')
    }
  })


  const repositories = res.map(({ name, language, html_url, created_at, size, stargazers_count, has_issues, score, forks, watchers }) => {
    return { name, language, html_url, created_at, size, stargazers_count, has_issues, score, forks, watchers }
  }).sort((a, b) => b.size - a.size)

  getCSV(repositories, programmingLanguage)
})


