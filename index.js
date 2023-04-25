const { getCSV } = require('./src/csv');
const { getRepositories, filterByDescription } = require('./src/api');
const { saveJson } = require('./src/utils');

let programmingLanguage = process.argv[process.argv.indexOf('-l') + 1];
let size = process.argv[process.argv.indexOf('-s') + 1];

// RequestError [HttpError]: Only the first 1000 search results are available
Promise.allSettled(Array.from(Array(10)).map((_, i) => getRepositories(programmingLanguage, size, i + 1))).then(async (data) => {
  const normalizedData = data.flatMap(({ value }) => value.items)

  saveJson(programmingLanguage, normalizedData[0])

  const repositories = normalizedData.map(({ name, language, html_url, created_at, size, stargazers_count, has_issues, score, forks, watchers, description, owner }) => {
    return { name, language, html_url, created_at, size, stargazers_count, has_issues, score, forks, watchers, description, owner: owner.login }
  }).filter(el => el.language === "JavaScript")

  const validRepositories = filterByDescription(repositories)

  getCSV(validRepositories, programmingLanguage)

})


