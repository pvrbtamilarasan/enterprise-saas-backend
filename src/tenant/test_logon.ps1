$loginData = @{
    email = "admin@mycomp.com"
    password = "Password123!"
} | ConvertTo-Json

$authResult = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $loginData -ContentType "application/json"
$token = $authResult.access_token