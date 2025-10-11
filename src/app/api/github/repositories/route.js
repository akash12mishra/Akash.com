import { NextResponse } from "next/server";

/**
 * Fetches GitHub repositories and activity data
 * @returns {Promise<Response>} Repository and activity data
 */
export async function GET() {
  try {
    // GitHub GraphQL endpoint
    const endpoint = "https://api.github.com/graphql";
    
    // GitHub username - should match the one used in contributions API
    const username = "arkalal";
    
    // Get the current date and date from 1 year ago
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Format dates for the GraphQL query
    const from = oneYearAgo.toISOString();
    const to = today.toISOString();
    
    // GraphQL query to fetch repositories and activity data with accurate contributions
    const query = `
      query {
        user(login: "${username}") {
          # Basic user info
          login
          name
          avatarUrl
          bio
          url
          
          # Repositories ordered by latest push activity
          repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: [OWNER]) {
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
              pushedAt
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 1) {
                      totalCount
                      nodes { committedDate }
                    }
                  }
                }
              }
            }
          }
          
          # Recent activity on repositories - ordered by most recent push activity
          repositoriesContributedTo(first: 15, contributionTypes: [COMMIT, PULL_REQUEST], includeUserRepositories: true, orderBy: {field: PUSHED_AT, direction: DESC}) {
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
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 1) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
          
          # Annual contributions data
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
            }
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
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
                pushedAt
                updatedAt
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(first: 1) {
                        totalCount
                      }
                    }
                  }
                }
              }
              contributions(first: 100) {
                totalCount
                nodes {
                  occurredAt
                }
              }
            }
            issueContributions(first: 1) {
              totalCount
            }
            pullRequestContributions(first: 1) {
              totalCount
            }
            pullRequestReviewContributions(first: 1) {
              totalCount
            }
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
    
    // Return repository and activity data
    return NextResponse.json({
      userData: data.data.user,
    });
  } catch (error) {
    console.error("Error fetching GitHub repositories data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
