#!/bin/bash

# Configuration
ORGANIZATION="8thDegree"
GITHUB_TOKEN="${GITHUB_TOKEN}"
WORKSPACE="$(pwd)/repos"

# Repository definitions
declare -A REPOS=(
    ["8thDegree"]="public"
    ["8thDegree-docs"]="public"
    ["8thDegree-examples"]="public"
    ["8thDegree-core"]="private"
    ["8thDegree-ai"]="private"
    ["8thDegree-infra"]="private"
)

# Create workspace
mkdir -p "${WORKSPACE}"

# Function to setup a repository
setup_repo() {
    local repo_name=$1
    local visibility=$2
    local repo_dir="${WORKSPACE}/${repo_name}"
    
    echo "Setting up ${repo_name} (${visibility})..."
    
    # Create directory
    mkdir -p "${repo_dir}"
    cd "${repo_dir}"
    
    # Initialize git
    git init
    
    # Create basic structure based on repo type
    case ${repo_name} in
        "8thDegree")
            # Main public repository
            mkdir -p frontend/src/{components,styles,lib,hooks}
            mkdir -p docs/{api,guides,examples}
            cp ../../.github/workflows/security.yml .github/workflows/
            cp ../../.github/CODEOWNERS .github/
            cp ../../SECURITY.md .
            ;;
            
        "8thDegree-docs")
            # Documentation repository
            mkdir -p {api,guides,tutorials,examples}
            ;;
            
        "8thDegree-examples")
            # Examples repository
            mkdir -p {frontend,backend,ai}/{basic,advanced}
            ;;
            
        "8thDegree-core")
            # Private core repository
            mkdir -p backend/app/{api,core,models,services}
            mkdir -p backend/tests
            ;;
            
        "8thDegree-ai")
            # Private AI repository
            mkdir -p ai/{models,training,evaluation,services}
            mkdir -p ai/tests
            ;;
            
        "8thDegree-infra")
            # Private infrastructure repository
            mkdir -p {terraform,kubernetes,docker,monitoring}
            ;;
    esac
    
    # Create basic files
    cat > README.md <<EOF
# ${repo_name}

## Overview
${repo_name} is part of the 8thDegree platform. This repository contains ${visibility} components.

## Security
This repository follows our [security policy](SECURITY.md).

## Contributing
Please read our [contributing guidelines](CONTRIBUTING.md).

## License
Apache License 2.0
EOF
    
    # Add security files for private repos
    if [ "${visibility}" == "private" ]; then
        cp ../../SECURITY.md .
        cat > .gitignore <<EOF
# Sensitive files
*.key
*.pem
*.env
.env*
secrets/
EOF
    fi
    
    # Initial commit
    git add .
    git commit -m "Initial repository setup"
    
    # Add remote (this will fail if repo doesn't exist on GitHub)
    git remote add origin "https://github.com/${ORGANIZATION}/${repo_name}.git"
    
    echo "Repository ${repo_name} setup complete!"
    cd "${WORKSPACE}"
}

# Main setup process
echo "Starting repository setup..."

for repo in "${!REPOS[@]}"; do
    setup_repo "${repo}" "${REPOS[$repo]}"
done

echo "Repository setup complete! Please create the repositories on GitHub and then run:"
echo "cd repos/<repository> && git push -u origin main"

# Instructions for manual steps
cat <<EOF

Manual steps required:
1. Create repositories on GitHub:
   - Public repositories:
     * ${ORGANIZATION}/8thDegree
     * ${ORGANIZATION}/8thDegree-docs
     * ${ORGANIZATION}/8thDegree-examples
   - Private repositories:
     * ${ORGANIZATION}/8thDegree-core
     * ${ORGANIZATION}/8thDegree-ai
     * ${ORGANIZATION}/8thDegree-infra

2. For each repository:
   - Enable branch protection rules
   - Set up required status checks
   - Configure team access
   - Enable security features

3. Push the initial code:
   cd repos/<repository>
   git push -u origin main

4. Set up GitHub Actions:
   - Add GITHUB_TOKEN secret
   - Configure workflow permissions
   - Enable security scanning
EOF 