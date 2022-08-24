import { Octokit } from "octokit";
import * as dotenv from 'dotenv'

(async function () {
  dotenv.config()

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH
  })

  const { data } = await octokit.request('GET /search/repositories?q=language:javascript&sort=stars&order=desc', {})
  console.log(data)

}());
