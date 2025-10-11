import { NextResponse } from "next/server";

/**
 * Fetches GitHub contribution data using GitHub GraphQL API
 * Uses GitHub Personal Access Token from env variables
 * @param {Request} request - The request object containing query parameters
 * @returns {Promise<Response>} - The contribution calendar data
 */
export async function GET(request) {
  try {
    // GitHub GraphQL endpoint
    const endpoint = "https://api.github.com/graphql";
    
    // GitHub username - this should be your GitHub username
    const username = "arkalal";
    
    // Get the year from query parameter or default to current year
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    
    let fromDate, toDate;
    
    if (yearParam) {
      // If specific year is requested, get exactly Jan 1 to Dec 31 of that year
      const year = parseInt(yearParam);
      
      // Always use the full year range for consistent results
      fromDate = new Date(year, 0, 1); // January 1st at 00:00:00
      fromDate.setHours(0, 0, 0, 0);
      
      toDate = new Date(year, 11, 31); // December 31st
      toDate.setHours(23, 59, 59, 999); // End of day
    } else {
      // Default: Get the current date and date from 1 year ago
      toDate = new Date(); // Use today including latest contributions
      toDate.setHours(23, 59, 59, 999);
      
      fromDate = new Date();
      fromDate.setFullYear(toDate.getFullYear() - 1);
      fromDate.setHours(0, 0, 0, 0);
    }
    
    // Force setting hours to ensure we get all contributions for the day
    toDate.setHours(23, 59, 59, 999);
    
    // Format dates for the GraphQL query using RFC 3339 format (with time component)
    // GitHub's GraphQL API expects DateTime values in full RFC 3339 format
    const from = fromDate.toISOString();
    const to = toDate.toISOString();
    
    // Add year info to response for validation on client side
    const selectedYearInfo = yearParam ? parseInt(yearParam) : null;
    
    // GraphQL query to fetch contribution data
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
              weeks {
                firstDay
                contributionDays {
                  date
                  contributionCount
                  color
                  weekday
                }
              }
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
    
    // Return contribution data with year info for validation
    return NextResponse.json({
      contributionData: data.data.user.contributionsCollection.contributionCalendar,
      year: selectedYearInfo,
      from: fromDate.toISOString().split('T')[0],
      to: toDate.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error("Error fetching GitHub contribution data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
