import { Octokit } from "octokit";

(async function () {

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH
  })

  const res = await octokit.request('GET /user/repos', {})

  console.log(res)
}());
