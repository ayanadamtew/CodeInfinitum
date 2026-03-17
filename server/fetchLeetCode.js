import fs from 'fs';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

const PROBLEM_LIST_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      total: totalNum
      questions: data {
        titleSlug
        isPaidOnly
      }
    }
  }
`;

const QUESTION_DATA_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      content
      difficulty
      topicTags {
        name
      }
      codeSnippets {
        langSlug
        code
      }
      hints
      exampleTestcaseList
    }
  }
`;

const langMap = {
  javascript: 'javascript',
  python3: 'python',
  java: 'java',
  cpp: 'cpp'
};

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function fetchProblems(limit = 50) {
  console.log(`Fetching list of ${limit} problems...`);
  
  const listData = await fetchWithRetry(LEETCODE_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: PROBLEM_LIST_QUERY,
      variables: { categorySlug: "", skip: 0, limit: limit * 2, filters: {} } // fetch more in case of premium
    })
  });

  const allQuestions = listData.data.problemsetQuestionList.questions;
  const freeQuestions = allQuestions.filter(q => !q.isPaidOnly).slice(0, limit);
  
  console.log(`Found ${freeQuestions.length} free problems. Fetching details...`);

  const problems = [];
  
  for (let i = 0; i < freeQuestions.length; i++) {
    const slug = freeQuestions[i].titleSlug;
    console.log(`[${i + 1}/${limit}] Fetching details for ${slug}...`);
    
    const detailData = await fetchWithRetry(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: QUESTION_DATA_QUERY,
        variables: { titleSlug: slug }
      })
    });
    
    const q = detailData.data.question;
    
    // Map initial code
    const initialCode = {};
    if (q.codeSnippets) {
      q.codeSnippets.forEach(snippet => {
        if (langMap[snippet.langSlug]) {
          initialCode[langMap[snippet.langSlug]] = snippet.code;
        }
      });
    }

    // Map test cases
    const testCases = [];
    if (q.exampleTestcaseList && q.exampleTestcaseList.length > 0) {
      // Just mock the expected output for now as LeetCode doesn't provide it via this simple API directly
      q.exampleTestcaseList.forEach((tc, idx) => {
        testCases.push({
          input: tc,
          expectedOutput: "Run code to see output", // Placeholder
          isVisible: true
        });
      });
    }

    const tags = q.topicTags ? q.topicTags.map(t => t.name) : [];
    const topicName = tags.length > 0 ? tags[0] : 'General';
    
    const problemRecord = {
      title: q.title,
      topicName: topicName,
      statement: q.content || "<p>No description available.</p>",
      difficulty: q.difficulty,
      tags: tags,
      examples: [], // Content already includes examples in HTML form, so we leave it empty to avoid duplication
      constraints: [], // Constraints are also in the HTML content usually
      timeLimit: 2000,
      memoryLimit: 256000,
      initialCode: initialCode,
      testCases: testCases,
      solution: {
        explanation: "<p>Check the submissions tab to see community solutions, or look at the constraints bounds to think about time complexity.</p>",
        code: initialCode, // Just paste the template as solution for now to prevent crashing
        complexity: { time: "O(?)", space: "O(?)" }
      }
    };
    
    problems.push(problemRecord);
    
    // rate limiting delay
    await new Promise(r => setTimeout(r, 800));
  }
  
  // Save to file
  fs.writeFileSync('./leetcodeData.json', JSON.stringify(problems, null, 2));
  console.log('Saved to leetcodeData.json');
}

fetchProblems(50).catch(console.error);
