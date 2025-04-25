# clear-host
Write-Host "Starting authentication flow..." -ForegroundColor Green

# Step 1: Define variables
$baseUrl = "http://localhost:3000"
$tenantId = "354fbfa4-b4a5-4c08-ada2-15e0d34b988a"  # Replace with your actual tenant ID

# Step 2: Register a new user
Write-Host "Creating test user..." -ForegroundColor Yellow
$userData = @{
    tenantId = $tenantId
    firstName = "Admin"
    lastName = "User"
    email = "admin@example.com"
    password = "Password123!"
    roles = @("admin", "user")
} | ConvertTo-Json

try {
    $registerResult = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $userData -ContentType "application/json" -ErrorAction Stop
    Write-Host "User registered successfully!" -ForegroundColor Green
    Write-Host "User details:" -ForegroundColor Green
    $registerResult | Format-List
} catch {
    Write-Host "Error registering user (this may be OK if user already exists):" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

# Step 3: Login with the created user
Write-Host "Logging in..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $authResult = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token received:" -ForegroundColor Green
    Write-Host $authResult.access_token
    
    # Store the token
    $token = $authResult.access_token
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    # Step 4: Test accessing the profile endpoint
    Write-Host "`nAccessing profile endpoint..." -ForegroundColor Yellow
    try {
        $profileResult = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "Profile access successful!" -ForegroundColor Green
        Write-Host "Profile data:" -ForegroundColor Green
        $profileResult | Format-List
    } catch {
        Write-Host "Error accessing profile:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host "Status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
    
    # Step 5: Test accessing the users endpoint
    Write-Host "`nAccessing users endpoint..." -ForegroundColor Yellow
    try {
        $usersResult = Invoke-RestMethod -Uri "$baseUrl/users?tenantId=$tenantId" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "Users access successful!" -ForegroundColor Green
        Write-Host "Users data:" -ForegroundColor Green
        $usersResult | Format-Table
    } catch {
        Write-Host "Error accessing users:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host "Status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error logging in:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nAuthentication flow complete." -ForegroundColor Green