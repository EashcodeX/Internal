# Simple Guide to Deploy TIS on AWS

## Quick Start Steps

1. **Create AWS Account**
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Click "Create an AWS Account"
   - Follow the sign-up process

2. **Prepare Your App**
   ```bash
   # Build your app locally first
   npm run build
   
   # Make sure your .env file has these:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy to AWS**
   - Go to AWS Console
   - Search for "Amplify"
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Click "Save and deploy"

4. **Get Your URL**
   - Wait 2-3 minutes
   - Your app will be live at: `https://main.xxxxx.amplifyapp.com`

## AWS Free Tier Limits

AWS Amplify offers a generous free tier that includes:
- 1,000 build minutes per month
- 5GB storage
- 15GB data transfer per month
- 1,000 requests per day

After free tier:
- Build minutes: $0.01 per minute
- Storage: $0.023 per GB
- Data transfer: $0.09 per GB
- Requests: $0.0004 per request

## Need Help?

- Check AWS Amplify docs: [docs.aws.amazon.com/amplify](https://docs.aws.amazon.com/amplify)
- Contact AWS Support if stuck 