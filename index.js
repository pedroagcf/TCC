const lda = require('lda');
const { getCSV } = require('./src/csv');
const { getRepositories, getReadme } = require('./src/api');
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

  const results = [];
  for (let repo of repositories) {
    let { description, owner, name } = repo

    if (!description) continue;

    let readmeText = await getReadme(owner, name)
    let descriptionDoc = description.match(/[^\.!\?]+[\.!\?]+/g)
    let readmeTextDoc = readmeText.match(/[^\.!\?]+[\.!\?]+/g)

    if (!readmeTextDoc) {
      results.push(lda(descriptionDoc, 2, 5))
    } else {
      console.log("readmeTextDoc", readmeTextDoc)
      // let document = descriptionDoc.concat(readmeTextDoc)
      // results.push(lda(document, 2, 5))
    }
  }

  // console.log(results[0])
  // getCSV(repositories, programmingLanguage)
})



  // .sort((a, b) => b.size - a.size)

// It outputted two topics,
// where each topic is a composite of keywords and each keyword has a specific weighting for the
// topic. Since only repositories that contained an application were accepted, projects that returned
// plugin, module, extension, API, database, framework, library, etc

