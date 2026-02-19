# Setup Safe Commit Alias
# Run this ONCE to enable the 'safe-commit' command globally

$profilePath = $PROFILE.CurrentUserCurrentHost

# Check if profile exists, create if not
if (-not (Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
    Write-Host "✅ Created PowerShell profile" -ForegroundColor Green
}

# Get the project root
$projectRoot = Get-Location

# Read current profile
$profileContent = if (Test-Path $profilePath) { Get-Content $profilePath -Raw } else { "" }

# Check if alias already exists
if ($profileContent -like "*Set-Alias safe-commit*") {
    Write-Host "✅ Alias already exists in your profile" -ForegroundColor Green
} else {
    # Add the alias
    $aliasCommand = @"
`n# Safe Commit Script - Backup + Add + Commit
function safe-commit {
    param([string]`$Message)
    if (`$Message.Length -eq 0) {
        Write-Host "Usage: safe-commit 'Your commit message'" -ForegroundColor Yellow
        return
    }
    & pwsh -NoProfile -ExecutionPolicy Bypass -File "$projectRoot\safe-commit.ps1" -Message `$Message
}
"@
    
    Add-Content -Path $profilePath -Value $aliasCommand
    Write-Host "✅ Added 'safe-commit' command to your PowerShell profile" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now use:" -ForegroundColor White
Write-Host "  safe-commit 'Your message here'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Examples:" -ForegroundColor White
Write-Host "  safe-commit 'Fixed icon system'" -ForegroundColor Gray
Write-Host "  safe-commit 'Added theme documentation'" -ForegroundColor Gray
Write-Host "  safe-commit 'Updated template selector'" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: Close and reopen PowerShell to use the command" -ForegroundColor Cyan
