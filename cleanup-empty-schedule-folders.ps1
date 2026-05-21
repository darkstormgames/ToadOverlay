$scheduleRoot = Join-Path $PSScriptRoot "app_data\schedule"

$emptyFolders = Get-ChildItem -Path $scheduleRoot -Directory | Where-Object {
    (Get-ChildItem -Path $_.FullName -Recurse -File).Count -eq 0
}

if ($emptyFolders.Count -eq 0) {
    Write-Host "No empty folders found in app_data\schedule."
    exit 0
}

Write-Host "Found $($emptyFolders.Count) empty folder(s) in app_data\schedule:"
$emptyFolders | ForEach-Object { Write-Host "  - $($_.Name)" }

$confirm = Read-Host "`nDelete all $($emptyFolders.Count) empty folder(s)? (y/N)"
if ($confirm -eq 'y') {
    $emptyFolders | Remove-Item -Recurse -Force
    Write-Host "Deleted $($emptyFolders.Count) folder(s)."
} else {
    Write-Host "Aborted. No folders were deleted."
}
