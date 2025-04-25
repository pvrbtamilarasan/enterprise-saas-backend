$tenantId = "354fbfa4-b4a5-4c08-ada2-15e0d34b988a"  # Replace with your actual tenant ID
$licenseData = @{
    tenantId = $tenantId
    enabledModules = @("dashboard", "hcm", "finance")
    isActive = $true
    expiresAt = (Get-Date).AddYears(1).ToString("o")  # 1 year from now
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/licensing" -Method Post -Body $licenseData -ContentType "application/json"