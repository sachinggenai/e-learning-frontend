#!/usr/bin/env pwsh
# Safe Commit Script - Backup + Add + Commit in one command

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = ".backups\backup_$timestamp"

Write-Host "🔄 Safe Commit Process Starting..." -ForegroundColor Cyan

# Step 1: Create timestamped backup
Write-Host "📦 Creating backup..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Backup src directory
if (Test-Path "src") {
    Copy-Item -Path "src" -Destination "$backupDir\src" -Recurse -Force
    Write-Host "   ✅ src/ backed up" -ForegroundColor Green
}

# Backup package files
@("package.json", "package-lock.json", "tsconfig.json", "vite.config.ts") | ForEach-Object {
    if (Test-Path $_) {
        Copy-Item -Path $_ -Destination "$backupDir\" -Force
    }
}

# Step 2: Stage all changes
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add .
Write-Host "   ✅ Files staged" -ForegroundColor Green

# Step 3: Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "$Message"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    Write-Host "   Backup: $backupDir" -ForegroundColor Gray
    Write-Host "   Message: $Message" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Nothing to commit or error occurred" -ForegroundColor Yellow
}

Write-Host ""
