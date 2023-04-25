require('dotenv/config');
const lda = require('lda');
const { Octokit } = require("@octokit/rest");
const { decodeBase64 } = require('./utils');

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN
})

async function getRepositories(language, size, index) {

  const queryString = `q=${language} in:readme+language:${language}&size:<=${size}`;

  const { data } = await octokit.rest.search.repos({
    q: queryString,
    per_page: 100,
    page: index,
    sort: "stars"
  })

  return data;
}

async function getReadme(owner, repoName) {

  const { data } = await octokit.rest.repos.getReadme({
    owner,
    repo: repoName,
  })
  const readmeContent = decodeBase64(data.content)

  return readmeContent
}

function filterByDescription(repositories) {

  const forbiddenKeys = ["plugin", "module", "extension", "API", "database", "framework", "library", "Library"]
  const appRepository = repositories.filter(repo => {
    let { description } = repo

    if (!description) {
      return false
    }

    let descriptionDoc = description.match(/[^\.!\?]+[\.!\?]+/g)
    const keyTerms = lda(descriptionDoc, 2, 5).flat()

    const invalidRepository = keyTerms.some(({ term }) => forbiddenKeys.includes(term))

    if (invalidRepository) {
      return false
    } else {
      return repo
    }
  })

  return appRepository
}

module.exports = {
  filterByDescription,
  getRepositories,
  getReadme
}
