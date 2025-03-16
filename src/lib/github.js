import { Octokit } from '@octokit/rest';

// Create an Octokit instance
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Function to get user repositories
export async function getRepositories(username, count = 10) {
  try {
    const response = await octokit.repos.listForUser({
      username,
      sort: 'updated',
      per_page: count,
    });

    return response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated: repo.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

// Function to get user activity
export async function getUserActivity(username, count = 10) {
  try {
    const response = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: count,
    });

    return response.data.map(event => {
      // Process different event types
      let description = '';
      
      switch (event.type) {
        case 'PushEvent':
          description = `Pushed to ${event.repo.name}`;
          break;
        case 'PullRequestEvent':
          description = `${event.payload.action} pull request in ${event.repo.name}`;
          break;
        case 'IssuesEvent':
          description = `${event.payload.action} issue in ${event.repo.name}`;
          break;
        case 'CreateEvent':
          description = `Created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        default:
          description = `Activity in ${event.repo.name}`;
      }

      return {
        id: event.id,
        type: event.type,
        description,
        repo: event.repo.name,
        date: event.created_at,
      };
    });
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return [];
  }
}

// Function to get a specific repository
export async function getRepository(owner, repo) {
  try {
    const response = await octokit.repos.get({
      owner,
      repo,
    });

    const readmeResponse = await octokit.repos.getReadme({
      owner,
      repo,
    }).catch(() => null);

    return {
      id: response.data.id,
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      url: response.data.html_url,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language,
      topics: response.data.topics,
      updated: response.data.updated_at,
      created: response.data.created_at,
      readme: readmeResponse ? atob(readmeResponse.data.content) : null,
    };
  } catch (error) {
    console.error('Error fetching repository:', error);
    return null;
  }
}