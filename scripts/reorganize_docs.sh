#!/bin/bash

# Create new directory structure
mkdir -p docs/api
mkdir -p docs/architecture
mkdir -p docs/security
mkdir -p docs/development

# Move and rename AI documentation
mv ai/docs/API.md docs/api/ai.md
mv ai/docs/VISION_ALIGNMENT.md docs/architecture/ai.md
mv ai/docs/implementationplan.md docs/development/ai-implementation.md
mv ai/docs/cursorcontext.md docs/development/ai-context.md

# Move existing documentation to new structure
mv docs/api-reference.md docs/api/backend.md
mv docs/architecture.md docs/architecture/overview.md
mv docs/security-rules.md docs/security/guidelines.md
mv docs/ai-rules.md docs/development/ai-guidelines.md
mv docs/style-guide.md docs/development/style-guide.md

# Create missing documentation files
touch docs/api/frontend.md
touch docs/architecture/backend.md
touch docs/architecture/frontend.md
touch docs/development/getting-started.md
touch docs/development/workflow.md

# Move top-level documentation
mv CODE_OF_CONDUCT.md docs/
mv CONTRIBUTING.md docs/
mv LICENSE.md docs/
mv CLA.md docs/

# Clean up empty directories
rm -rf ai/docs

echo "Documentation reorganization complete!" 