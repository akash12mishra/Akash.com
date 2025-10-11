"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch and cache GitHub profile data
 * Implements daily refresh mechanism with localStorage caching
 */
export function useGithubProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Check if we have cached data in localStorage
        const cachedData = localStorage.getItem('githubProfileData');
        const lastFetched = localStorage.getItem('githubProfileTimestamp');
        const now = new Date().getTime();
        
        // If we have cached data and it's less than a day old, use it
        if (cachedData && lastFetched && (now - parseInt(lastFetched)) < 24 * 60 * 60 * 1000) {
          setProfileData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
        
        // Fetch fresh data from our API
        const response = await fetch('/api/github/user-profile');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub profile: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.profileData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Update state with fetched data
        setProfileData(data.profileData);
        
        // Cache the data in localStorage
        localStorage.setItem('githubProfileData', JSON.stringify(data.profileData));
        localStorage.setItem('githubProfileTimestamp', now.toString());
      } catch (err) {
        console.error('Error fetching GitHub profile:', err);
        setError(err.message);
        
        // If we have cached data, use it as fallback even if it's old
        const cachedData = localStorage.getItem('githubProfileData');
        if (cachedData) {
          setProfileData(JSON.parse(cachedData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return {
    profileData,
    loading,
    error,
    refetch: async () => {
      // Clear cache and fetch again
      localStorage.removeItem('githubProfileData');
      localStorage.removeItem('githubProfileTimestamp');
      
      try {
        setLoading(true);
        const response = await fetch('/api/github/user-profile');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub profile: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Make sure we have the expected data structure
        if (!data.profileData) {
          throw new Error('Invalid response format from GitHub API');
        }
        
        // Update state with fetched data
        setProfileData(data.profileData);
        
        // Cache the data in localStorage
        localStorage.setItem('githubProfileData', JSON.stringify(data.profileData));
        localStorage.setItem('githubProfileTimestamp', new Date().getTime().toString());
        setError(null);
      } catch (err) {
        console.error('Error refetching GitHub profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };
}
