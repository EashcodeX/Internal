# Push TIS to GitHub

## Quick Start

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Click "+" → "New repository"
   - Name it "tis"
   - Keep it Public or Private (your choice)
   - Don't initialize with README
   - Click "Create repository"

2. **Initialize Local Git**
   ```bash
   # Make sure you're in your project directory
   cd your-project-directory

   # Initialize git
   git init

   # Add all files
   git add .

   # First commit
   git commit -m "Initial commit"
   ```

3. **Connect to GitHub**
   ```bash
   # Add the remote repository
   git remote add origin https://github.com/YOUR_USERNAME/tis.git

   # Push to GitHub
   git push -u origin main
   ```

## Detailed Steps

### 1. Create .gitignore
Create a file named `.gitignore` in your project root:
```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 2. First Time Git Setup
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"
```

### 3. Push Your Code
```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push
git push -u origin main
```

### 4. Future Updates
```bash
# Check what files changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Common Issues

1. **Authentication Failed**
   - Use GitHub CLI: `gh auth login`
   - Or create a Personal Access Token:
     1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
     2. Generate new token
     3. Use token as password when pushing

2. **Branch Issues**
   ```bash
   # If main branch doesn't exist
   git branch -M main
   
   # If remote branch exists
   git pull origin main --allow-unrelated-histories
   ```

3. **Large Files**
   - Check for large files: `git status`
   - Add them to .gitignore
   - Use Git LFS for large files if needed

## Need Help?

- GitHub docs: [docs.github.com](https://docs.github.com)
- Git docs: [git-scm.com/doc](https://git-scm.com/doc)
- GitHub CLI: [cli.github.com](https://cli.github.com) 