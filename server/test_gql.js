const fetch = require('node-fetch'); // we can use global fetch in Node 18+
async function test() {
  const query = `
    query problemsetQuestionList($limit: Int, $skip: Int) {
      problemsetQuestionList: questionList(categorySlug: "", limit: $limit, skip: $skip, filters: {}) {
        questions: data {
          titleSlug
        }
      }
    }
  `;
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { limit: 2, skip: 0 } })
  });
  console.log(await res.json());
}
test();
