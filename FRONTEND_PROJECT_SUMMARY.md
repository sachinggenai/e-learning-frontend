# Frontend Project Summary

## Overview

This project is the frontend of an e-learning authoring tool. It provides an interactive course editor and preview experience, supports template-driven content, manages course state in Redux, and integrates with a backend API to load/save course data, manage templates, upload media, export content, and perform scoring.

## Technologies

- React 18
- TypeScript 5.x
- Create React App via `react-scripts` 5.0.1
- Redux Toolkit + `react-redux`
- Axios for API requests
- `@hello-pangea/dnd` for drag-and-drop interactions
- `lucide-react` for icon rendering
- `ajv` for JSON schema validation
- `uuid` and `nanoid` for unique IDs
- ESLint and Prettier for code quality

## App Shell / Framework

- Built with Create React App using `react-scripts`
- Main entry point: `src/index.tsx`
- Root component: `src/App.tsx`
- App shell includes theme and toast providers, header/menu, editor and preview views, and error boundary handling
- Uses CRA default bundler and build pipeline

## API Integration

- API client is implemented in `src/services/httpClient.ts` and `src/services/api.ts`
- Base URL is configured via `REACT_APP_API_BASE` or `REACT_APP_API_URL`, with fallback to `http://localhost:8000/api/v1`
- Request URLs are relative to `/api/v1` and should not re-include the prefix
- Backend endpoints cover health, course validation, courses, pages, components, registry metadata, media upload, export, scoring, completion, and theme/registry data

## Frontend Architecture

- `src/index.tsx`
  - bootstraps React app and Redux provider

- `src/App.tsx`
  - application shell
  - checks backend health
  - syncs component registry metadata
  - toggles between editor and preview shells

- State management
  - Redux Toolkit store under `src/store`
  - typed hooks via `src/store`
  - slices, adapters, and middleware for course and editor state

- Component registry
  - `src/components/registry` and `src/components/registry/registrations`
  - dynamic registry-driven rendering of template and component types
  - supports authoring and preview workflows

- UI and theme
  - theme context in `src/context/ThemeContext`
  - global styling in `src/index.css`, `src/App.css`
  - template styling in `src/components/templates/TemplateStyles.css`

## Architecture Diagram

```text
Browser
  └─ React App (CRA / react-scripts)
       ├─ src/index.tsx
       │    └─ ReduxProvider
       └─ src/App.tsx
             ├─ ThemeProvider
             ├─ ToastProvider
             ├─ Header / MenuBar
             ├─ Editor / EditorV2
             ├─ Preview / PreviewV2
             ├─ ErrorBoundary
             └─ Registry bootstrap
                   └─ dynamic component/template registry

State
  └─ Redux Toolkit store (src/store)

Services
  └─ Axios API client (src/services/httpClient.ts)
        └─ baseURL: REACT_APP_API_BASE || /api/v1
        └─ course / page / component / registry / media / export / scoring APIs

Templates
  └─ src/components/templates
        ├─ TemplateStyles.css
        └─ Registry-driven renderers

Deployment
  └─ Build output: ./build
        └─ Render static site config (render.yaml)
```

## Deployment Target

- Static site deployment configured in `render.yaml`
- Build command: `npm ci --legacy-peer-deps && npm run build`
- Publish directory: `./build`
- Environment variables include `NODE_VERSION`, `REACT_APP_API_BASE`, and `GENERATE_SOURCEMAP`
