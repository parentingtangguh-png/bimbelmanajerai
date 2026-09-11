$ErrorActionPreference = 'Stop'
$bimbelKeys = npx.cmd --yes supabase@latest projects api-keys --project-ref ypofmienpffbpgrwpclm --output json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'Gagal membaca konfigurasi Supabase.' }
$bimbelPublic = @($bimbelKeys) | Where-Object { $_.type -eq 'publishable' } | Select-Object -First 1
if (-not $bimbelPublic.api_key) { throw 'Publishable key tidak ditemukan; tidak menggunakan secret key sebagai pengganti.' }
$bimbelConfig = @{ supabaseUrl='https://ypofmienpffbpgrwpclm.supabase.co'; supabasePublishableKey=$bimbelPublic.api_key } | ConvertTo-Json
$bimbelPublicDir = Join-Path $PSScriptRoot '../public'
New-Item -ItemType Directory -Force -Path $bimbelPublicDir | Out-Null
[System.IO.File]::WriteAllText((Join-Path $bimbelPublicDir 'config.json'), $bimbelConfig, [System.Text.UTF8Encoding]::new($false))
Write-Output 'Konfigurasi publik Supabase tersimpan. Tidak ada secret key yang ditulis.'
