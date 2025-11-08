# Render Deployment Checklist

## ✅ Pre-Deployment

- [x] Production build created (`npm run build`)
- [x] Build successful (153.12 kB main.js, 8.37 kB main.css)
- [x] Environment variables configured (.env.production)
- [x] Backend API URL set: `https://e-learning-backend-5rau.onrender.com/api/v1`
- [x] render.yaml blueprint created
- [x] _redirects file for SPA routing
- [x] .gitignore configured

## 📋 Deployment Steps

### Method 1: Render Dashboard (Static Site)

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Click "New" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub/GitLab account
   - Select your repository
   - Choose branch: `main` or your working branch

3. **Configure Build Settings**
   ```
   Name: elearning-frontend
   Root Directory: frontend (if in monorepo) or leave blank
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Add Environment Variables**
   ```
   REACT_APP_API_BASE = https://e-learning-backend-5rau.onrender.com/api/v1
   NODE_VERSION = 18
   GENERATE_SOURCEMAP = false
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Wait for build to complete (~2-5 minutes)
   - Your site will be live at: `https://your-app-name.onrender.com`

### Method 2: Using Blueprint (render.yaml)

1. **Push render.yaml to repository**
   ```bash
   git add render.yaml .env.production DEPLOYMENT.md
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Create Blueprint Instance**
   - Go to: https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Select your repository
   - Render auto-detects `render.yaml` and configures everything

3. **Review and Deploy**
   - Verify settings match render.yaml
   - Click "Apply"

## 🔧 Post-Deployment

### 1. Verify Deployment
- [ ] Site is accessible at Render URL
- [ ] No 404 errors on page refresh (SPA routing works)
- [ ] API calls work (check Network tab)
- [ ] No CORS errors in console

### 2. Update Backend CORS
Your backend needs to allow your Render frontend URL:

```python
# In your FastAPI backend
origins = [
    "http://localhost:3000",
    "https://your-frontend-app.onrender.com",  # Add this
]
```

### 3. Test Core Features
- [ ] New Course creation works
- [ ] Export functionality works
- [ ] API connectivity indicator shows "connected"

### 4. Custom Domain (Optional)
- Go to Site Settings → Custom Domains
- Add your domain and update DNS records

## 🐛 Troubleshooting

### Build Fails
```bash
# Locally test the build
npm run build

# Check for TypeScript errors
npm run type-check

# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### CORS Errors
- Check browser console for specific error
- Verify backend CORS configuration
- Ensure REACT_APP_API_BASE is correct

### 404 on Page Refresh
- Verify `_redirects` file is in `public/` folder
- Render should copy it to build automatically
- Check Render logs for any redirect issues

### Environment Variables Not Working
- Ensure they start with `REACT_APP_`
- Rebuild after adding/changing env vars
- Check Render environment variables dashboard

## 📊 Expected Build Output

```
File sizes after gzip:
  153.12 kB  build/static/js/main.4bd812c5.js
  8.37 kB    build/static/css/main.4af375f9.css
```

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs/static-sites
- Your Backend: https://e-learning-backend-5rau.onrender.com
- API Health Check: https://e-learning-backend-5rau.onrender.com/api/v1/health

## 📝 Notes

- Free tier may have cold start delays (~1 minute after inactivity)
- Build time: ~2-5 minutes
- Auto-deploys on every push to main branch (if enabled)
- Build logs available in Render dashboard
