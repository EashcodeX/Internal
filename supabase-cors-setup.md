# How to Configure CORS in Supabase

This guide will walk you through the process of adding your domain to the "Additional Allowed CORS Origins" in Supabase to ensure your TIS application can connect to Supabase from your hosting domain.

## Step 1: Log in to Supabase Dashboard

1. Open your web browser
2. Go to [https://app.supabase.com/](https://app.supabase.com/)
3. Log in with your Supabase account credentials

## Step 2: Select Your Project

1. From the Supabase dashboard homepage, you'll see a list of your projects
2. Click on the project that you're using for your TIS application

## Step 3: Navigate to API Settings

1. In the left sidebar menu, click on "Project Settings" (the gear icon)
2. From the submenu, select "API"
3. Scroll down to the "CORS Configuration" section

## Step 4: Add Your Domain to CORS Origins

1. In the "Additional Allowed CORS Origins" section, click the "Add URL" button
2. Enter your website's domain including the protocol, for example:
   - `https://yourdomain.com`
   - `https://tis.yourdomain.com` (if using a subdomain)
   - `https://yourdomain.com/tis` (if using a subdirectory)

   > **Important Note:** 
   > - Include the protocol (`https://` or `http://`)
   > - Don't include trailing slashes
   > - Each URL pattern needs to be added separately
   > - For development, you might already have `http://localhost:5173` added

3. Click "Add" to save this URL
4. Repeat the process if you need to add multiple domains (e.g., both www and non-www versions)

## Step 5: Save Changes

1. After adding all your domains, look for a "Save" or "Apply Changes" button
2. Click it to apply your CORS configuration changes
3. Wait for confirmation that your changes have been saved

## Step 6: Verify Configuration

To verify that your CORS configuration is working:

1. Deploy your TIS application to your cPanel hosting
2. Open your application in the browser
3. Open the browser's developer tools (F12 or right-click > Inspect)
4. Go to the "Console" tab
5. Check for any CORS-related errors when your app tries to communicate with Supabase

If you see CORS errors like:

```
Access to fetch at 'https://your-project.supabase.co/...' from origin 'https://yourdomain.com' has been blocked by CORS policy
```

Double-check your CORS configuration and make sure:
- The exact domain is added (check for typos)
- You've included the correct protocol (http:// vs https://)
- Changes have been saved in the Supabase dashboard

## Common Issues

### Wrong URL Format
Ensure your URL is formatted correctly:
- ✅ `https://yourdomain.com`
- ❌ `https://yourdomain.com/` (avoid trailing slash)
- ❌ `yourdomain.com` (missing protocol)

### Subdomain vs. Main Domain
If you're using a subdomain, you need to add it specifically:
- The main domain (`https://yourdomain.com`) doesn't automatically cover subdomains
- Add `https://subdomain.yourdomain.com` separately

### HTTP vs. HTTPS
If your site can be accessed via both HTTP and HTTPS, add both versions:
- `http://yourdomain.com`
- `https://yourdomain.com`

### Wildcard Origins (Not Recommended for Production)
During development, you can use a wildcard:
- `*` allows all origins (major security risk, use only for testing)
- In production, always specify exact domains

## After Configuration

After setting up CORS correctly:

1. Rebuild your TIS application with the production Supabase credentials
2. Deploy to cPanel again
3. Test to ensure API calls to Supabase work correctly

If issues persist, check your browser's console for specific error messages that might provide more information. 