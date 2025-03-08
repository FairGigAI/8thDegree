#!/bin/bash

# Configuration
REPO_OWNER="8thDegree"
REPO_NAME="8thDegree"
GITHUB_TOKEN="${GITHUB_TOKEN}"
MIRROR_DIR="repo-mirrors"
LOG_FILE="fork-monitor.log"

# Create mirror directory
mkdir -p "${MIRROR_DIR}"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

# Function to check forks
check_forks() {
    log_message "Checking forks..."
    
    # Get list of forks
    FORKS=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/forks")
    
    # Process each fork
    echo "${FORKS}" | jq -r '.[] | .full_name' | while read -r fork; do
        log_message "Analyzing fork: ${fork}"
        
        # Clone fork for analysis
        git clone --mirror "https://github.com/${fork}.git" "${MIRROR_DIR}/${fork//\//_}"
        
        # Check for unauthorized changes
        cd "${MIRROR_DIR}/${fork//\//_}"
        CHANGES=$(git log --pretty=format:"%H" origin/main..HEAD)
        
        if [ ! -z "${CHANGES}" ]; then
            log_message "WARNING: Unauthorized changes detected in ${fork}"
            
            # Check for sensitive files
            git diff --name-only origin/main..HEAD | while read -r file; do
                if [[ "${file}" =~ ^(backend/|ai/|config/) ]]; then
                    log_message "ALERT: Sensitive file modified: ${file}"
                fi
            done
        fi
        
        cd ../..
    done
}

# Function to check clones
check_clones() {
    log_message "Checking clone traffic..."
    
    # Get clone traffic
    CLONES=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/traffic/clones")
    
    # Analyze clone patterns
    TOTAL_CLONES=$(echo "${CLONES}" | jq '.count')
    UNIQUE_CLONERS=$(echo "${CLONES}" | jq '.uniques')
    
    log_message "Total clones: ${TOTAL_CLONES}"
    log_message "Unique cloners: ${UNIQUE_CLONERS}"
    
    # Alert on suspicious patterns
    if [ "${TOTAL_CLONES}" -gt 100 ]; then
        log_message "ALERT: High number of clones detected!"
    fi
}

# Function to check for code similarities
check_similarities() {
    log_message "Checking for code similarities..."
    
    # List of repositories to check
    REPOS_TO_CHECK=(
        "competitor1/repo1"
        "competitor2/repo2"
    )
    
    for repo in "${REPOS_TO_CHECK[@]}"; do
        log_message "Checking repository: ${repo}"
        
        # Clone repository for analysis
        git clone --mirror "https://github.com/${repo}.git" "${MIRROR_DIR}/${repo//\//_}"
        
        # Run similarity analysis
        # Add your preferred code similarity tool here
        # Example: Using simian, PMD's CPD, or custom analysis
    done
}

# Main monitoring loop
while true; do
    log_message "Starting monitoring cycle..."
    
    check_forks
    check_clones
    check_similarities
    
    # Clean up
    rm -rf "${MIRROR_DIR}"/*
    
    log_message "Monitoring cycle complete. Waiting for next cycle..."
    sleep 3600 # Wait for 1 hour before next check
done 