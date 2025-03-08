#!/bin/bash

# Configuration
ORG="FairGigAI"
WORKSPACE="$(pwd)/repos"
CURRENT_REPO="8thDegree"
TOKEN="${GITHUB_TOKEN}"

# Create workspace
mkdir -p "${WORKSPACE}"
cd "${WORKSPACE}"

# Clone current repository with submodules
echo "Cloning main repository and submodules..."
git clone --recursive "git@github.com:${ORG}/${CURRENT_REPO}.git"
cd "${CURRENT_REPO}"

# Function to check if repository exists
repo_exists() {
    local repo_name=$1
    gh repo view "${ORG}/${repo_name}" >/dev/null 2>&1
    return $?
}

# Create and setup new repositories
create_and_setup_repo() {
    local name=$1
    local visibility=$2
    local description=$3
    local is_submodule=${4:-false}
    
    echo "Setting up ${name}..."
    
    # Skip creation if repo exists (for submodules)
    if ! repo_exists "${name}"; then
        echo "Creating new repository ${name}..."
        gh repo create "${ORG}/${name}" --"${visibility}" --description "${description}" --template=false
    else
        echo "Repository ${name} already exists, skipping creation..."
    fi
    
    # If it's not a submodule, create new repository structure
    if [ "${is_submodule}" = "false" ]; then
        mkdir -p "../${name}"
        cd "../${name}"
        git init
        
        # Copy relevant files based on repository type
        case ${name} in
            "8thDegree-core")
                cp -r "../../${CURRENT_REPO}/backend" .
                cp "../../${CURRENT_REPO}/README.md" .
                cp "../../${CURRENT_REPO}/.gitignore" .
                ;;
                
            "8thDegree-docs")
                cp -r "../../${CURRENT_REPO}/docs" .
                cp "../../${CURRENT_REPO}/README.md" .
                ;;
                
            "8thDegree-examples")
                mkdir -p {frontend,backend,ai}/{basic,advanced}
                cp "../../${CURRENT_REPO}/README.md" .
                ;;
                
            "8thDegree-infra")
                mkdir -p {terraform,kubernetes,docker,monitoring}
                cp "../../${CURRENT_REPO}/docker-compose.yml" docker/
                cp "../../${CURRENT_REPO}/README.md" .
                ;;
        esac
        
        # Setup repository
        git add .
        git commit -m "Initial commit: Repository setup"
        git branch -M main
        git remote add origin "git@github.com:${ORG}/${name}.git"
        git push -u origin main
    fi
    
    # Setup branch protection
    echo "Setting up branch protection for ${name}..."
    gh api -X PUT "repos/${ORG}/${name}/branches/main/protection" \
        -f required_status_checks='{"strict":true,"contexts":["test","lint"]}' \
        -f enforce_admins=true \
        -f required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
        -f restrictions=null
    
    cd "${WORKSPACE}/${CURRENT_REPO}"
}

# Handle existing submodules first
echo "Handling existing submodules..."
create_and_setup_repo "8thDegree-ai" "private" "AI services for 8thDegree platform" true
create_and_setup_repo "8thDegree-preview" "public" "Preview site for 8thDegree platform" true

# Create new repositories
echo "Creating new repositories..."
create_and_setup_repo "8thDegree-core" "private" "Core backend services for 8thDegree platform"
create_and_setup_repo "8thDegree-docs" "public" "Documentation for 8thDegree platform"
create_and_setup_repo "8thDegree-examples" "public" "Example implementations for 8thDegree platform"
create_and_setup_repo "8thDegree-infra" "private" "Infrastructure configuration for 8thDegree platform"

# Clean up main repository
cd "${WORKSPACE}/${CURRENT_REPO}"
echo "Cleaning up main repository..."

# Keep only frontend and essential files
mkdir -p temp
mv frontend temp/
mv README.md temp/
mv LICENSE temp/
mv .gitignore temp/
mv .github temp/

# Keep submodule configurations
mv .gitmodules temp/
mv ai temp/
mv preview temp/

# Clean and restore
rm -rf *
mv temp/* .
rm -rf temp

# Update main repository
git add .
git commit -m "Reorganize repository structure while preserving submodules"
git push origin main

echo "Repository reorganization complete!"
echo
echo "New structure:"
echo "- ${ORG}/${CURRENT_REPO} (public, frontend)"
echo "- ${ORG}/8thDegree-ai (private, AI services) [existing submodule]"
echo "- ${ORG}/8thDegree-preview (public, preview site) [existing submodule]"
echo "- ${ORG}/8thDegree-core (private, backend)"
echo "- ${ORG}/8thDegree-docs (public, documentation)"
echo "- ${ORG}/8thDegree-examples (public, examples)"
echo "- ${ORG}/8thDegree-infra (private, infrastructure)"

echo
echo "Next steps:"
echo "1. Review the changes in each repository"
echo "2. Update any cross-repository references"
echo "3. Update CI/CD configurations"
echo "4. Update documentation with new repository structure" 