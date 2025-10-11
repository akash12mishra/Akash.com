"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useGithubContributions } from "../../../utils/useGithubContributions";
import { useGithubRepositories } from "../../../utils/useGithubRepositories";
import { FaGithub, FaSync, FaExternalLinkAlt, FaStar, FaCodeBranch, FaCode, FaEye } from "react-icons/fa";
import { HiCode } from "react-icons/hi";
import { GoRepo, GoGitPullRequest, GoIssueOpened, GoCommit } from "react-icons/go";
import Link from "next/link";
import styles from "./GitHubAnalytics.module.scss";

const YEARS_DEFAULT_DISPLAY = 2; // Number of years to show by default in the timeline

const GitHubAnalytics = () => {
  const { contributionData, loading: contribLoading, error: contribError, refetch: refetchContrib } = useGithubContributions();
  const { reposData, loading: reposLoading, error: reposError, refetch: refetchRepos } = useGithubRepositories();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAllYears, setShowAllYears] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'repos', 'activity'
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchContrib(), refetchRepos()]);
    setIsRefreshing(false);
  };
  
  // Format number with comma separators
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

  // Calculate loading and error states
  const isLoading = contribLoading || reposLoading;
  const hasError = contribError || reposError;
  
  // Default to current year if no data available
  const contributionYears = [new Date().getFullYear(), new Date().getFullYear() - 1];
  
  // Determine which years to show (all or just recent ones)
  const displayYears = showAllYears 
    ? contributionYears 
    : contributionYears.slice(0, YEARS_DEFAULT_DISPLAY);
  
  // Render loading state
  if (isLoading) {
    return (
      <section className={styles.githubSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>GitHub</span>
            <h2 className={styles.heading}>
              Coding <span>Activity</span>
            </h2>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}></div>
            <p>Loading GitHub data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <section className={styles.githubSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>GitHub</span>
            <h2 className={styles.heading}>
              Coding <span>Activity</span>
            </h2>
          </div>
          <div className={styles.errorContainer}>
            <p>Unable to load GitHub data</p>
            <button 
              className={`${styles.retryButton} ${isRefreshing ? styles.spinning : ''}`} 
              onClick={handleRefresh} 
              aria-label="Retry fetching GitHub data"
              disabled={isRefreshing}
            >
              <FaSync /> Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Return early if data isn't loaded yet
  if (!contributionData || !reposData) {
    return null;
  }
  
  // Extract relevant data for display
  const { totalContributions: heatmapContributions } = contributionData || {};
  const {
    login,
    name,
    url: profileUrl,
    avatarUrl,
    repositories,
    repositoriesContributedTo,
    contributionsCollection
  } = reposData || {};
  
  // Calculate accurate total contributions by type
  const totalContributions = contributionsCollection?.contributionCalendar?.totalContributions || 0;
  const totalCommits = contributionsCollection?.totalCommitContributions || 0;
  const totalIssues = contributionsCollection?.totalIssueContributions || 0;
  const totalPRs = contributionsCollection?.totalPullRequestContributions || 0;
  const totalReviews = contributionsCollection?.totalPullRequestReviewContributions || 0;
  
  // Get total repositories contributed to
  const totalRepos = repositories?.totalCount || 0;
  
  // Calculate total commit count across repos
  let repoCommitsCount = 0;
  repositories?.nodes?.forEach(repo => {
    if (repo?.defaultBranchRef?.target?.history?.totalCount) {
      repoCommitsCount += repo.defaultBranchRef.target.history.totalCount;
    }
  });
  
  // Use the most accurate commit count available
  const displayedCommits = totalCommits > 0 ? totalCommits : repoCommitsCount;

  // Build recent contribution repositories sorted by actual commit contribution date
  const commitRepos = contributionsCollection?.commitContributionsByRepository || [];
  const recentContributionRepos = commitRepos
    .map((item) => {
      const nodes = item?.contributions?.nodes || [];
      let latestAt = 0;
      for (let i = 0; i < nodes.length; i++) {
        const t = new Date(nodes[i].occurredAt).getTime();
        if (!Number.isNaN(t) && t > latestAt) latestAt = t;
      }
      const fallback = item?.repository?.pushedAt || item?.repository?.updatedAt;
      if (!latestAt && fallback) latestAt = new Date(fallback).getTime();
      return {
        ...item.repository,
        commitsInRange: item?.contributions?.totalCount || 0,
        latestAt,
      };
    })
    .sort((a, b) => b.latestAt - a.latestAt);

  const activityTop3 = recentContributionRepos.slice(0, 3);
  const activityOtherCount = Math.max(recentContributionRepos.length - activityTop3.length, 0);
  const useCommitRepoSource = activityTop3.length > 0;

  // Final dataset for the Activity tab and the remaining count
  const displayActivity = useCommitRepoSource
    ? activityTop3
    : (repositoriesContributedTo?.nodes || []).slice(0, 3);
  const displayOtherCount = useCommitRepoSource
    ? activityOtherCount
    : Math.max((repositoriesContributedTo?.nodes?.length || 0) - displayActivity.length, 0);

  // Prepare repositories sorted by latest commit/push
  const reposSortedByRecent = (repositories?.nodes || [])
    .map((repo) => {
      const latestCommit = repo?.defaultBranchRef?.target?.history?.nodes?.[0]?.committedDate;
      const sortTime = latestCommit
        ? new Date(latestCommit).getTime()
        : repo?.pushedAt
          ? new Date(repo.pushedAt).getTime()
          : repo?.updatedAt
            ? new Date(repo.updatedAt).getTime()
            : 0;
      return { ...repo, __sortTime: sortTime };
    })
    .sort((a, b) => b.__sortTime - a.__sortTime);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={styles.githubSection}
      id="github-repos"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>GitHub</span>
          <h2 className={styles.heading}>
            GitHub <span>Repositories</span>
          </h2>
          <p className={styles.subheading}>
            My top projects and recent activity on GitHub
          </p>
          <button 
            className={`${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`} 
            onClick={handleRefresh} 
            aria-label="Refresh GitHub data"
            disabled={isRefreshing}
          >
            <FaSync />
          </button>
        </div>

        {/* GitHub Profile Summary */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <HiCode className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{formatNumber(totalContributions)}</span>
                    <span className={styles.statLabel}>Contributions</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <GoRepo className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{formatNumber(totalRepos)}</span>
                    <span className={styles.statLabel}>Repositories</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <GoGitPullRequest className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{formatNumber(displayedCommits)}</span>
                    <span className={styles.statLabel}>Commits</span>
                  </div>
                </div>
              </div>
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.viewProfileButton}
              >
                <FaGithub /> View GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'repos' ? styles.active : ''}`}
              onClick={() => setActiveTab('repos')}
            >
              Top Repositories
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'activity' ? styles.active : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
          </div>
          
          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                <div className={styles.contributionTypes}>
                  <div className={styles.contributionTypeItem}>
                    <div className={styles.contributionTypeIcon}>
                      <GoGitPullRequest />
                    </div>
                    <div className={styles.contributionTypeDetails}>
                      <span className={styles.contributionTypeValue}>{formatNumber(displayedCommits)}</span>
                      <span className={styles.contributionTypeLabel}>Commits</span>
                    </div>
                  </div>
                  
                  <div className={styles.contributionTypeItem}>
                    <div className={styles.contributionTypeIcon}>
                      <FaCodeBranch />
                    </div>
                    <div className={styles.contributionTypeDetails}>
                      <span className={styles.contributionTypeValue}>{formatNumber(totalPRs)}</span>
                      <span className={styles.contributionTypeLabel}>Pull Requests</span>
                    </div>
                  </div>
                  
                  <div className={styles.contributionTypeItem}>
                    <div className={styles.contributionTypeIcon}>
                      <GoIssueOpened />
                    </div>
                    <div className={styles.contributionTypeDetails}>
                      <span className={styles.contributionTypeValue}>{formatNumber(totalIssues)}</span>
                      <span className={styles.contributionTypeLabel}>Issues</span>
                    </div>
                  </div>
                  
                  <div className={styles.contributionTypeItem}>
                    <div className={styles.contributionTypeIcon}>
                      <FaEye />
                    </div>
                    <div className={styles.contributionTypeDetails}>
                      <span className={styles.contributionTypeValue}>{formatNumber(totalReviews)}</span>
                      <span className={styles.contributionTypeLabel}>Reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Repositories Tab */}
            {activeTab === 'repos' && (
              <div className={styles.reposTab}>
                <h4>Top Repositories</h4>
                <div className={styles.reposList}>
                  {reposSortedByRecent.map((repo, index) => (
                    <div key={repo.url + index} className={styles.repoCard}>
                      <h5 className={styles.repoName}>{repo.name}</h5>
                      <p className={styles.repoDescription}>
                        {repo.description || 'No description available'}
                      </p>
                      
                      {repo.primaryLanguage && (
                        <div className={styles.repoLanguage}>
                          <span 
                            className={styles.languageColor} 
                            style={{ backgroundColor: repo.primaryLanguage.color }}
                          ></span>
                          <span className={styles.languageName}>{repo.primaryLanguage.name}</span>
                        </div>
                      )}
                      
                      <div className={styles.repoStats}>
                        <div className={styles.repoStat}>
                          <FaStar className={styles.repoStatIcon} />
                          <span>{formatNumber(repo.stargazerCount)}</span>
                        </div>
                        <div className={styles.repoStat}>
                          <FaCodeBranch className={styles.repoStatIcon} />
                          <span>{formatNumber(repo.forkCount)}</span>
                        </div>
                      </div>
                      
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.repoLink}
                      >
                        <FaExternalLinkAlt /> View Repository
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className={styles.activityTab}>
                <h4>Recently Contributed To</h4>
                
                {displayActivity.length === 0 ? (
                  <div className={styles.emptyStateContainer}>
                    <p>No recent contributions found. Refreshing data may help.</p>
                    <button 
                      onClick={handleRefresh}
                      className={styles.refreshDataButton}
                      disabled={isRefreshing}
                    >
                      <FaSync className={isRefreshing ? styles.spinning : ''} /> Refresh Data
                    </button>
                  </div>
                ) : (
                  <div className={styles.contributedReposList}>
                    {/* Show only top 3 latest repositories by actual commit activity */}
                    {displayActivity.map((repo, index) => (
                      <div key={repo.url + index} className={styles.repoCard}>
                        <h5 className={styles.repoName}>{repo.nameWithOwner || repo.name}</h5>
                        <p className={styles.repoDescription}>
                          {repo.description || 'No description available'}
                        </p>
                        
                        {repo.primaryLanguage && (
                          <div className={styles.repoLanguage}>
                            <span 
                              className={styles.languageColor} 
                              style={{ backgroundColor: repo.primaryLanguage.color }}
                            ></span>
                            <span className={styles.languageName}>{repo.primaryLanguage.name}</span>
                          </div>
                        )}
                        
                        <div className={styles.repoStats}>
                          <div className={styles.repoStat}>
                            <GoCommit className={styles.repoStatIcon} />
                            <span>{formatNumber((repo.commitsInRange ?? (repo.defaultBranchRef?.target?.history?.totalCount || 0)))} commits</span>
                          </div>
                          <div className={styles.repoStat}>
                            <FaStar className={styles.repoStatIcon} />
                            <span>{formatNumber(repo.stargazerCount)}</span>
                          </div>
                          <div className={styles.repoStat}>
                            <FaCodeBranch className={styles.repoStatIcon} />
                            <span>{formatNumber(repo.forkCount)}</span>
                          </div>
                        </div>
                        
                        <div className={styles.repoActions}>
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.repoLink}
                          >
                            <FaExternalLinkAlt /> View Repository
                          </a>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show count of other repositories if there are more than 3 */}
                    {displayOtherCount > 0 && (
                      <div className={styles.otherReposCount}>
                        and {displayOtherCount} other repositories recently contributed to
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default GitHubAnalytics;
