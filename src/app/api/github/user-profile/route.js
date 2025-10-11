import { NextResponse } from "next/server";

/**
 * Fetches GitHub user profile data and repository information
 * @returns {Promise<Response>} User profile and repository data
 */
export async function GET() {
  try {
    // GitHub GraphQL endpoint
    const endpoint = "https://api.github.com/graphql";
    
    // GitHub username - should match the one used in contributions API
    const username = "arkalal";
    
    // GraphQL query to fetch user profile and repositories data
    const query = `
      query {
        user(login: "${username}") {
          # Basic user info
          login
          name
          bio
          url
          avatarUrl
          company
          location
          websiteUrl
          twitterUsername
          followers {
            totalCount
          }
          following {
            totalCount
          }
          
          # Pinned repositories
          pinnedItems(first: 6, types: [REPOSITORY]) {
            nodes {
              ... on Repository {
                name
                nameWithOwner
                description
                url
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
                }
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  nodes {
                    name
                    color
                  }
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                updatedAt
              }
            }
          }
          
          # Top repositories by stars
          repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: [OWNER]) {
            totalCount
            nodes {
              name
              nameWithOwner
              description
              url
              stargazerCount
              forkCount
              isPrivate
              primaryLanguage {
                name
                color
              }
              updatedAt
            }
          }
          
          # Recent activity on repositories
          repositoriesContributedTo(first: 10, contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY, PULL_REQUEST_REVIEW], includeUserRepositories: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
            totalCount
            nodes {
              name
              nameWithOwner
              description
              url
              stargazerCount
              forkCount
              isPrivate
              primaryLanguage {
                name
                color
              }
              updatedAt
            }
          }
          
          # Total contribution stats by year
          contributionsCollection {
            contributionYears
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            totalRepositoriesWithContributedIssues
            totalRepositoriesWithContributedPullRequests
            totalRepositoriesWithContributedPullRequestReviews
          }
        }
      }
    `;
    
    // Make the request to GitHub API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store", // Disable caching to ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if there's an error in the response
    if (data.errors) {
      const errorDetails = JSON.stringify(data.errors, null, 2);
      console.error("GitHub API Error:", errorDetails);
      return NextResponse.json({ error: `GitHub API Error: ${data.errors[0].message}`, details: data.errors }, { status: 500 });
    }
    
    // Return user profile and repository data
    return NextResponse.json({
      profileData: data.data.user,
    });
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
