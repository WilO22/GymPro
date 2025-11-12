# Script de verificacion para deployment en Vercel

Write-Host "Verificando configuracion de Vercel..." -ForegroundColor Cyan
Write-Host ""

$success = $true

# 1. Verificar vercel.json
Write-Host "1. Verificando vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "   OK: vercel.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR: vercel.json NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# 2. Verificar .vercelignore
Write-Host "2. Verificando .vercelignore..." -ForegroundColor Yellow
if (Test-Path ".vercelignore") {
    Write-Host "   OK: .vercelignore encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR: .vercelignore NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# 3. Verificar environment.prod.ts
Write-Host "3. Verificando environment.prod.ts..." -ForegroundColor Yellow
if (Test-Path "src\environments\environment.prod.ts") {
    Write-Host "   OK: environment.prod.ts encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR: environment.prod.ts NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# 4. Verificar environment.ts
Write-Host "4. Verificando environment.ts..." -ForegroundColor Yellow
if (Test-Path "src\environments\environment.ts") {
    Write-Host "   OK: environment.ts encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR: environment.ts NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# 5. Verificar package.json
Write-Host "5. Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   OK: package.json encontrado" -ForegroundColor Green
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.scripts.build) {
        Write-Host "   OK: Script build encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Script build NO encontrado" -ForegroundColor Red
        $success = $false
    }
} else {
    Write-Host "   ERROR: package.json NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# 6. Verificar angular.json
Write-Host "6. Verificando angular.json..." -ForegroundColor Yellow
if (Test-Path "angular.json") {
    Write-Host "   OK: angular.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR: angular.json NO encontrado" -ForegroundColor Red
    $success = $false
}
Write-Host ""

# Resumen
Write-Host "============================================" -ForegroundColor Cyan
if ($success) {
    Write-Host "TODO ESTA LISTO PARA VERCEL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Green
    Write-Host "1. git add ." -ForegroundColor Gray
    Write-Host "2. git commit -m 'Config para Vercel'" -ForegroundColor Gray
    Write-Host "3. git push origin main" -ForegroundColor Gray
    Write-Host "4. Ve a https://vercel.com/new" -ForegroundColor Gray
} else {
    Write-Host "Hay problemas que corregir" -ForegroundColor Red
}
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
