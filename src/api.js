require('dotenv/config');
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

module.exports = {
  getRepositories,
  getReadme
}
