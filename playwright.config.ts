import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Testing with Screenshots
 * Automatically captures screenshots on failure and for critical steps
 */
export default defineConfig({
  testDir: './e2e',
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  // Test execution settings
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI, // Fail CI if test.only is committed
  retries: process.env.CI ? 2 : 0, // Retry on CI
  workers: 1, // Single worker for consistent results
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Screenshot and video settings
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    
    // Screenshot configuration
    screenshot: 'on', // Capture on test failure and allow manual screenshots
    
    // Video recording
    video: 'retain-on-failure', // Keep video on failure
    
    // Trace for debugging
    trace: 'retain-on-failure',
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (for local dev)
    ignoreHTTPSErrors: true,
    
    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run dev server before tests
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
