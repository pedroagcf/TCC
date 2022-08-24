import { Octokit } from "octokit";
import * as dotenv from 'dotenv'

(async function () {
  dotenv.config()

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH
  })

  const res = await octokit.request('GET /user/repos', {})
  console.log(res)
  console.log(process.env.GITHUB_AUTH)

}());
