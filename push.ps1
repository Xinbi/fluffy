<#
.SYNOPSIS
  Stage, commit, and push to the *current* git branch.

.PARAMETER Message
  Commit message.

.PARAMETER Remote
  Remote name (default: origin).

.PARAMETER NoStage
  Do not run "git add ."

.PARAMETER Confirm
  Ask for confirmation before pushing.

.PARAMETER PushTags
  Also push tags after pushing the branch.

.EXAMPLE
  ./push.ps1 "Update styles"

.EXAMPLE
  ./push.ps1 "Release v1.2.0" -PushTags -Confirm
#>

param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Message,

  [Parameter(Position = 1)]
  [string]$Remote = "origin",

  [switch]$NoStage,
  [switch]$Confirm,
  [switch]$PushTags
)

# Ensure we're inside a git repo
try {
  $null = git rev-parse --is-inside-work-tree 2>$null
} catch {
  Write-Error "Not a git repository. Run this inside your repo."
  exit 1
}

# Determine current branch
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if (-not $branch -or $branch -eq "HEAD") {
  Write-Error "Could not determine current branch (detached HEAD?)."
  exit 1
}

# Optionally stage everything
if (-not $NoStage) {
  git add .
}

# If nothing is staged/changed, skip commit gracefully
$pending = (git status --porcelain).Trim()
if ([string]::IsNullOrWhiteSpace($pending)) {
  Write-Host "No changes to commit on branch '$branch'."
} else {
  git commit -m "$Message"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Commit failed."
    exit $LASTEXITCODE
  }
}

# Confirm push if requested
if ($Confirm) {
  $answer = Read-Host "Push branch '$branch' to remote '$Remote'? (y/N)"
  if ($answer -ne 'y' -and $answer -ne 'Y') {
    Write-Host "Push cancelled."
    exit 0
  }
}

# Push branch
git push $Remote $branch
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Optionally push tags
if ($PushTags) {
  git push $Remote --tags
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Pushed '$branch' to '$Remote' successfully."
