$body = @{
    name = "Test Tenant"
    subdomain = "test"
    isActive = $true
    settings = @{
        theme = "light"
        modules = @("dashboard", "hcm", "finance")
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/tenant" -Method Post -Body $body -ContentType "application/json"