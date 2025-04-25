$tenantId = "354fbfa4-b4a5-4c08-ada2-15e0d34b988a"  # Use your actual tenant ID 
$userData = @{
    tenantId = $tenantId
    firstName = "Admin"
    lastName = "User"
    email = "admin@mycomp.com"
    password = "Password123!"
    roles = @("admin", "user")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body $userData -ContentType "application/json"