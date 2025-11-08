/**
 * Enhanced development server startup with automatic port resolution
 * Solves port conflict issues and provides clean development experience
 */
const { exec, spawn } = require("child_process");
const net = require("net");
const fs = require("fs");
const path = require("path");

async function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

async function checkBackendAPI() {
  return new Promise((resolve) => {
    const http = require("http");
    const req = http.request(
      {
        hostname: "localhost",
        port: 8003,
        path: "/api/v1/health",
        method: "GET",
        timeout: 2000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => resolve(false));
    req.end();
  });
}

async function startDevelopmentServer() {
  try {
    console.log("🚀 Starting eLearning Editor Development Server...");
    console.log("=" * 60);

    // Check for existing PORT environment variable
    let targetPort = process.env.PORT || 3000;

    // Find available port
    const availablePort = await findAvailablePort(parseInt(targetPort));

    if (availablePort !== parseInt(targetPort)) {
      console.log(`⚠️  Port ${targetPort} is occupied by another process`);
      console.log(`✅ Using port ${availablePort} instead`);
    } else {
      console.log(`✅ Port ${availablePort} is available`);
    }

    // Check backend API status
    console.log("\n🔧 Checking backend API status...");
    const backendOnline = await checkBackendAPI();
    if (backendOnline) {
      console.log("✅ Backend API is online at http://localhost:8000");
    } else {
      console.log("⚠️  Backend API is offline - some features may not work");
      console.log(
        "   💡 To start backend: cd ../backend && python -m uvicorn app.main:app --reload --port 8003"
      );
    }

    // Set environment variables for React
    process.env.PORT = availablePort;
    process.env.BROWSER = process.env.BROWSER || "none"; // Prevent auto-opening multiple browsers
    process.env.FAST_REFRESH = "true";

    console.log("\n🌐 Starting React development server...");
    console.log(`   Frontend: http://localhost:${availablePort}`);
    console.log(`   Backend:  http://localhost:8000`);
    console.log("---" * 20);

    // Start the development server directly using react-scripts
    const reactScripts = spawn("npx", ["react-scripts", "start"], {
      stdio: "inherit",
      shell: true, // Use shell to resolve PATH issues on Windows
      env: {
        ...process.env,
        PORT: availablePort,
        BROWSER: "none",
        FAST_REFRESH: "true",
      },
    });

    // Handle process termination
    process.on("SIGINT", () => {
      console.log("\n👋 Shutting down development server...");
      reactScripts.kill("SIGINT");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      reactScripts.kill("SIGTERM");
      process.exit(0);
    });

    reactScripts.on("error", (error) => {
      console.error("❌ Error starting development server:", error);
      process.exit(1);
    });

    reactScripts.on("close", (code) => {
      if (code !== 0 && code !== null) {
        console.error(`❌ Development server exited with code ${code}`);
        process.exit(code);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start development server:", error);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes("--help")) {
  console.log(`
eLearning Editor Development Server

Usage:
  npm start                    # Start with automatic port detection
  PORT=3001 npm start         # Start on specific port
  npm run start:force         # Force start on port 3000 (may fail if occupied)

Environment Variables:
  PORT                        # Preferred port (default: 3000)
  BROWSER                     # Browser to open (default: none)
  FAST_REFRESH               # Enable React Fast Refresh (default: true)

Troubleshooting:
  - If port is occupied, server will auto-select next available port
  - Backend API should run on http://localhost:8000
  - Run 'npm run health' for environment diagnostics
`);
  process.exit(0);
}

startDevelopmentServer();
