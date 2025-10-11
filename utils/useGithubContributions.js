"use client";

import { useState, useEffect } from 'react';

// Cache version to invalidate old caches when the implementation changes
const CACHE_VERSION = '1.1';

/**
 * Custom hook to fetch and cache GitHub contribution data
 * Implements daily refresh mechanism with localStorage caching
 * @param {number} year - Optional year to filter contributions
 */
export function useGithubContributions(year) {
  const [contributionData, setContributionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        
        // Clear all GitHub-related caches to always fetch fresh data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('githubContributions') || key.startsWith('githubRepositories')) {
            localStorage.removeItem(key);
          }
        });
        
        // Always fetch fresh data, don't use cache
        const now = new Date().getTime();
        
        // Fetch fresh data from our API with year parameter if specified
        const url = year ? `/api/github/contributions?year=${year}` : '/api/github/contributions';
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub contributions: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.contributionData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Validate that the returned data is for the requested year
        if (year && data.year && data.year !== year) {
          console.error(`Year mismatch: requested ${year} but got ${data.year}`);
          throw new Error(`Received data for year ${data.year} instead of ${year}`);
        }
        
        // Add year metadata to the contribution data
        const enhancedData = {
          ...data.contributionData,
          _requestedYear: year,
          _responseYear: data.year
        };
        
        // Update state with enhanced data
        setContributionData(enhancedData);
        
        // No caching - always use fresh data
        console.log('Fetched fresh GitHub contribution data');
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(err.message);
        // No fallback to cached data - report error to user
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [year]); // Re-fetch when year changes

  return {
    contributionData,
    loading,
    error,
    // Helper function to clear all GitHub caches
    clearAllCaches: () => {
      // Find all GitHub-related keys in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('githubContributions') || key.startsWith('githubRepositories')) {
          localStorage.removeItem(key);
        }
      });
    },
    
    refetch: async () => {
      // Clear ALL GitHub-related caches to ensure fresh data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('githubContributions') || key.startsWith('githubRepositories')) {
          localStorage.removeItem(key);
        }
      });
      
      
      try {
        setLoading(true);
        // Fetch with year parameter if specified
        const url = year ? `/api/github/contributions?year=${year}` : '/api/github/contributions';
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub contributions: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.contributionData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Validate that the returned data is for the requested year
        if (year && data.year && data.year !== year) {
          console.error(`Year mismatch in refetch: requested ${year} but got ${data.year}`);
          throw new Error(`Received data for year ${data.year} instead of ${year}`);
        }
        
        // Add year metadata to the contribution data
        const enhancedData = {
          ...data.contributionData,
          _requestedYear: year,
          _responseYear: data.year
        };
        
        // Update state with enhanced data
        setContributionData(enhancedData);
        console.log('Refreshed GitHub contribution data');
        setError(null);
      } catch (err) {
        console.error('Error refetching GitHub contributions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };
}
