require('dotenv/config');
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN
})

const getRepositories = (language, size, index) => new Promise((resolve, reject) => {

  const queryString = `q=${language} in:readme+language:${language}&size:<=${size}`;

  const res = octokit.rest.search.repos({
    q: queryString,
    per_page: 100,
    page: index,
  }).then(({ data }, err) => {
    return data
  })

  resolve(res)
})

module.exports = {
  getRepositories
}
