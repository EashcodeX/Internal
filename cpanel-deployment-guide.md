# Beginner's Guide to Hosting TIS on cPanel

This guide provides detailed step-by-step instructions for hosting your TIS React application on cPanel hosting, specifically designed for beginners.

## Prerequisites
- Your TIS codebase on your local computer
- cPanel hosting account credentials
- Node.js and npm installed on your local computer

## Step 1: Prepare Your Application for Production

1. Open your terminal/command prompt
2. Navigate to your TIS project folder:
   ```bash
   cd path/to/tis
   ```
3. Make sure all dependencies are installed:
   ```bash
   npm install
   ```
4. Create a production build:
   ```bash
   npm run build
   ```
5. This will create a `dist` folder containing optimized production files

## Step 2: Access Your cPanel Account

1. Open your web browser
2. Enter your cPanel URL (usually `https://yourdomain.com/cpanel` or the URL provided by your hosting provider)
3. Enter your username and password
4. Click "Login"

## Step 3: Upload Your Files

1. In cPanel dashboard, find and click on "File Manager" (usually in the "Files" section)
2. Navigate to your website's root directory:
   - This is typically `public_html` or `www`
   - Click on the folder to open it

3. Create a folder for your application (if you want to host it in a subdirectory):
   - Click the "+ Folder" button at the top
   - Name it (e.g., "tis")
   - Click "Create New Folder"
   - Open the newly created folder

4. Upload your build files:
   - Click the "Upload" button at the top
   - In the upload interface, click "Select File" or drag and drop files
   - Navigate to your local `dist` folder
   - Select all files and folders inside the `dist` directory
   - Wait for the upload to complete (this may take several minutes)

   **Alternative Method (for many files):**
   - Compress your `dist` folder contents into a ZIP file
   - Upload the ZIP file to cPanel
   - Right-click on the ZIP file and select "Extract"
   - Specify extraction path and click "Extract File(s)"

## Step 4: Configure Routing for Single Page Application

Your React app needs special server configuration to handle client-side routing. Create an `.htaccess` file:

1. In File Manager, navigate to the directory containing your uploaded files
2. Click "+ File" to create a new file
3. Name it `.htaccess` (including the dot)
4. Insert the following configuration:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```
5. If you're hosting in a subdirectory (e.g., `tis`), change the RewriteBase line to:
   ```apache
   RewriteBase /tis/
   ```
   And the last RewriteRule to:
   ```apache
   RewriteRule . /tis/index.html [L]
   ```
6. Click "Save Changes"

## Step 5: Configure Environment Variables (For Supabase)

For your TIS application with Supabase, you need to set up environment variables before building:

1. On your local machine, create a `.env.production` file in your project root:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```
2. Replace the placeholder values with your actual Supabase credentials
3. Build your application again with these environment variables:
   ```bash
   npm run build
   ```
4. Upload the newly generated files to cPanel as explained in Step 3

## Step 6: Set Up Domain/Subdomain (Optional)

If you want to use a specific domain or subdomain for your application:

1. In cPanel, scroll to the "Domains" section
2. Click on "Subdomains" (for creating a subdomain like tis.yourdomain.com)
3. Fill in the form:
   - Subdomain: Enter the prefix (e.g., "tis")
   - Domain: Select your domain from the dropdown
   - Document Root: Enter the path to your application files (e.g., "public_html/tis")
4. Click "Create"

## Step 7: Set Up SSL Certificate (Recommended)

Secure your site with HTTPS:

1. In cPanel, search for "SSL/TLS" or scroll to the "Security" section
2. Click on "SSL/TLS Status"
3. Find your domain/subdomain and click "Install Certificate"
4. Most hosting providers offer free Let's Encrypt certificates:
   - In cPanel, find "Let's Encrypt SSL"
   - Select your domain/subdomain
   - Click "Issue Certificate"
5. Wait for the certificate to be issued and installed

## Step 8: Test Your Application

1. Open your web browser
2. Visit your website URL:
   - Main domain: `https://yourdomain.com`
   - Subdomain: `https://tis.yourdomain.com`
   - Subdirectory: `https://yourdomain.com/tis`
3. Navigate through different pages to ensure routing works correctly
4. Check that all features are functioning properly

## Common Issues and Troubleshooting

### 404 Errors on Page Refresh

If you get 404 errors when refreshing pages or navigating directly to a URL:

1. Check your `.htaccess` file configuration
2. Make sure it's in the correct directory
3. Verify the `RewriteBase` path matches your deployment setup
4. Contact your hosting provider to ensure mod_rewrite is enabled

### API Connection Issues

If your app can't connect to Supabase:

1. Check that your environment variables were set correctly before building
2. Verify that the Supabase project has the correct CORS origins:
   - In the Supabase dashboard, go to Settings > API
   - Add your domain to the "Additional Allowed CORS Origins"

### "500 Internal Server Error"

If you see this error:

1. Check your server's error logs in cPanel (under "Logs" or "Error Log")
2. Ensure your `.htaccess` syntax is correct
3. Verify file permissions (files should be 644, directories 755)

## Updating Your Application

To update your application in the future:

1. Make changes to your code locally
2. Create new production build:
   ```bash
   npm run build
   ```
3. Upload and replace files on cPanel:
   - You can upload individual changed files
   - Or upload all files again and replace existing ones
   - Or use FTP software like FileZilla for easier file management

## Performance Optimization Tips

For better performance:

1. Add browser caching to your `.htaccess` file:
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/gif "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType image/svg+xml "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
     ExpiresByType application/pdf "access plus 1 month"
     ExpiresByType text/x-javascript "access plus 1 month"
   </IfModule>
   ```

2. Enable gzip compression:
   ```apache
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/plain
     AddOutputFilterByType DEFLATE text/html
     AddOutputFilterByType DEFLATE text/xml
     AddOutputFilterByType DEFLATE text/css
     AddOutputFilterByType DEFLATE application/xml
     AddOutputFilterByType DEFLATE application/xhtml+xml
     AddOutputFilterByType DEFLATE application/javascript
     AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   ```

## Need Further Assistance?

If you encounter issues not covered in this guide:
1. Check your hosting provider's documentation
2. Contact your hosting provider's support
3. Search for solutions specific to your cPanel version and hosting environment 