# Deploy TIS to Vercel

## Quick Start

1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy Your App**
   ```bash
   # Make sure you're in your project directory
   cd your-project-directory

   # Deploy
   vercel
   ```

## Detailed Steps

### 1. Prepare Your App
```bash
# Build your app locally first to test
npm run build

# Make sure your .env file has these:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. First Deployment
```bash
# Run this command
vercel

# Vercel will ask you some questions:
# - Set up and deploy? → Yes
# - Which scope? → Select your account
# - Link to existing project? → No
# - What's your project name? → tis (or your preferred name)
# - In which directory is your code located? → ./
# - Want to override settings? → No
```

### 3. Add Environment Variables
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 4. Automatic Deployments
- Push to GitHub to automatically deploy
- Vercel will deploy when you:
  - Push to main branch
  - Create a pull request
  - Merge a pull request

## Vercel Free Tier Limits

- 100GB Bandwidth per month
- Unlimited personal projects
- Automatic HTTPS
- Global CDN
- Continuous deployment
- Team collaboration

## Common Issues

1. **Build Fails**
   - Check build logs in Vercel dashboard
   - Make sure all dependencies are in package.json
   - Verify environment variables are set

2. **Environment Variables**
   - Make sure they're added in Vercel dashboard
   - Check for typos in variable names
   - Redeploy after adding variables

3. **CORS Issues**
   - Update Supabase settings to allow your Vercel domain
   - Add domain to allowed origins in Supabase

## Need Help?

- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel support: [vercel.com/support](https://vercel.com/support)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord) 