/**
 * Development environment health check and diagnostics
 * Validates complete development environment setup
 */
const net = require("net");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
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

async function checkNodeVersion() {
  return new Promise((resolve) => {
    exec("node --version", (error, stdout) => {
      if (error) {
        resolve({ version: null, compatible: false });
        return;
      }
      const version = stdout.trim();
      const majorVersion = parseInt(version.substring(1).split(".")[0]);
      resolve({
        version: version,
        compatible: majorVersion >= 16, // Require Node 16+
      });
    });
  });
}

async function checkNpmVersion() {
  return new Promise((resolve) => {
    exec("npm --version", (error, stdout) => {
      if (error) {
        resolve({ version: null, compatible: false });
        return;
      }
      const version = stdout.trim();
      const majorVersion = parseInt(version.split(".")[0]);
      resolve({
        version: version,
        compatible: majorVersion >= 8, // Require npm 8+
      });
    });
  });
}

function checkProjectFiles() {
  const requiredFiles = [
    "package.json",
    "src/index.tsx",
    "src/App.tsx",
    "public/index.html",
    "tsconfig.json",
  ];

  const results = {};
  for (const file of requiredFiles) {
    results[file] = fs.existsSync(path.join(process.cwd(), file));
  }

  return results;
}

function checkPackageJson() {
  try {
    const packagePath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packagePath)) {
      return { exists: false };
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    const requiredDeps = {
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      typescript: "^5.0.0",
      "@reduxjs/toolkit": "^1.9.0",
      "react-redux": "^8.0.0",
    };

    const missingDeps = [];
    const installedDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const [dep, version] of Object.entries(requiredDeps)) {
      if (!installedDeps[dep]) {
        missingDeps.push(`${dep}@${version}`);
      }
    }

    return {
      exists: true,
      name: packageJson.name,
      version: packageJson.version,
      scripts: packageJson.scripts,
      missingDeps: missingDeps,
      hasStartScript: !!packageJson.scripts?.start,
      hasBuildScript: !!packageJson.scripts?.build,
      hasTestScript: !!packageJson.scripts?.test,
    };
  } catch (error) {
    return {
      exists: true,
      error: error.message,
    };
  }
}

async function runHealthCheck() {
  console.log("🏥 eLearning Editor Development Environment Health Check");
  console.log("=" * 65);

  let allHealthy = true;

  // Check Node.js version
  console.log("\n📦 Runtime Environment:");
  const nodeCheck = await checkNodeVersion();
  if (nodeCheck.compatible) {
    console.log(`   ✅ Node.js: ${nodeCheck.version}`);
  } else {
    console.log(
      `   ❌ Node.js: ${nodeCheck.version || "Not found"} (Requires Node 16+)`
    );
    allHealthy = false;
  }

  const npmCheck = await checkNpmVersion();
  if (npmCheck.compatible) {
    console.log(`   ✅ npm: ${npmCheck.version}`);
  } else {
    console.log(
      `   ❌ npm: ${npmCheck.version || "Not found"} (Requires npm 8+)`
    );
    allHealthy = false;
  }

  // Check project structure
  console.log("\n📁 Project Structure:");
  const projectFiles = checkProjectFiles();
  for (const [file, exists] of Object.entries(projectFiles)) {
    if (exists) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} (Missing required file)`);
      allHealthy = false;
    }
  }

  // Check package.json
  console.log("\n📋 Package Configuration:");
  const packageCheck = checkPackageJson();
  if (packageCheck.exists && !packageCheck.error) {
    console.log(
      `   ✅ package.json: ${packageCheck.name}@${packageCheck.version}`
    );

    if (packageCheck.hasStartScript) {
      console.log("   ✅ Start script available");
    } else {
      console.log("   ❌ Start script missing");
      allHealthy = false;
    }

    if (packageCheck.hasBuildScript) {
      console.log("   ✅ Build script available");
    } else {
      console.log("   ⚠️  Build script missing (optional)");
    }

    if (packageCheck.missingDeps.length > 0) {
      console.log(
        `   ⚠️  Missing dependencies: ${packageCheck.missingDeps.join(", ")}`
      );
    }
  } else if (packageCheck.error) {
    console.log(`   ❌ package.json: ${packageCheck.error}`);
    allHealthy = false;
  } else {
    console.log("   ❌ package.json: File not found");
    allHealthy = false;
  }

  // Check dependencies
  console.log("\n📚 Dependencies:");
  const nodeModulesExists = fs.existsSync("./node_modules");
  if (nodeModulesExists) {
    console.log("   ✅ Node modules installed");
  } else {
    console.log("   ❌ Node modules missing (Run: npm install)");
    allHealthy = false;
  }

  // Check frontend ports
  console.log("\n🌐 Port Availability:");
  const frontendPorts = [3000, 3001, 3002];
  let availablePortFound = false;
  for (const port of frontendPorts) {
    const available = await checkPort(port);
    console.log(
      `   Port ${port}: ${available ? "✅ Available" : "❌ Occupied"}`
    );
    if (available && !availablePortFound) {
      availablePortFound = true;
    }
  }

  if (!availablePortFound) {
    console.log(
      "   ⚠️  All common ports occupied - server will find alternative"
    );
  }

  // Check backend API
  console.log("\n🔧 Backend Integration:");
  const backendOnline = await checkBackendAPI();
  if (backendOnline) {
    console.log("   ✅ Backend API (http://localhost:8000): Online");
  } else {
    console.log("   ❌ Backend API (http://localhost:8000): Offline");
    console.log(
      "      💡 To start: cd ../backend && python -m uvicorn app.main:app --reload --port 8003"
    );
  }

  // Overall status and recommendations
  console.log("\n🎯 Health Assessment:");
  if (allHealthy && nodeModulesExists) {
    console.log("   ✅ Environment is healthy and ready for development!");
  } else {
    console.log("   ⚠️  Environment has issues that should be addressed");
  }

  // Recommendations
  console.log("\n💡 Recommendations:");
  if (!nodeModulesExists) {
    console.log("   • Run: npm install");
  }
  if (!backendOnline) {
    console.log("   • Start backend server for full functionality");
  }
  if (!availablePortFound) {
    console.log("   • Frontend will automatically select available port");
  }
  if (packageCheck.missingDeps && packageCheck.missingDeps.length > 0) {
    console.log("   • Install missing dependencies for optimal experience");
  }

  console.log("\n🚀 Ready to start development!");
  console.log("   Run: npm start");
  console.log("   Or:  npm run health && npm start");
  console.log("=" * 65);
}

// Handle help flag
if (process.argv.includes("--help")) {
  console.log(`
eLearning Editor Development Health Check

Usage:
  npm run health              # Run complete health check
  node scripts/health-check.js --verbose    # Detailed output

This tool validates:
  - Node.js and npm versions
  - Project file structure
  - Package.json configuration
  - Installed dependencies
  - Port availability
  - Backend API connectivity

Environment Requirements:
  - Node.js 16+ 
  - npm 8+
  - React 18+
  - TypeScript 5+
`);
  process.exit(0);
}

runHealthCheck();
