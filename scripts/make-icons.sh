#!/usr/bin/env bash
#
# Regenerate the static icon set in public/ from a large square source image.
# The outputs are committed; this only needs to run when the icon changes.
# Needs ImageMagick 7 (magick) and pngquant.
#
# The original 588 px source is favicon.png at the repo root before the Astro port:
#   git show 2a7a2ab:favicon.png > /tmp/favicon-source.png
#   scripts/make-icons.sh /tmp/favicon-source.png

set -euo pipefail

src="${1:?usage: scripts/make-icons.sh SOURCE.png}"
out="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public"

# resize SIZE OUTPUT [extra magick options...]: square PNG, palette-quantized.
resize() {
    local size="$1" dest="$2"
    shift 2
    magick "$src" -filter Lanczos -resize "${size}x${size}" "$@" -strip "png32:$dest"
    pngquant --force --skip-if-larger --quality 60-90 --speed 1 --strip --ext .png "$dest"
}

resize 96 "$out/favicon.png"
resize 192 "$out/android-chrome-192x192.png"
resize 512 "$out/android-chrome-512x512.png"
# iOS draws transparent touch icons on black, so give it a white background.
resize 180 "$out/apple-touch-icon.png" -background white -alpha remove -alpha off

magick "$src" -filter Lanczos -define icon:auto-resize=48,32,16 "$out/favicon.ico"

ls -l "$out"/favicon.png "$out"/favicon.ico "$out"/apple-touch-icon.png "$out"/android-chrome-*.png
