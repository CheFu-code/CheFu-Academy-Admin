Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$build = Join-Path $root "build"
$source = Join-Path $root "public\logo.png"

New-Item -ItemType Directory -Force -Path $build | Out-Null

function New-ResizedBitmap {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$Path
    )

    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(8, 145, 178))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $scale = [Math]::Min($Width / $Image.Width, $Height / $Image.Height) * 0.72
    $drawWidth = [int]($Image.Width * $scale)
    $drawHeight = [int]($Image.Height * $scale)
    $x = [int](($Width - $drawWidth) / 2)
    $y = [int](($Height - $drawHeight) / 2)

    $graphics.DrawImage($Image, $x, $y, $drawWidth, $drawHeight)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Bmp)
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Write-Ico {
    param(
        [System.Drawing.Image]$Image,
        [string]$Path
    )

    $sizes = @(16, 24, 32, 48, 64, 128, 256)
    $pngImages = @()

    foreach ($size in $sizes) {
        $bitmap = New-Object System.Drawing.Bitmap $size, $size
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($Image, 0, 0, $size, $size)

        $memory = New-Object System.IO.MemoryStream
        $bitmap.Save($memory, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngImages += ,$memory.ToArray()
        $memory.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }

    $stream = [System.IO.File]::Create($Path)
    $writer = New-Object System.IO.BinaryWriter $stream
    $writer.Write([UInt16]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]$sizes.Count)

    $offset = 6 + ($sizes.Count * 16)
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $size = $sizes[$i]
        $bytes = $pngImages[$i]
        $writer.Write([Byte]($(if ($size -eq 256) { 0 } else { $size })))
        $writer.Write([Byte]($(if ($size -eq 256) { 0 } else { $size })))
        $writer.Write([Byte]0)
        $writer.Write([Byte]0)
        $writer.Write([UInt16]1)
        $writer.Write([UInt16]32)
        $writer.Write([UInt32]$bytes.Length)
        $writer.Write([UInt32]$offset)
        $offset += $bytes.Length
    }

    foreach ($bytes in $pngImages) {
        $writer.Write($bytes)
    }

    $writer.Dispose()
    $stream.Dispose()
}

$image = [System.Drawing.Image]::FromFile($source)

Write-Ico -Image $image -Path (Join-Path $build "icon.ico")
New-ResizedBitmap -Image $image -Width 150 -Height 57 -Path (Join-Path $build "installer-header.bmp")
New-ResizedBitmap -Image $image -Width 164 -Height 314 -Path (Join-Path $build "installer-sidebar.bmp")

$image.Dispose()
