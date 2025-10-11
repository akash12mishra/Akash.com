"use client";

import { useState, useEffect } from 'react';

// Cache version to invalidate old caches
const REPOS_CACHE_VERSION = '1.0';

/**
 * Custom hook to fetch and cache GitHub repositories data
 * Implements hourly refresh mechanism with localStorage caching
 */
export function useGithubRepositories() {
  const [reposData, setReposData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReposData = async () => {
      try {
        setLoading(true);
        
        // Clear any existing cache to ensure fresh data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('githubRepositories')) {
            localStorage.removeItem(key);
          }
        });
        
        // Skip cache check and always fetch fresh data
        const now = new Date().getTime();
        
        // Fetch fresh data from our API
        const response = await fetch('/api/github/repositories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.userData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Update state with fetched data
        setReposData(data.userData);
        
        // No caching - always use fresh data
        console.log('Fetched fresh GitHub repository data');
      } catch (err) {
        console.error('Error fetching GitHub repositories:', err);
        setError(err.message);
        
        // No fallback to cached data - report the error to user
      } finally {
        setLoading(false);
      }
    };

    fetchReposData();
  }, []);

  return {
    reposData,
    loading,
    error,
    refetch: async () => {
      // Clear all GitHub-related caches
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('githubContributions') || key.startsWith('githubRepositories')) {
          localStorage.removeItem(key);
        }
      });
      
      try {
        setLoading(true);
        const response = await fetch('/api/github/repositories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.userData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Update state with fetched data
        setReposData(data.userData);
        console.log('Refreshed GitHub repository data');
        setError(null);
      } catch (err) {
        console.error('Error refetching GitHub repositories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };
}
