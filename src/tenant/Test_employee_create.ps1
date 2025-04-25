$tenantId = "354fbfa4-b4a5-4c08-ada2-15e0d34b988a"  # Replace with your actual tenant ID
$employeeData = @{
    tenantId = $tenantId
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    workEmail = "john.doe@company.com"
    employeeId = "EMP001"
    hireDate = (Get-Date).ToString("yyyy-MM-dd")
    jobTitle = "Software Engineer"
    department = "Engineering"
    employmentStatus = "Active"
    employmentType = "Full-time"
    isActive = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/hcm/employees" -Method Post -Body $employeeData -ContentType "application/json"