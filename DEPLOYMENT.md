# eLearning Authoring Tool - Frontend

React + TypeScript eLearning course authoring application.

## Production Build

The production build is ready in the `build/` directory.

### Build Stats
- Main JS: 153.12 kB (gzipped)
- Main CSS: 8.37 kB (gzipped)

## Deployment to Render

### Option 1: Using Render Dashboard (Recommended)

1. **Create a New Static Site** on [Render](https://render.com)
   - Connect your GitHub repository
   - Select the `frontend` directory as the root

2. **Configure Build Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Branch:** `main` (or your default branch)

3. **Environment Variables:**
   - `REACT_APP_API_BASE`: `https://e-learning-backend-5rau.onrender.com/api/v1`
   - `NODE_VERSION`: `18`
   - `GENERATE_SOURCEMAP`: `false`

4. **Deploy:**
   - Click "Create Static Site"
   - Render will automatically build and deploy

### Option 2: Using render.yaml (Blueprint)

The `render.yaml` file is already configured. Push it to your repository and:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your repository
4. Render will auto-detect and deploy using `render.yaml`

### Manual Deployment (Alternative)

If deploying to a different static host:

```bash
# Build the production bundle
npm run build

# The build/ folder contains the production-ready files
# Upload to any static hosting service (Netlify, Vercel, AWS S3, etc.)
```

## Local Testing of Production Build

```bash
# Install serve globally
npm install -g serve

# Serve the production build locally
serve -s build

# Open http://localhost:3000
```

## Environment Configuration

Production environment uses `.env.production`:
- Backend API: `https://e-learning-backend-5rau.onrender.com/api/v1`
- Source maps: Disabled for security

## Build Output

```
build/
├── static/
│   ├── css/
│   │   └── main.4af375f9.css
│   └── js/
│       └── main.4bd812c5.js
├── index.html
├── manifest.json
└── _redirects (for SPA routing)
```

## Scripts

- `npm start` - Development server with hot reload
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Troubleshooting

**CORS Issues:**
- Ensure backend has CORS enabled for your Render frontend URL
- Backend should allow: `https://your-app.onrender.com`

**Routing Issues:**
- The `_redirects` file handles client-side routing
- All routes redirect to `index.html` for React Router

**Build Failures:**
- Check Node version (18+ required)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`

## Support

For deployment issues, check Render logs or contact support.
