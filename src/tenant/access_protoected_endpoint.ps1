$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/users?tenantId=$tenantId" -Method Get -Headers $headers